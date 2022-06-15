import { appInfo } from './modules/texts';
import './styles/AppInfo.css';

export default function AppInfo(props) {
    return (
        <div className={`overlay ${props.className}`}>
            <div id="appInfoBox">
                <h2>App Info</h2>
                <p>{appInfo[0]}</p>
                <p><strong>Warning:</strong> {appInfo[1]}</p>
                <p>Find me on <a className='linkType' href='https://twitter.com/manu_221b'>Twitter</a></p>
                <input type="button" onClick={props.onClose} value="Close" />
            </div>
        </div>
    );
}
