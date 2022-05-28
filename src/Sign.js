import { useState } from 'react';

export default function Sign(props) {
    const [files, setFiles] = useState([]);
    const [isDisabled, setIsDisabled] = useState({disabled : true });
    const [downloadLink, setDownloadLink] = useState('');
    const [fileName, setFileName] = useState('');

    const onFileSelect = () => {};
    const onAction = () => {};

    return (
        <div className={props.className}>
            <input type="file" onChange={onFileSelect} />
            <input type="button" {...isDisabled} value="Sign File" onClick={onAction} />
            <a className="linkButton" href={downloadLink} download={fileName} >Download Signature</a>
        </div>
    );
}