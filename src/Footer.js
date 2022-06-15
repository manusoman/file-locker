import { memo, useEffect, useState } from "react";
import './styles/Footer.css';

function Footer() {
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetch('https://manusoman.github.io/MindLogs/settings.json')
        .then(res => res.json())
        .then(data => setYear(data.current_year))
        .catch(err => console.error(err.message));
    }, []);

    return (
        <footer>
            <span>© {year}, Manu Soman<span>•</span>Find this project on <a href="#" className="linkType">GitHub</a></span>
        </footer>
    );
}

export default memo(Footer);
