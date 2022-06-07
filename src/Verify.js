import { useState } from 'react';

export default function Sign(props) {
    const [files, setFiles] = useState([]);
    const [isDisabled, setIsDisabled] = useState({disabled : true });

    const onFileSelect = () => {};
    const onAction = () => {};

    return (
        <div className={props.className}>
            <input type="file" onChange={onFileSelect} />
            <input type="button" {...isDisabled} value="Verify Signature" onClick={onAction} />
        </div>
    );
}

function isPrime(n) {
    if(n > Number.MAX_SAFE_INTEGER) return undefined;
    if(n < 4) return [true, null];
    if(n % 2 === 0) return [false, 2];

    let denom = 3;
    let max = n / denom;

    while(denom <= max) {
        if(n % denom === 0) return [false, denom];
        max = n / denom;
        denom += 2;
    }

    return [true, null];
}

// 3 5 7 9 11 13 15 17 19 21 23 25 27 29 ...
