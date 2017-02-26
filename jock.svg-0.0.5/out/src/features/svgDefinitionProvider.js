"use strict";
const vscode_1 = require("vscode");
const utils = require("./utils");
class SvgDefinitionProvider {
    provideDefinition(document, position, token) {
        let idRefRange = document.getWordRangeAtPosition(position, /url\(#[^\)\r\n]+\)/);
        if (idRefRange && !idRefRange.isEmpty) {
            let body = document.getText();
            let idRef = document.getText(idRefRange);
            let id = idRef.substr(5, idRef.length - 6);
            let definePoint = body.indexOf(' id="' + id + '"');
            if (definePoint > 0) {
                let startTag = utils.getInStartTagFromOffset(token, body, definePoint);
                if (startTag) {
                    let pos = document.positionAt(startTag.index);
                    return new vscode_1.Location(document.uri, pos);
                }
            }
        }
        return null;
    }
}
exports.SvgDefinitionProvider = SvgDefinitionProvider;
//# sourceMappingURL=svgDefinitionProvider.js.map