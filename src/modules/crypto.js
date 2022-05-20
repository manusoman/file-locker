const subtleCrypto = window.crypto.subtle;
const cryptExtension = 'crypt';
const IVsize = 16;
const saltSize = 16;
let pswdCollector;

// Test Password: ifdgok123*

export const setPasswordCollector = func => pswdCollector = func;

const crypto = {
    encrypt : async (file, cb) => {
        const pswd = validatePswd();
        const { name, type } = file;
        const iv = window.crypto.getRandomValues(new Uint8Array(IVsize));
        const salt = window.crypto.getRandomValues(new Uint8Array(saltSize));

        const [data, key] = await Promise.all([
            file.arrayBuffer(),
            getBaseKey(pswd).then(baseKey => deriveKey(baseKey, salt))
        ]);

        const buff = await subtleCrypto.encrypt({ name : "AES-GCM", iv : iv }, key, data);
        cb(addIVandSalt(buff, iv, salt), createEncryptFileName(name), type);
    },

    decrypt : async (file, cb) => {
        const pswd = validatePswd();
        const { name, type } = file;
        const buff = await file.arrayBuffer();
        const [data, iv, salt] = detachIVandSalt(buff);
        const key = await getBaseKey(pswd).then(baseKey => deriveKey(baseKey, salt));
        const result = await subtleCrypto.decrypt({ name : "AES-GCM", iv : iv }, key, data);
        cb(result, createDecryptFileName(name), type);
    }
};


function validatePswd() {
    // Should contain at least 8 chars
    // Should and only contain digit, letter and symbol

    let status = false;
    const pswd = pswdCollector && pswdCollector();

    if(typeof pswd === 'string') {
        pswd = pswd.trim();

        // Check the presence of unwanted characters
        const r1 = /[^\d\w!@#$%^&*.]/i;

        // Check the presence of wanted characters
        const r2 = /^(?=.*\d)(?=.*\w)(?=.*[!@#$%^&*.]).{8,}$/i;
        
        status = !r1.test(pswd) && r2.test(pswd);
    }
    
    if(status) return pswd;
    throw new Error('Invalid password');
}

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

function createEncryptFileName(baseName) {
    const temp = baseName.split('.');
    const extn = temp.pop();
    temp.push(cryptExtension);
    temp.push(extn);
    return temp.join('.');
}

function createDecryptFileName(baseName) {
    const temp = baseName.split('.');
    const len = temp.length;

    if(len < 3 && temp[len - 2] !== cryptExtension) {
        return false;
    }

    const extn = temp.pop();
    temp.pop();
    temp.push(extn);
    return temp.join('.');
}


export default crypto;
