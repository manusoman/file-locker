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
    const [appInfoClass, setAppInfoClass] = useState('');

    const showUIMessage = (msg, mode = 'normal') => {
        setUserMessage({
            className : '',
            text : msg,
            mode
        });

        setTimeout(() => setUserMessage(msgOffState), 3000);
    };

    const showAppInfo = () => setAppInfoClass('');

    return (
        <>        
        <UserMsgContext.Provider value={{showUIMessage, showAppInfo}}>
            <Header />
            <Tabs />
        </UserMsgContext.Provider>
        <Footer />
        <Message {...userMessage}/>
        <AppInfo className={appInfoClass} onClose={() => setAppInfoClass('off')} />
        </>
    );
}
