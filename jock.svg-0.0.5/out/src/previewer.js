"use strict";
const vscode = require("vscode");
class SvgPreviwerContentProvider {
    constructor() {
        this._didChangeEventEmitter = new vscode.EventEmitter();
        this.onDidChange = this._didChangeEventEmitter.event;
        vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document == SvgPreviwerContentProvider.lastActiveDocument) {
                this._didChangeEventEmitter.fire(vscode.Uri.parse('svg-preview:/jock/svg'));
            }
        });
        vscode.window.onDidChangeActiveTextEditor(e => {
            this._didChangeEventEmitter.fire(vscode.Uri.parse('svg-preview:/jock/svg'));
        });
        let self = this;
    }
    isSvgDocument(document) {
        return /\.svg$/i.test(document.uri.path) || document.languageId == 'svg' || document.languageId == 'xml' && /^<svg\b/.test(document.getText());
    }
    provideTextDocumentContent(uri, token) {
        let activeTextEditor = vscode.window.activeTextEditor;
        if (activeTextEditor) {
            if (this.isSvgDocument(activeTextEditor.document)) {
                SvgPreviwerContentProvider.lastActiveDocument = activeTextEditor.document;
                return this.getLastContent();
            }
            return this.getLastContent();
        }
        return this.getLastContent();
    }
    getLastContent() {
        if (this.isSvgDocument(SvgPreviwerContentProvider.lastActiveDocument)) {
            return Promise.resolve(SvgPreviwerContentProvider.lastActiveDocument.getText());
        }
        return this.getReportHtml('Switch to or open a ".svg" file will show preview.');
    }
    getReportHtml(body) {
        return Promise.resolve(`<html>
<head>
<title>No Content</title>
</head>
<body>
<p style="color:#900">${body}</p>
</body>
</html>`);
    }
    dispose() {
        this._didChangeEventEmitter.dispose();
    }
}
exports.SvgPreviwerContentProvider = SvgPreviwerContentProvider;
//# sourceMappingURL=previewer.js.map