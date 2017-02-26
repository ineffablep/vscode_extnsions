'use strict';
const vscode = require("vscode");
const svgCompletionItemProvider_1 = require("./features/svgCompletionItemProvider");
const svgSymbolProvider_1 = require("./features/svgSymbolProvider");
const svgHoverProvider_1 = require("./features/svgHoverProvider");
const svgRenameProvider_1 = require("./features/svgRenameProvider");
const svgDefinitionProvider_1 = require("./features/svgDefinitionProvider");
const previewer_1 = require("./previewer");
const SVG_MODE = [
    'svg',
    {
        scheme: "file",
        language: "xml",
        pattern: "*.svg"
    }
];
function moveCursor(textEditor, edit, offset, showCompletionItems) {
    let selection = textEditor.selection;
    let doc = textEditor.document;
    let location = doc.offsetAt(selection.active);
    location += offset;
    let pos = doc.positionAt(location);
    textEditor.selection = new vscode.Selection(pos, pos);
    if (showCompletionItems === true) {
        vscode.commands.executeCommand('editor.action.triggerSuggest');
    }
}
function previewSvg() {
    let uri = vscode.Uri.parse("svg-preview:/jock/svg");
    previewer_1.SvgPreviwerContentProvider.lastActiveDocument = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document;
    vscode.commands.executeCommand('vscode.previewHtml', uri, vscode.ViewColumn.Two, `SVG Preview`);
}
function activate(context) {
    let d1 = vscode.languages.registerCompletionItemProvider(SVG_MODE, new svgCompletionItemProvider_1.SVGCompletionItemProvider(), "<", " ", "=", "\"");
    let d2 = vscode.commands.registerTextEditorCommand('_svg.moveCursor', moveCursor);
    let d3 = vscode.commands.registerTextEditorCommand('_svg.showSvg', previewSvg);
    let d4 = vscode.workspace.registerTextDocumentContentProvider('svg-preview', new previewer_1.SvgPreviwerContentProvider());
    let d5 = vscode.languages.registerDocumentSymbolProvider(SVG_MODE, new svgSymbolProvider_1.SvgSymbolProvider());
    let d6 = vscode.languages.registerHoverProvider(SVG_MODE, new svgHoverProvider_1.SvgHoverProvider());
    let d7 = vscode.languages.registerRenameProvider(SVG_MODE, new svgRenameProvider_1.SvgRenameProvider());
    let d8 = vscode.languages.registerDefinitionProvider(SVG_MODE, new svgDefinitionProvider_1.SvgDefinitionProvider());
    context.subscriptions.push(d1, d2, d3, d4, d5, d6, d7, d8);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map