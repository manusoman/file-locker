import { useRef, useContext } from 'react';
import { UserMsgContext } from './App';
import { generateKeyPair } from './modules/crypto';
import { genKeyInstructions } from './modules/texts';
import './styles/GenerateKey.css';

const zipper = new window.JSZip();

export default function GenerateKey(props) {
    const { showUIMessage } = useContext(UserMsgContext);
    const downloaderRef = useRef();

    const generateKeys = async () => {
        const [priv_key, pub_key] = await generateKeyPair();

        zipper.file('private_key', new Blob([priv_key], { type : 'application/octet-stream' }));
        zipper.file('public_key', new Blob([pub_key], { type : 'application/octet-stream' }));

        zipper.generateAsync({ type : 'blob' })
        .then(blob => {
            downloaderRef.current.href = URL.createObjectURL(blob);
            downloaderRef.current.click();
            props.disableGK();
        })
        .catch(err => {
            showUIMessage(err.message, 'error');
            console.error(err.message);
        });
    };

    return (
        <div className={`overlay ${props.visibility}`}>
            <a ref={downloaderRef} className="off" download="Digital Signature.zip"></a>
            <div id="gkBox">
                <h2>Signature Generation Instructions</h2>
                <p>{genKeyInstructions}</p>
                <div>
                    <input type="button" id="gkCancel" onClick={props.disableGK} value="Cancel" />
                    <input type="button" id="gkAgree" onClick={generateKeys} value="Create Digital Signature" />
                </div>
            </div>
        </div>
    );
};
