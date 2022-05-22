
import { useState } from 'react';
import { setPasswordCollector } from './modules/passwordManager';
import './styles/Password.css';

export default function Password() {
    const [pswd, setPswd] = useState('');
    const onPswdChange = e => setPswd(e.target.value);
    setPasswordCollector(() => pswd);

    return <input id="pswd" type="password" onChange={onPswdChange} value={pswd} placeholder="Enter password" />;
}
