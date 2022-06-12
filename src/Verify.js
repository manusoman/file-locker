import { useContext, useState } from 'react';
import { UserMsgContext } from './App';
import FileInput from './FileInput';
import Instructions from './Instructions';

const verifyInstructions = ``;

export default function Sign(props) {
    const { showUIMessage } = useContext(UserMsgContext);
    const [signature, setSignature] = useState(null);
    const [pubkey, setPubkey] = useState(null);
    const [doc, setDoc] = useState(null);
    const [isDisabled, setIsDisabled] = useState({ disabled : true });

    const onFileSelect = (type, file) => {
        let enable = false;

        switch(type) {
            case 'signature':
                setSignature(file);
                enable = file && pubkey && doc;
                break;

            case 'pubkey':
                setPubkey(file);
                enable = file && signature && doc;
                break;

            case 'file':
                setDoc(file);
                enable = file && signature && pubkey;
                break;

            default:
        }
        
        setIsDisabled(enable ? {} : { disabled : true });
    };

    const submitForm = async e => {
        e.preventDefault();
        
        try {            
            if (await props.cryptoTask(signature, pubkey, doc)) {
                showUIMessage('Signature is valid', 'success');
            } else throw new Error('Invalid signature!');
        } catch(err) {
            showUIMessage(err.message, 'error');
            console.error(err);
        }
    };

    return (
        <div className={props.className}>
            <form onSubmit={submitForm}>
                <FileInput onChange={files => onFileSelect('signature', files[0])}>Select Signature</FileInput>
                <FileInput onChange={files => onFileSelect('pubkey', files[0])}>Select Public Key</FileInput>
                <FileInput onChange={files => onFileSelect('file', files[0])}>Select File</FileInput>
                <input type="submit" {...isDisabled} value="Verify Signature" />
            </form>
            <Instructions>{verifyInstructions}</Instructions>
        </div>
    );
}
