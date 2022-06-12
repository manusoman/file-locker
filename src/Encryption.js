import { useState, useContext } from 'react';
import { UserMsgContext } from './App';
import { createEncryptFileName, createDecryptFileName } from './modules/fileNameManager';
import FileInput from './FileInput';
import './styles/Encryption.css';

export default function Encryption(props) {
    const { mode, cryptoTask } = props;
    const fileNamer = mode === 'Encrypt' ? createEncryptFileName : createDecryptFileName;
    const showUIMessage = useContext(UserMsgContext);
    const [files, setFiles] = useState([]);
    const [isDisabled, setIsDisabled] = useState({disabled : true });
    const [fileName, setFileName] = useState('');
    const [downloadLink, setDownloadLink] = useState('');

    const onFileSelect = files => {
        if(files.length) {
            setFiles(files);
            setIsDisabled({});
        } else setIsDisabled({disabled : true });
    };

    const prepareFileDownload = (result, sourceName, fileType) => {
        const link = URL.createObjectURL(new Blob([result], { type : fileType }));
        URL.revokeObjectURL(downloadLink);
        setFileName(fileNamer(sourceName));
        setDownloadLink(link);
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
                <FileInput label="Select File" onChange={onFileSelect} />
                <input type="submit" {...isDisabled} value={mode} />
                <a className="off" href={downloadLink} download={fileName} ></a>
            </form>
        </div>
    );
}
