const getRandomValueArray = size => window.crypto.getRandomValues(new Uint8Array(size));
const subtleCrypto = window.crypto.subtle;
const IVsize = 16;
const saltSize = 16;
const textEncoder = new TextEncoder();
let BASE_KEY_PROMISE = null;

export const obtainKeys = async loginData => {
    const keyData = textEncoder.encode(loginData);
    BASE_KEY_PROMISE = subtleCrypto.importKey('raw', keyData, 'PBKDF2', false, ['deriveKey']);
    await BASE_KEY_PROMISE;
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

    const [priv_key_wrapper, portable_pub_key] = await Promise.all([
        subtleCrypto.wrapKey('jwk', keyPair.privateKey, wrappingKey, wrapAlg),
        subtleCrypto.exportKey('raw', keyPair.publicKey)
    ]);

    return [addIVandSalt(priv_key_wrapper, iv, salt), portable_pub_key];
};

const crypto = {
    encrypt : async file => {
        throw_noCredentials_error();
        
        const iv = getRandomValueArray(IVsize);
        const salt = getRandomValueArray(saltSize);

        const [data, key] = await Promise.all([
            file.arrayBuffer(),
            BASE_KEY_PROMISE.then(baseKey => deriveKey(baseKey, salt))
        ]);

        const buff = await subtleCrypto.encrypt({ name : "AES-GCM", iv }, key, data);
        return addIVandSalt(buff, iv, salt);
    },

    decrypt : async file => {
        throw_noCredentials_error();
        
        const buff = await file.arrayBuffer();
        const [iv, salt, data] = detachIVandSalt(buff);
        const key = await BASE_KEY_PROMISE.then(baseKey => deriveKey(baseKey, salt));
        return subtleCrypto.decrypt({ name : "AES-GCM", iv }, key, data);
    },

    sign : async (privKeyFile, file) => {
        throw_noCredentials_error();
        const [privKey, data] = await Promise.all([
            privKeyFile.arrayBuffer().then(obtainSignature),
            file.arrayBuffer()
        ]);

        return subtleCrypto.sign({ name : 'ECDSA', hash : 'SHA-256' }, privKey, data);
    },

    verify : async (signatureBuff, pubKeyBuff, fileBuff) => {
        throw_noCredentials_error();

        const [signature, pubKey, data] = await Promise.all([
            signatureBuff.arrayBuffer(), pubKeyBuff.arrayBuffer(), fileBuff.arrayBuffer()
        ]);

        const keyAlg = { name : 'ECDSA', namedCurve : 'P-256' };
        const pubKeyImport = await subtleCrypto.importKey('raw', pubKey, keyAlg, true, ['verify']);

        return subtleCrypto.verify({ name : 'ECDSA', hash : 'SHA-256' }, pubKeyImport, signature, data);
    }
};

function throw_noCredentials_error() {
    if(!(BASE_KEY_PROMISE instanceof Promise)) {
        throw new Error('Missing username and/or password');
    }
}

async function obtainSignature(key) {
    const [iv, salt, data] = detachIVandSalt(key);
    const unwrapAlgo = { name : "AES-GCM", iv };
    const unwrappedKeyAlgo = { name : 'ECDSA', namedCurve : 'P-256' };    
    const unwrappingKey = await BASE_KEY_PROMISE.then(key => deriveKey(key, salt));
    return subtleCrypto.unwrapKey('jwk', data, unwrappingKey, unwrapAlgo, unwrappedKeyAlgo, true, ['sign']);
};

// This funciton might be needed for future features
// function getPublicKey(priv_key) {
//     const temp = await subtleCrypto.exportKey('jwk', priv_key);
//     delete temp.d;
//     temp.key_ops = ['verify'];
//     return subtleCrypto.importKey('jwk', temp, { name : 'ECDSA', namedCurve: 'P-256' }, true, ['verify']);
// }

function deriveKey(baseKey, salt) {
    const derivedKeyAlgorithm = { name : 'AES-GCM', length : 256 };
    const keyUsages = ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'];
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
    ]; // Returns [iv, salt, data]
}


export default crypto;
