import { memo } from 'react';
import Login from './Login';
import './styles/Header.css';

function Header() {
    return (
        <header>
            <img id="logo" src="file_locker_logo.svg" alt="File Locker Logo" />
            <Login />
        </header>
    );
}

export default memo(Header);
