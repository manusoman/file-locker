import { useState, useContext, useRef } from 'react';
import { UserMsgContext } from './App';
import { createEncryptFileName, createDecryptFileName } from './modules/fileNameManager';
import FileInput from './FileInput';
import Instructions from './Instructions';
import './styles/Encryption.css';

const encInstructions = `Encrypt is used to encrypt the selected file with your login crendentials. It doesn't change the original file, but create a new encrypted one. Currently this app can't retrieve or change your password once it's lost. So, don't lose it.`;
const decInstructions = `Decrypt is used to decrypt the selected cryptic file with your login crendentials. Please note that, in order for this to work, you must use the same login credentials you used while encrypting the file.`;

export default function Encryption(props) {
    const { mode, cryptoTask } = props;
    const fileNamer = mode === 'Encrypt' ? createEncryptFileName : createDecryptFileName;
    const { showUIMessage } = useContext(UserMsgContext);
    const [files, setFiles] = useState([]);
    const [isDisabled, setIsDisabled] = useState({disabled : true });
    const downloader = useRef();

    const onFileSelect = files => {
        if(files.length) {
            setFiles(files);
            setIsDisabled({});
        } else setIsDisabled({disabled : true });
    };

    const prepareFileDownload = (result, sourceName, fileType) => {
        const link = URL.createObjectURL(new Blob([result], { type : fileType }));
        URL.revokeObjectURL(downloader.current.href);
        downloader.current.href = link;
        downloader.current.download = fileNamer(sourceName);
        downloader.current.click();
    };

    const submitForm = async e => {
        e.preventDefault();
        const { name, type } = files[0];

        try {
            const result = await cryptoTask(files[0]);
            prepareFileDownload(result, name, type);
        } catch (err) {
            showUIMessage(err.message, 'error');
            console.error(err.message);
        }
    };

    return (
        <div className={props.className}>
            <form onSubmit={submitForm}>
                <FileInput onChange={onFileSelect}>Select File</FileInput>
                <input type="submit" {...isDisabled} value={mode} />
                <a ref={downloader} className="off" ></a>
            </form>
            <Instructions>{mode === 'Encrypt' ? encInstructions : decInstructions}</Instructions>
        </div>
    );
}
