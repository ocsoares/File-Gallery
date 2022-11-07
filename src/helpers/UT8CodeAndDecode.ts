export const UTF8Encode = (unicodeString: string) => {
    const utf8String = unicodeString
        .replace(/[\u0080-\u07ff]/g, (c) => {
            let cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
        })
        .replace(/[\u0800-\uffff]/g, (c) => {
            let cc = c.charCodeAt(0);
            return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
        });
    return utf8String;
};

export const UTF8Decode = (utf8String: string) => {
    const unicodeString = utf8String
        .replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, (c) => {
            return String.fromCharCode(((c.charCodeAt(0) & 0x0f) << 12)
                | ((c.charCodeAt(1) & 0x3f) << 6)
                | (c.charCodeAt(2) & 0x3f));
        })
        .replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, (c) => {
            return String.fromCharCode((c.charCodeAt(0) & 0x1f) << 6
                | c.charCodeAt(1) & 0x3f);
        });
    return unicodeString;
};