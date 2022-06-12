import { useRef, useState } from 'react';
import './styles/FileInput.css';

export default function FileInput(props) {
    const multiple = props.multiple ? { multiple : true } : {};
    const [visibility, setVisibilit] = useState('off');
    const [fileName, setFileName] = useState('');
    const fileInput = useRef();

    const onChangeHandler = () => {
        setFileName(fileInput.current.files[0].name);
        setVisibilit('');
        props.onChange(fileInput.current.files);
    };

    const clearFileSelection = e => {
        e.preventDefault();
        fileInput.current.value = null;
        props.onChange([]);
        setFileName('');
        setVisibilit('off');
    };
    
    return (
        <div className='fileInput'>
            <label>
                {props.children}
                <input ref={fileInput} className='off' type="file" onChange={onChangeHandler} {...multiple} />
            </label>
            <SelectedInput className={visibility} onClick={clearFileSelection} fileName={fileName} />
        </div>
    );
}

function SelectedInput(props) {
    return (
        <span className={`${props.className} selectedFile`}>
            <span>{props.fileName}</span>
            <button onClick={props.onClick} title="Clear this selection">
                <img src="close_icon.svg" alt="Clear file selection icon" />
            </button>
        </span>
    );
}
