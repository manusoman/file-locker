import { useRef, useContext } from 'react';
import { UserMsgContext } from './App';
import { generateKeyPair } from './modules/crypto';
import './styles/GenerateKey.css';

const zipper = new window.JSZip();

export default function GenerateKey(props) {
    const showUIMessage = useContext(UserMsgContext);
    const downloaderRef = useRef();

    const generateKeys = async () => {
        const [priv_key, pub_key] = await generateKeyPair();
        // const data = new Blob([priv_key], { type : 'application/octet-stream' });
        // downloaderRef.current.href = URL.createObjectURL(data);
        // downloaderRef.current.click();
        // props.disableGK();

        zipper.file('private_key', new Blob([priv_key], { type : 'application/octet-stream' }));
        zipper.file('public_key', new Blob([pub_key], { type : 'application/octet-stream' }));

        zipper.generateAsync({type:"blob"})
        .then(blob => {
            downloaderRef.current.href = URL.createObjectURL(blob);
            downloaderRef.current.click();
            props.disableGK();
        })
        .catch(err => {
            showUIMessage(err.message, 'error');
            console.error(err);
        });
    };

    return (
        <div id="gkOverlay" className={props.visibility}>
            <a ref={downloaderRef} className="off" download="Digital Signature.zip"></a>
            <div id="gkBox">
                <input type="button" id="gkCancel" onClick={props.disableGK} value="Cancel" />
                <input type="button" id="gkAgree" onClick={generateKeys} value="I understand and continue" />
            </div>
        </div>
    );
};
