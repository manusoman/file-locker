const cryptExtension = 'crypt';

export const createEncryptFileName = baseName => {
    const { name, extn } = getNameAndExtn(baseName);
    return `${name}.${cryptExtension}.${extn}`;
}

export const createDecryptFileName = baseName => {
    const { name, extn } = getNameAndExtn(baseName);
    const fileName = name.split('.');

    if(fileName[fileName.length - 1] === cryptExtension) {
        fileName.pop();
    }
    
    fileName.push(extn);
    return fileName.join('.');
}

function getNameAndExtn(fileName) {
    const noCharTest = /^ *\.* *$/i;
    const invalidCharTest = /[^\w\d .-]+/i;
    const endsWithDotTest = /^.*\.$/i;

    if(typeof fileName !== 'string' &&
      (noCharTest.test(fileName) ||
       endsWithDotTest.test(fileName) ||
       invalidCharTest.test(fileName))) {
        throw new Error('Invalid file name');
    }

    const temp = fileName.trim().split('.');

    if(temp.len === 1) {
        return { extn : '', name : temp[0] };
    }

    return { extn : temp.pop(), name : temp.join('.') };
}
