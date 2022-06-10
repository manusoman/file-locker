import { useState, useContext } from 'react';
import FileInput from './FileInput';
import { UserMsgContext } from './App';
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

    const onAction = async () => {
        // Start with encrypting only one file
        const { name, type } = files[0];

        try {
            const result = await cryptoTask(files[0]);
            prepareFileDownload(result, name, type);
        } catch (err) {
            showUIMessage(err.message, 'error');
            console.error(err);
        }
    };

    const submitForm = () => {};

    return (
        <div className={props.className}>
            <form onSubmit={submitForm}>
                <FileInput label="Select File" onChange={onFileSelect} multiple={true} />
                <input type="button" {...isDisabled} value={mode} onClick={onAction} />
                <a className="off" href={downloadLink} download={fileName} ></a>
            </form>
        </div>
    );
}
