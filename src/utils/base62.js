const enigma = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

function encode(_id) {
    let encodedId = '';
    while (_id) {
        encodedId = enigma[_id % 62] + encodedId;
        _id = Math.floor(_id / 62);
    }
    return encodedId;
}

function decode(encodedId) {
    let _id = 0;
    for (let i = 0; i < encodedId.length; i++) {
        let idx = enigma.indexOf(encodedId[i]);
        if (idx < 0)
            return NaN;
        _id = _id * 62 + idx;
    }
    return _id;
}

module.exports = {
    encode: encode,
    decode: decode
}