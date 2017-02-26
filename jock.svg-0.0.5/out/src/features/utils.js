"use strict";
const vscode_1 = require("vscode");
/**
 * 从数组删除一个成员
 * @param {Array<T>} array 要删除成员的数组。
 * @param {T} item 要删除的成员。
 * @returns {number} 如果删除成功，返回成员原来在数组中的索引，否则返回 -1。
 */
function removeItem(array, item) {
    let idx = array.indexOf(item);
    if (idx > -1) {
        array.splice(idx, 1);
    }
    return idx;
}
exports.removeItem = removeItem;
/**
 * 返回上一个 XML 标签的位置和名称，它可能是一个开始标签、结束标签。
 * @param {TextDocument} document 当前文档。
 * @param {Position} position 相对位置
 */
function getPrevTag(document, position) {
    let doc = document.getText();
    return getPrevTagFromOffset(doc, document.offsetAt(position));
}
exports.getPrevTag = getPrevTag;
/**
 * 返回上一个 XML 标签的位置和名称，它可能是一个开始标签、结束标签。
 * @param {TextDocument} document 当前文档。
 * @param {Position} position 相对位置
 */
function getPrevTagFromOffset(body, offset) {
    let doc = body.substr(0, offset);
    let match = /<([\/\!\?]?[\w\-]*)(\s*[^>]*)>[^>]*?$/gi.exec(doc);
    if (match && match.length > 1) {
        let attrs = match[2];
        return {
            index: match.index,
            tagName: match[1],
            tagAttrs: attrs,
            simple: attrs && attrs.endsWith('/')
        };
    }
    return undefined;
}
exports.getPrevTagFromOffset = getPrevTagFromOffset;
function getNextTagFromOffset(body, offset) {
    let doc = body.substr(offset);
    let match = /(^[^<]*?)<([\/\!\?]?[\w\-]*)(\s*[^>]*)>/gi.exec(doc);
    if (match && match.length > 1) {
        let attrs = match[3];
        return {
            index: match[1].length + offset,
            tagName: match[2],
            tagAttrs: attrs,
            simple: attrs && attrs.endsWith('/')
        };
    }
    return undefined;
}
exports.getNextTagFromOffset = getNextTagFromOffset;
/**
 * 返回父级 XML 标签的位置和名称。
 */
function getParentTag(token, document, position) {
    let doc = document.getText();
    return getParentTagFromOffset(token, doc, document.offsetAt(position));
}
exports.getParentTag = getParentTag;
/**
 * 返回父级 XML 标签的位置和名称。
 */
function getParentTagFromOffset(token, body, offset) {
    let stack = [];
    let tag = null;
    while (tag = getPrevTagFromOffset(body, offset)) {
        if (token.isCancellationRequested) {
            return undefined;
        }
        offset = tag.index;
        if (tag.simple === true) {
            continue;
        }
        else if (tag.tagName[0] == '/') {
            stack.push(tag.tagName.substr(1));
        }
        else if (stack.length == 0) {
            return tag;
        }
        else {
            stack.pop();
        }
    }
    return undefined;
}
exports.getParentTagFromOffset = getParentTagFromOffset;
/**
 * 如果当前在一个标签头内，返回 XML 标签信息，否则返回 undefined。
 */
function getInStartTag(token, doc, position) {
    return getInStartTagFromOffset(token, doc.getText(), doc.offsetAt(position));
}
exports.getInStartTag = getInStartTag;
/**
 * 如果当前在一个标签头内，返回 XML 标签信息，否则返回 undefined。
 */
function getInStartTagFromOffset(token, body, offset) {
    let doc = body.substr(0, offset);
    let match = /<([\/\!\?]?[\w\-]*)(\s*[^>]*?)$/gi.exec(doc);
    if (match && match.length > 1) {
        let attrs = match[2];
        return {
            index: match.index,
            tagName: match[1],
            tagAttrs: attrs,
            simple: attrs && attrs.endsWith('/')
        };
    }
    return undefined;
}
exports.getInStartTagFromOffset = getInStartTagFromOffset;
/**
 * 如果当前的标签在一个属性值信息内（有或没有开头双引号），返回 XML 标签属性信息，否则返回 undefined。
 */
function getInAttirubte(token, doc, position) {
    return getInAttirubteFromOffset(token, doc.getText(), doc.offsetAt(position));
}
exports.getInAttirubte = getInAttirubte;
/**
 * 如果当前的标签在一个属性值信息内（有或没有开头双引号），返回 XML 标签属性信息，否则返回 undefined。
 */
function getInAttirubteFromOffset(token, body, offset) {
    let tagMatchInfo = getInStartTagFromOffset(token, body, offset);
    if (tagMatchInfo && tagMatchInfo.tagAttrs) {
        let attrMatch = /([\w\-\:]*)=("[^"]*)$/gi.exec(tagMatchInfo.tagAttrs);
        if (attrMatch.length) {
            let attrValueStart = tagMatchInfo.index + tagMatchInfo.tagName.length + 1 + attrMatch.index + attrMatch[1].length + 1;
            return {
                index: tagMatchInfo.index,
                tagName: tagMatchInfo.tagName,
                tagAttrs: tagMatchInfo.tagAttrs,
                simple: tagMatchInfo.simple,
                attrName: attrMatch[1],
                attrValue: attrMatch[2],
                attrValueRange: [attrValueStart, attrValueStart + attrMatch[2].length]
            };
        }
    }
    return undefined;
}
exports.getInAttirubteFromOffset = getInAttirubteFromOffset;
function getOffsetString(doc, position, offset) {
    if (typeof offset != 'number') {
        offset = 1;
    }
    let curOffset = doc.offsetAt(position);
    curOffset += offset;
    let newPosition = doc.positionAt(curOffset);
    if (newPosition.isEqual(position)) {
        return undefined;
    }
    if (newPosition.isBefore(position)) {
        return doc.getText(new vscode_1.Range(newPosition, position));
    }
    else {
        return doc.getText(new vscode_1.Range(position, newPosition));
    }
}
exports.getOffsetString = getOffsetString;
//# sourceMappingURL=utils.js.map