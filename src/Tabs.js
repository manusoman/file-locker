import { useState } from 'react';
import './styles/Tabs.css';
import TabHeads from './TabHeads';
import Password from './Password';
import Encryption from './Encryption';
import crypto from './modules/crypto';

export default function Tabs() {
    const tabLabels = ['Encrypt', 'Decrypt'];
    const getTabContntClasses = index => {
        const a = Array(tabLabels.length).fill('off');
        a[index] = '';
        return a;
    };

    const [tabContntClasses, setTabContntClasses] = useState(getTabContntClasses(0));
    const changeTab = index => setTabContntClasses(getTabContntClasses(index));

    return (
        <div id="tabs">
            <div id="tabHeads">
                <TabHeads onChange={changeTab} labels={tabLabels} />
                <Password/>
            </div>
            <div id="tabContents">
                <Encryption mode='Encrypt' className={tabContntClasses[0]} cryptoTask={crypto.encrypt} />
                <Encryption mode='Decrypt' className={tabContntClasses[1]} cryptoTask={crypto.decrypt} />
            </div>
        </div>
    );
}
