"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsafeFastParseUnits = exports.unsafeFastParseEther = void 0;
const unsafeFastParseEther = (value) => {
    return (0, exports.unsafeFastParseUnits)(value, 18);
};
exports.unsafeFastParseEther = unsafeFastParseEther;
const unsafeFastParseUnits = (value, decimals) => {
    const parts = value.split('.');
    parts[0] = parts[0] || '';
    parts[1] = parts[1] || '';
    const zerosToAdd = decimals - parts[1].length;
    let etherValue = `${parts[0] !== '0' ? parts[0] : ''}${parts[1]}`;
    for (let i = 0; i < zerosToAdd; i++) {
        etherValue += '0';
    }
    return BigInt(etherValue);
};
exports.unsafeFastParseUnits = unsafeFastParseUnits;
//# sourceMappingURL=ether.js.map