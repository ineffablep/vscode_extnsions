"use strict";
const vscode_1 = require("vscode");
class SvgSymbolProvider {
    provideDocumentSymbols(document, token) {
        var body = document.getText();
        if (token.isCancellationRequested) {
            return undefined;
        }
        let regex = /<([\w\-]+)\s+[^>]*?id=\"([^\"]+)\"[^>]*?>/gi;
        let symbols = [];
        let e = null;
        while (!token.isCancellationRequested && (e = regex.exec(body))) {
            let name = e[1] + '#' + e[2];
            symbols.push(new vscode_1.SymbolInformation(name, vscode_1.SymbolKind.Object, null, new vscode_1.Location(document.uri, document.positionAt(e.index))));
        }
        return symbols;
    }
}
exports.SvgSymbolProvider = SvgSymbolProvider;
//# sourceMappingURL=svgSymbolProvider.js.map