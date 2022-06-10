import { useContext, useState } from 'react';
import { UserMsgContext } from './App';
import FileInput from './FileInput';

export default function Sign(props) {
    const showUIMessage = useContext(UserMsgContext);
    const [signature, setSignature] = useState(null);
    const [pubkey, setPubkey] = useState(null);
    const [doc, setDoc] = useState(null);
    const [isDisabled, setIsDisabled] = useState({ disabled : true });

    const onFileSelect = (type, file) => {
        let enable = false;

        switch(type) {
            case 'signature':
                setSignature(file);
                enable = pubkey && doc;
                break;

            case 'pubkey':
                setPubkey(file);
                enable = signature && doc;
                break;

            case 'file':
                setDoc(file);
                enable = signature && pubkey;
                break;

            default:
        }
        
        enable ? setIsDisabled({}) : setIsDisabled({ disabled : true });
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
                <FileInput label='Select Signature' onChange={e => onFileSelect('signature', e.target.files[0])} />
                <FileInput label='Select Public Key' onChange={e => onFileSelect('pubkey', e.target.files[0])} />
                <FileInput label='Select File' onChange={e => onFileSelect('file', e.target.files[0])} />
                <input type="submit" {...isDisabled} value="Verify Signature" />
            </form>
        </div>
    );
}
