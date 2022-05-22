import { useState } from 'react';

export default function Sign(props) {
    const [files, setFiles] = useState([]);
    const [isDisabled, setIsDisabled] = useState({disabled : true });

    const onFileSelect = () => {};
    const onAction = () => {};

    return (
        <div className={props.className}>
            <input type="file" onChange={onFileSelect} />
            <input type="button" {...isDisabled} value="Verify Signature" onClick={onAction} />
        </div>
    );
}
