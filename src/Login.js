import { useContext, useState } from 'react';
import { generateKeys } from './modules/crypto';
import { UserMsgContext } from './App';
import './styles/Login.css';

export default function Login() {
    const showUIMessage = useContext(UserMsgContext);

    const onSubmitHandler = e => {
        e.preventDefault();

        const email = verifyEmail(e.target.email.value);
        const password = verifyPswd(e.target.password.value);

        if(!email || !password) {
            const errTxt = (!email && !password) ? 'Invalid email & password' :
                            `Invalid ${!email ? 'email' : 'password'}`;

            showUIMessage(errTxt, true);
            console.error(errTxt);
            return;
        }

        generateKeys(email, password)
        .catch(err => {
            showUIMessage(err.message, true);
            console.error(err);
        });
    };

    return (
        <form id="login" onSubmit={onSubmitHandler}>
            <Email /><Password /><input type="submit" value="Login" />
        </form>
    );
}


function Email() {
    const [email, setPswd] = useState('');
    const onEmailChange = e => setPswd(e.target.value);

    return <input name="email" id="email" type="text" onChange={onEmailChange} value={email} placeholder="Enter email" />;
}

function Password() {
    const [pswd, setPswd] = useState('');
    const onPswdChange = e => setPswd(e.target.value);

    return <input name="password" id="pswd" type="password" onChange={onPswdChange} value={pswd} placeholder="Enter password" />;
}


function verifyEmail(email) {
    let status = false;

    if(typeof email === 'string') {
        email = email.trim();
        const r = /^[\S]+$/i;
        status = r.test(email);
    }

    return status ? email : false;
}

function verifyPswd(pswd) {
    // Should contain at least 8 chars
    // Should and only contain digit, letter and symbol

    let status = false;

    if(typeof pswd === 'string') {
        pswd = pswd.trim();

        // Check the presence of unwanted characters
        const r1 = /[^\d\w!@#$%^&*.]/i;

        // Check the presence of wanted characters
        const r2 = /^(?=.*\d)(?=.*\w)(?=.*[!@#$%^&*.]).{8,}$/i;
        
        status = !r1.test(pswd) && r2.test(pswd);
    }
    
    return status ? pswd : false;
}

// Test Password: ifdgok123*
