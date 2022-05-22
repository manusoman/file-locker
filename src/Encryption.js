import { useState, useContext } from 'react';
import { UserMsgContext } from './App';
import { getValidatedPswd } from './modules/passwordManager';
import { createEncryptFileName, createDecryptFileName } from './modules/fileNameManager';
import './styles/Encryption.css';

export default function Encryption(props) {
    const { mode, cryptoTask } = props;
    const fileNamer = mode === 'Encrypt' ? createEncryptFileName : createDecryptFileName;
    const showUIMessage = useContext(UserMsgContext);
    const [files, setFiles] = useState([]);
    const [isDisabled, setIsDisabled] = useState({disabled : true });
    const [fileName, setFileName] = useState('');
    const [downloadLink, setDownloadLink] = useState('');

    const onFileSelect = e => {
        if(e.target.files.length) {
            setFiles(e.target.files);
            setIsDisabled({});
        } else setIsDisabled({disabled : true });
    };

    const prepareFileDownload = (result, sourceName, fileType) => {
        const link = URL.createObjectURL(new Blob([result], { type : fileType }));
        URL.revokeObjectURL(downloadLink);
        setFileName(fileNamer(sourceName));
        setDownloadLink(link);
    };

    const onAction = () => {
        // Start with encrypting only one file
        cryptoTask(files[0], getValidatedPswd(), prepareFileDownload)
        .catch(err => {
            showUIMessage(err.message, true);
            console.error(err);
        });
    }

    return (
        <div className={props.className}>
            <input type="file" onChange={onFileSelect} multiple />
            <input type="button" {...isDisabled} value={mode} onClick={onAction} />
            <a className="linkButton" href={downloadLink} download={fileName} >Download</a>
        </div>
    );
}
