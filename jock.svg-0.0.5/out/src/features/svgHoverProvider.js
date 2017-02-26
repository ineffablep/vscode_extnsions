"use strict";
const vscode_1 = require("vscode");
const svg_1 = require("./svg");
const utils = require("./utils");
let svg = null;
class SvgHoverProvider {
    constructor() {
        if (svg == null) {
            svg = svg_1.getSvgJson();
        }
    }
    provideHover(document, position, token) {
        let range = document.getWordRangeAtPosition(position);
        let prevChar = utils.getOffsetString(document, range.start, -1);
        let nextChar = utils.getOffsetString(document, range.end, 1);
        let tag = null, attribute = null;
        if (prevChar == '<' && nextChar == ' ') {
            tag = document.getText(range);
        }
        else if (/\s/.test(prevChar) && nextChar == '=') {
            attribute = document.getText(range);
        }
        if (tag) {
            if (svg.elements[tag]) {
                let ele = svg.elements[tag];
                return new vscode_1.Hover({
                    language: 'markdown',
                    value: '<' + tag + '>\n' + ele.documentation
                });
            }
        }
        if (attribute) {
            if (svg.attributes[attribute]) {
                let ele = svg.attributes[attribute];
                return new vscode_1.Hover({
                    language: 'markdown',
                    value: '[' + attribute + ']\n' + ele.documentation
                });
            }
        }
        return undefined;
    }
}
exports.SvgHoverProvider = SvgHoverProvider;
//# sourceMappingURL=svgHoverProvider.js.map