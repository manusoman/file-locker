import { useContext, useState } from 'react';
import { UserMsgContext } from './App';
import { obtainKeys } from './modules/crypto';
import './styles/Login.css';

export default function Login() {
    const { showUIMessage, showAppActions } = useContext(UserMsgContext);

    const onSubmitHandler = async e => {
        e.preventDefault();

        const email = verifyEmail(e.target.email.value);
        const password = verifyPswd(e.target.password.value);

        if(!email || !password) {
            const errTxt = (!email && !password) ? 'Invalid email & password' :
                            `Invalid ${!email ? 'email' : 'password'}`;

            showAppActions(false);
            showUIMessage(errTxt, 'error');
            console.error(errTxt);
            return;
        }
        
        try {
            await obtainKeys(`${email}${password}`);
            const txt = 'Login successful';
            showAppActions(true);
            showUIMessage(txt, 'success');
            console.log(txt);
        } catch (err) {
            showAppActions(false);
            showUIMessage(err.message, 'error');
            console.error(err.message);
        }
    };

    return (
        <form id="login" onSubmit={onSubmitHandler}>
            <Email name="email" id="email" type="text" placeholder="Enter email" />
            <Password name="password" id="pswd" placeholder="Enter password" />
            <input id="loginButton" type="submit" value="Log in" />
        </form>
    );
}


function Email(props) {
    const [value, setValue] = useState('');
    const onValueChange = e => setValue(e.target.value);
    return <input {...props} onChange={onValueChange} value={value} />;
}

function Password(props) {
    const urls = ['visibility_on.svg', 'visibility_off.svg'];
    const [urlIndex, setUrlIndex] = useState(0);
    const [value, setValue] = useState('');
    const [type, setType] = useState('password');
    const [displayReqs, setDisplayReqs] = useState('off');
    const [showHideURL, setShowHideURL] = useState(urls[urlIndex]);
    const onValueChange = e => setValue(e.target.value);

    const changeType = e => {
        e.preventDefault();

        if (urlIndex) {
            setType('password');
            setShowHideURL(urls[0]);
            setUrlIndex(0);
        } else {
            setType('text');
            setShowHideURL(urls[1]);
            setUrlIndex(1);
        }
    };

    return (
        <div id={props.id}>
            <span>
                <input name={props.name} placeholder={props.placeholder} type={type} onFocus={() => setDisplayReqs('')} onBlur={() => setDisplayReqs('off')} onChange={onValueChange} value={value} />
                <button onClick={changeType}><img src={showHideURL}/></button>
            </span>
            <div id="pswdReqs" className={displayReqs}>
                The password must contain these and only these,<br/>1. letters<br/>2. digits<br/>3. symbols (!@#$%^&*.)
            </div>
        </div>
    );
}


const emailVerifier = /^(?!.*[^\w\d@.-])[\w\d.-]+@[\w\d.-]+\.[\w]{2,}$/m;
const pswdVerifier = /^(?!.*[^\d\w!@#$%^&*.])(?=.*\d)(?=.*\w)(?=.*[!@#$%^&*.]).{8,}$/m;

function verifyEmail(email) {
    let status = false;

    if(typeof email === 'string') {
        email = email.trim();
        status = emailVerifier.test(email);
    }

    return status ? email : false;
}

function verifyPswd(pswd) {
    // Should contain at least 8 chars
    // Should and only contain digits, letters and symbols

    let status = false;

    if(typeof pswd === 'string') {
        pswd = pswd.trim();        
        status = pswdVerifier.test(pswd);
    }
    
    return status ? pswd : false;
}

// Test Password: ifdgok123*
