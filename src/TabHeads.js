import { useState } from 'react';

export default function TabHeads(props) {
    const classSelected = 'tabHead selected';
    const classOther = 'tabHead';

    const getSelectionPattern = index => {
        const a = Array(props.labels.length).fill(classOther);
        a[index] = classSelected;
        return a;
    };
    
    const [tabClasses, set_tabClasses] = useState(getSelectionPattern(0));

    const selectTab = index => {
        set_tabClasses(getSelectionPattern(index));
        props.onChange(index);
    };

    const headList = props.labels.map((label, i) => {
        return <a key={i} className={tabClasses[!i ? 0 : 1]} onClick={() => selectTab(i)}>{label}</a>;
    });

    return <>{headList}</>;
}
