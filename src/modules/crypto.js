const getRandomValueArray = size => window.crypto.getRandomValues(new Uint8Array(size));
const subtleCrypto = window.crypto.subtle;
const IVsize = 16;
const saltSize = 16;

let BASE_KEY_PROMISE = null;
let PUBLIC_KEY_PROMISE = null;
let PRIVATE_KEY_PROMISE = null;

export const obtainKeys = (email, pswd) => {
    const keyData = new TextEncoder().encode(`${email}${pswd}`);
    const baseKeyUsages = ['deriveBits', 'deriveKey'];
    BASE_KEY_PROMISE = subtleCrypto.importKey('raw', keyData, 'PBKDF2', false, baseKeyUsages);
};

export const obtainSignature = async key => {
    const [iv, salt, data] = detachIVandSalt(key);
    const unwrapAlgo = { name : "AES-GCM", iv };
    const unwrappedKeyAlgo = { name : 'ECDSA', namedCurve : 'P-256' };    
    const unwrappingKey = await BASE_KEY_PROMISE.then(key => deriveKey(key, salt));

    PRIVATE_KEY_PROMISE = subtleCrypto.unwrapKey('jwk', data, unwrappingKey, unwrapAlgo, unwrappedKeyAlgo, true, ['sign']);
    PUBLIC_KEY_PROMISE = getPublicKey(await PRIVATE_KEY_PROMISE);
};

export const generateKeyPair = async () => {
    const iv = getRandomValueArray(IVsize);
    const salt = getRandomValueArray(saltSize);
    const keyAlg = { name : 'ECDSA', namedCurve : 'P-256' };
    const wrapAlg = { name : "AES-GCM", iv };

    const [keyPair, wrappingKey] = await Promise.all([
        subtleCrypto.generateKey(keyAlg, true, ['sign', 'verify']),
        BASE_KEY_PROMISE.then(baseKey => deriveKey(baseKey, salt))
    ]);

    const buff = await subtleCrypto.wrapKey('jwk', keyPair.privateKey, wrappingKey, wrapAlg);
    return addIVandSalt(buff, iv, salt);
};

const crypto = {
    encrypt : async (file, cb) => {
        throw_noCredentials_error();

        const { name, type } = file;
        const iv = getRandomValueArray(IVsize);
        const salt = getRandomValueArray(saltSize);

        const [data, key] = await Promise.all([
            file.arrayBuffer(),
            BASE_KEY_PROMISE.then(baseKey => deriveKey(baseKey, salt))
        ]);

        const buff = await subtleCrypto.encrypt({ name : "AES-GCM", iv }, key, data);
        cb(addIVandSalt(buff, iv, salt), name, type);
    },

    decrypt : async (file, cb) => {
        throw_noCredentials_error();

        const { name, type } = file;
        const buff = await file.arrayBuffer();
        const [iv, salt, data] = detachIVandSalt(buff);
        const key = await BASE_KEY_PROMISE.then(baseKey => deriveKey(baseKey, salt));
        const result = await subtleCrypto.decrypt({ name : "AES-GCM", iv }, key, data);
        cb(result, name, type);
    },

    sign : async (file) => {
        // const baseKey = await getBaseKey(pswd);
        // const data = await file.arrayBuffer();
        // const keyPair = await generateKeyPair(baseKey);
        // subtleCrypto.sign(algorithm, key, data);
    },

    verify : async (file, signature) => {}
};

function throw_noCredentials_error() {
    if(!(BASE_KEY_PROMISE instanceof Promise)) {
        throw new Error('Missing username and/or password');
    }
}

async function getPublicKey(priv_key) {
    const temp = await subtleCrypto.exportKey('jwk', priv_key);
    delete temp.d;
    temp.key_ops = ['verify'];
    return subtleCrypto.importKey('jwk', temp, { name : 'ECDSA', namedCurve: 'P-256' }, true, ['verify']);
}

function deriveKey(baseKey, salt) {
    const derivedKeyAlgorithm = { name : 'AES-GCM', length : 256 };
    const keyUsages = ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'];
    // const keyUsages = ['wrapKey', 'unwrapKey'];
    const algorithm = {
        name : 'PBKDF2',
        hash : 'SHA-256',
        iterations : 10000,
        salt
    };

    return subtleCrypto.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, false, keyUsages);
}

function addIVandSalt(buff, iv, salt) {
    const data = new Uint8Array(IVsize + saltSize + buff.byteLength);

    data.set(iv);
    data.set(salt, IVsize);
    data.set(new Uint8Array(buff), IVsize + saltSize);

    return data;
}

function detachIVandSalt(buff) {
    buff = new Uint8Array(buff);

    return [
        buff.subarray(0, IVsize),
        buff.subarray(IVsize, IVsize + saltSize),
        buff.subarray(IVsize + saltSize)
    ]; // This returns [iv, salt, data]
}


export default crypto;
