"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hasPrefix(s, p) {
    return s.indexOf(p) === 0;
}
exports.hasPrefix = hasPrefix;
function hasSuffix(s, p) {
    let n = s.length - p.length;
    if (n < 0) {
        return false;
    }
    return s.lastIndexOf(p) === n;
}
exports.hasSuffix = hasSuffix;
