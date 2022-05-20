import './styles/Message.css';

function Message(props) {
    const cn = `${props.className} ${props.mode}`;
    // props.mode can be either "error" or absent

    return (
        <div id="messageBox" className={cn}>
            <p>{props.text}</p>
        </div>
    );
}

export default Message;
