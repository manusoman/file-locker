import { useEffect, useState, memo } from "react";
import './styles/Footer.css';

function Footer() {
    const [copyRight, setCopyRight] = useState('');

    useEffect(() => {
        let year;

        fetch('https://manusoman.github.io/MindLogs/settings.json')
        .then(res => res.json())
        .then(data => year = data.current_year)
        .catch(err => {
            year = new Date().getFullYear();
            console.error(err);
        }).finally(() => setCopyRight(`© ${ year }, Manu Soman`));
    }, []);

    return <footer><span>{copyRight}</span></footer>;
}

export default memo(Footer);
