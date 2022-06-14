import { useContext } from 'react';
import { UserMsgContext } from './App';
import './styles/Instructions.css';

export default function Instructions(props) {
    const { showAppInfo } = useContext(UserMsgContext);

    const clickHandler = e => {
        e.preventDefault();
        showAppInfo();
    };

    return (
        <div className="instructions">
        <h3>Instructions</h3>
        <p>{props.children}</p>
        <p>Also, please check out the <a className='linkType' onClick={clickHandler}>app info</a>.</p>
        </div>
    );
}
