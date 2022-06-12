import './styles/AppInfo.css';

const appInfo = `The author of this app is not a profesional in cryptography, and cryptography is a field that demands great expertize to get things right. The app is also not standards complient, i.e., you cannot use it alongside other cryptographic apps. Hence, this app should not be used for any profesional/legal/serious applications.`;

export default function AppInfo(props) {
    return (
        <div className={`overlay ${props.className}`}>
            <div id="appInfoBox">
                <h2>App Info</h2>
                <p><strong>Warning:</strong> {appInfo}</p>
                <input type="button" onClick={props.onClose} value="Close" />
            </div>
        </div>
    );
}
