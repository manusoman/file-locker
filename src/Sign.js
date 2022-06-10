import { useState, useRef, useContext } from 'react';
import { UserMsgContext } from './App';
import FileInput from './FileInput';
import GenerateKey from './GenerateKey';

const SNregExp = /^(.*)\.\w*$/i; // Signature Name reg exp

export default function Sign(props) {
    const [signature, setSignature] = useState(null);
    const [userFile, setFile] = useState(null);
    const [isDisabled, setIsDisabled] = useState({disabled : true });
    const [gkVisibility, setGKVisibility] = useState('off');
    const showUIMessage = useContext(UserMsgContext);
    const downloader = useRef();

    const prepareSignatureDownload = (buff, sourceName) => {
        const blob = new Blob([buff], { type : 'application/octet-stream' });
        downloader.current.href = URL.createObjectURL(blob);
        downloader.current.download = `${sourceName}.signature`;
        downloader.current.click();
    };

    const addFile = (file, isSignature) => {
        if(isSignature) {
            setSignature(file);
            userFile && setIsDisabled({});
        } else {            
            setFile(file);
            signature && setIsDisabled({});
        }
    };

    const submitForm = e => {
        e.preventDefault();
        const name = userFile.name.match(SNregExp)[1] || 'file';

        props.cryptoTask(signature, userFile)
        .then(buff => prepareSignatureDownload(buff, name))
        .catch(err => {
            showUIMessage(err.message, 'error');
            console.error(err);
        });
    };

    const style = {
        marginBottom : 30 + 'px',
        color : '#c0c0c0'
    };

    return (
        <div className={props.className}>
            <form onSubmit={submitForm}>
                <FileInput label="Select Private Key" onChange={e => addFile(e.target.files[0], true)} />
                <p style={style}>Don't have a key? <a onClick={() => setGKVisibility('')}>Create one</a></p>
                <FileInput label='Select File' onChange={e => addFile(e.target.files[0])} />
                <input type="submit" {...isDisabled} value="Sign File" />
                <a ref={downloader} className="off"></a>
            </form>            
            <GenerateKey visibility={gkVisibility} disableGK={() => setGKVisibility('off')} />
        </div>
    );
}
