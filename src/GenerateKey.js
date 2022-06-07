import { useRef } from 'react';
import { generateKeyPair } from './modules/crypto';
import './styles/GenerateKey.css';

export default function GenerateKey(props) {
    const downloaderRef = useRef();

    const generateKeys = async () => {
        const priv_key = await generateKeyPair();
        const data = new Blob([priv_key], { type : 'application/octet-stream' });
        downloaderRef.current.href = URL.createObjectURL(data);
        downloaderRef.current.click();
        props.disableGK();
    };

    return (
        <div id="gkOverlay" className={props.visibility}>
            <a ref={downloaderRef} className="off" download="Digital Signature.bin"></a>
            <div id="gkBox">
                <input type="button" id="gkCancel" onClick={props.disableGK} value="Cancel" />
                <input type="button" id="gkAgree" onClick={generateKeys} value="I understand and continue" />
            </div>
        </div>
    );
};
