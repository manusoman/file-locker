const subtleCrypto = window.crypto.subtle;
const IVsize = 16;
const saltSize = 16;

const crypto = {
    encrypt : async (file, pswd, cb) => {
        const { name, type } = file;
        const iv = window.crypto.getRandomValues(new Uint8Array(IVsize));
        const salt = window.crypto.getRandomValues(new Uint8Array(saltSize));

        const [data, key] = await Promise.all([
            file.arrayBuffer(),
            getBaseKey(pswd).then(baseKey => deriveKey(baseKey, salt))
        ]);

        const buff = await subtleCrypto.encrypt({ name : "AES-GCM", iv : iv }, key, data);
        cb(addIVandSalt(buff, iv, salt), name, type);
    },

    decrypt : async (file, pswd, cb) => {
        const { name, type } = file;
        const buff = await file.arrayBuffer();
        const [data, iv, salt] = detachIVandSalt(buff);
        const key = await getBaseKey(pswd).then(baseKey => deriveKey(baseKey, salt));
        const result = await subtleCrypto.decrypt({ name : "AES-GCM", iv : iv }, key, data);
        cb(result, name, type);
    },

    sign : async () => {},
    verify : async () => {}
};

function getBaseKey(pswd) {
    const keyData = new TextEncoder().encode(pswd);
    const keyUsages = ['deriveBits', 'deriveKey'];
    return subtleCrypto.importKey('raw', keyData, 'PBKDF2', false, keyUsages);
}

function deriveKey(baseKey, salt) {
    const derivedKeyAlgorithm = { name : 'AES-GCM', length : 256 };
    const keyUsages = ['encrypt', 'decrypt'];
    const algorithm = {
        name : 'PBKDF2',
        hash : 'SHA-256',
        salt : salt,
        iterations : 100000
    };

    return subtleCrypto.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, false, keyUsages);
}

function addIVandSalt(buff, iv, salt) {
    const data = new Uint8Array(buff.byteLength + IVsize + saltSize);
    data.set(new Uint8Array(buff), 0);
    data.set(iv, buff.byteLength);
    data.set(salt, buff.byteLength + IVsize);
    return data;
}

function detachIVandSalt(buff) {
    buff = new Uint8Array(buff);
    const buffLen = buff.length - (IVsize + saltSize);

    return [
        buff.subarray(0, buffLen),
        buff.subarray(buffLen, buffLen + IVsize),
        buff.subarray(buffLen + IVsize)
    ];
}


export default crypto;
