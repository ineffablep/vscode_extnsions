"use strict";
const vscode_1 = require("vscode");
const utils = require("./utils");
class SvgRenameProvider {
    showNonameMessage() {
        vscode_1.window.showInformationMessage('Rename only work in tag name, id attribute or #id.');
    }
    calcRange(document, start, size) {
        if (typeof start == 'number') {
            var startPos = document.positionAt(start);
            var endPos = document.positionAt(start + size);
            return new vscode_1.Range(startPos, endPos);
        }
        else {
            return this.calcRange(document, document.offsetAt(start), size);
        }
    }
    provideIdRename(document, oldId, newId, token) {
        var body = document.getText();
        var workspaceEdit = new vscode_1.WorkspaceEdit();
        let regex = new RegExp(`((id="${oldId}")|(url\\(#${oldId}\\)))`, 'g');
        let exp = null;
        let offset = 0;
        while (!token.isCancellationRequested && (exp = regex.exec(body))) {
            if (exp[2]) {
                workspaceEdit.replace(document.uri, this.calcRange(document, exp.index + 4, oldId.length), newId);
                offset += newId.length - oldId.length;
            }
            else if (exp[3]) {
                workspaceEdit.replace(document.uri, this.calcRange(document, exp.index + 5, oldId.length), newId);
                offset += newId.length - oldId.length;
            }
        }
        return workspaceEdit;
    }
    provideRenameStartTag(document, position, oldName, newName) {
        let level = 0;
        let body = document.getText();
        let offset = document.offsetAt(position);
        let tagInfo = null;
        let workspaceEdit = new vscode_1.WorkspaceEdit();
        while (tagInfo = utils.getPrevTagFromOffset(body, offset)) {
            if (!tagInfo.tagName.startsWith('/') && !tagInfo.simple) {
                level--;
                if (level <= 0) {
                    workspaceEdit.replace(document.uri, this.calcRange(document, tagInfo.index + 1, oldName.length), newName);
                    workspaceEdit.replace(document.uri, this.calcRange(document, position, oldName.length), newName);
                    break;
                }
            }
            else if (tagInfo.tagName.startsWith('/')) {
                level++;
            }
            offset = tagInfo.index - 2;
        }
        return workspaceEdit;
    }
    provideRenameEndTag(document, position, oldName, newName) {
        let level = 0;
        let body = document.getText();
        let startOffset = document.offsetAt(position);
        let offset = startOffset + oldName.length;
        let tagInfo = null;
        let workspaceEdit = new vscode_1.WorkspaceEdit();
        while (tagInfo = utils.getNextTagFromOffset(body, offset)) {
            // console.log('tagInfo', tagInfo.tagName);
            if (!tagInfo.tagName.startsWith('/') && !tagInfo.simple) {
                level++;
            }
            else if (tagInfo.tagName.startsWith('/')) {
                level--;
                if (level <= 0) {
                    workspaceEdit.replace(document.uri, this.calcRange(document, tagInfo.index + 2, oldName.length), newName);
                    workspaceEdit.replace(document.uri, this.calcRange(document, position, oldName.length), newName);
                    break;
                }
            }
            offset = tagInfo.index + oldName.length;
        }
        return workspaceEdit;
    }
    provideRenameEdits(document, position, newName, token) {
        let wordRange = document.getWordRangeAtPosition(position, /[(<\/)<#]?[a-zA-Z0-9_]+/);
        if (wordRange && !wordRange.isEmpty) {
            let word = document.getText(wordRange);
            // console.log('word', word);
            if (word.startsWith('</')) {
                return this.provideRenameStartTag(document, wordRange.start.translate(0, 2), word.substr(2), newName);
            }
            else if (word.startsWith('/')) {
                return this.provideRenameStartTag(document, wordRange.start.translate(0, 1), word.substr(1), newName);
            }
            else if (word.startsWith('<')) {
                return this.provideRenameEndTag(document, wordRange.start.translate(0, 1), word.substr(1), newName);
            }
            else if (word.startsWith('#')) {
                return this.provideIdRename(document, word.substr(1), newName, token);
            }
            else {
                wordRange = document.getWordRangeAtPosition(position, /id="[a-zA-Z0-9_]+"/);
                if (wordRange && !wordRange.isEmpty) {
                    return this.provideIdRename(document, word, newName, token);
                }
            }
        }
        return null;
    }
}
exports.SvgRenameProvider = SvgRenameProvider;
//# sourceMappingURL=svgRenameProvider.js.map