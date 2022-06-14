import { useState } from 'react';
import './styles/Tabs.css';
import TabHeads from './TabHeads';
import Encryption from './Encryption';
import Sign from './Sign';
import Verify from './Verify';
import crypto from './modules/crypto';

const tabLabels = ['Encrypt', 'Decrypt', 'Sign', 'Verify'];
const getTabContntClasses = index => {
    const a = Array(tabLabels.length).fill('off');
    a[index] = '';
    return a;
};

export default function Tabs(props) {
    const [tabContntClasses, setTabContntClasses] = useState(getTabContntClasses(0));
    const changeTab = index => setTabContntClasses(getTabContntClasses(index));

    return (
        <div id="tabs" className={props.className}>
            <div id="tabHeads">
                <TabHeads onChange={changeTab} labels={tabLabels} />
            </div>
            <div id="tabContents">
                <Encryption mode={tabLabels[0]} className={tabContntClasses[0]} cryptoTask={crypto.encrypt} />
                <Encryption mode={tabLabels[1]} className={tabContntClasses[1]} cryptoTask={crypto.decrypt} />
                <Sign className={tabContntClasses[2]} cryptoTask={crypto.sign} />
                <Verify className={tabContntClasses[3]} cryptoTask={crypto.verify} />
            </div>
        </div>
    );
}
