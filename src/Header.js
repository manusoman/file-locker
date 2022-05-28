import { memo } from 'react';
import Login from './Login';
import './styles/Header.css';

function Header() {
    return (
        <header>
            <h2>File Locker</h2>
            <Login />
        </header>
    );
}

export default memo(Header);
