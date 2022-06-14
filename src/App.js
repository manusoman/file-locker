import { createContext, useState } from 'react';
import Header from './Header.js';
import Tabs from './Tabs.js';
import Footer from './Footer.js';
import Message from './Message';
import AppInfo from './AppInfo';

export const UserMsgContext = createContext();

export default function App() {
    const msgOffState = { className : 'off', text : '', mode : 'normal' };
    const [userMessage, setUserMessage] = useState(msgOffState);
    const [defaultClass, setDefaultClass] = useState('');
    const [tabClass, setTabClass] = useState('off');
    const [appInfoClass, setAppInfoClass] = useState('');

    const showUIMessage = (msg, mode = 'normal') => {
        setUserMessage({
            className : '',
            text : msg,
            mode
        });

        setTimeout(() => setUserMessage(msgOffState), 3000);
    };

    const showAppActions = flag => {
        if(flag) {
            setDefaultClass('off');
            setTabClass('');
        } else {
            setTabClass('off');
            setDefaultClass('');
        }
    };

    const showAppInfo = () => setAppInfoClass('');

    return (
        <>        
        <UserMsgContext.Provider value={{showUIMessage, showAppActions, showAppInfo}}>
            <Header />
            <DefaultBG className={defaultClass} />
            <Tabs className={tabClass} />
        </UserMsgContext.Provider>
        <Footer />
        <Message {...userMessage}/>
        <AppInfo className={appInfoClass} onClose={() => setAppInfoClass('off')} />
        </>
    );
}

function DefaultBG(props) {
    return <div id="defaultBG" className={props.className}>Log in to continue</div>;
}
