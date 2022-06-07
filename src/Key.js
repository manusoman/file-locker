import { useState } from 'react';
import GenerateKey from './GenerateKey';
import './styles/Key.css';

export default function Key() {
    const [gkVisibility, setGKVisibility] = useState('off');

    const createKey = e => {
        e.preventDefault();
        e.stopPropagation();
        setGKVisibility('');
    };

    return (
        <div id="key">
            <input name="keyInput" type="file" />
            <p>Don't have a key? <a onClick={createKey}>Create one</a></p>                    
            <GenerateKey visibility={gkVisibility} disableGK={() => setGKVisibility('off')} />
        </div>
    );
}
