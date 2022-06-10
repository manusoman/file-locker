import './styles/FileInput.css';

export default function FileInput(props) {
    const multiple = props.multiple ? { multiple : true } : {};
    
    return (
        <div className='fileInput'>
            <label>
                {props.label}
                <input className='off' type="file" onChange={props.onChange} {...multiple} />
            </label>
        </div>
    );
}
