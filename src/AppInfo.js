import './styles/AppInfo.css';
const appInfo1 = `This app was developed to practice the fundamentals of digital crptography.`;
const appInfo2 = `The author of this app is by no means an expert in cryptography, and cryptography is a field that demands great expertize to get things right. The app is also not standards complient, i.e., you cannot use it alongside other cryptographic apps.`;

export default function AppInfo(props) {
    return (
        <div className={`overlay ${props.className}`}>
            <div id="appInfoBox">
                <h2>App Info</h2>
                <p>{appInfo1}</p>
                <p><strong>Warning:</strong> {appInfo2}</p>
                <input type="button" onClick={props.onClose} value="Close" />
            </div>
        </div>
    );
}
