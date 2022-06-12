import { useRef, useContext } from 'react';
import { UserMsgContext } from './App';
import { generateKeyPair } from './modules/crypto';
import './styles/GenerateKey.css';

const zipper = new window.JSZip();
const genKeyInstructions = `Digital signatures are used to verify the validity of an electornic document/file. In order to do that, you must first have a private key and a public key. Your private key must never be disclosed to another person under any circumstances. Whereas, public key can be shared freely. Select a document you want to sign and use your private key to digitaly sign it. This process produce a '.signature' file. Send that along with the file to the person who needs verifying your document. Clicking the 'I understand, continue' button below will produce a zip file which has both private and public keys in it. Extract the zip file and store the private key somewhere safe and share the puclic key to the people who will be using your digitally signed documents.`;

export default function GenerateKey(props) {
    const { showUIMessage } = useContext(UserMsgContext);
    const downloaderRef = useRef();

    const generateKeys = async () => {
        const [priv_key, pub_key] = await generateKeyPair();

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
        <div className={`overlay ${props.visibility}`}>
            <a ref={downloaderRef} className="off" download="Digital Signature.zip"></a>
            <div id="gkBox">
                <h2>Key Generation Instructions</h2>
                <p>{genKeyInstructions}</p>
                <div>
                    <input type="button" id="gkCancel" onClick={props.disableGK} value="Cancel" />
                    <input type="button" id="gkAgree" onClick={generateKeys} value="I understand, continue" />
                </div>
            </div>
        </div>
    );
};
