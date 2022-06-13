import { useContext, useState } from 'react';
import { UserMsgContext } from './App';
import { obtainKeys } from './modules/crypto';
import './styles/Login.css';

export default function Login() {
    const { showUIMessage } = useContext(UserMsgContext);

    const onSubmitHandler = async e => {
        e.preventDefault();

        const email = verifyEmail(e.target.email.value);
        const password = verifyPswd(e.target.password.value);

        if(!email || !password) {
            const errTxt = (!email && !password) ? 'Invalid email & password' :
                            `Invalid ${!email ? 'email' : 'password'}`;

            showUIMessage(errTxt, 'error');
            console.error(errTxt);
            return;
        }
        
        try { obtainKeys(`${email}${password}`); }
        catch(err) {
            showUIMessage(err.message, 'error');
            console.error(err.message);
        }
    };

    return (
        <form id="login" onSubmit={onSubmitHandler}>
            <LoginField name="email" id="email" type="text" placeholder="Enter email" />
            <LoginField name="password" id="pswd" type="password" placeholder="Enter password" />
            <input id="loginButton" type="submit" value="Login" />
        </form>
    );
}


function LoginField(props) {
    const [value, setValue] = useState('');
    const onValueChange = e => setValue(e.target.value);
    return <input {...props} onChange={onValueChange} value={value} />;
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
