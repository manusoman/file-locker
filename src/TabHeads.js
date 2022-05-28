import { useReducer } from 'react';

const classSelected = 'tabHead selected';
const classOther = 'tabHead';

const getSelectionPattern = (count, index) => {
    const a = Array(count).fill(classOther);
    a[index] = classSelected;
    return a;
};

export default function TabHeads(props) {  
    const tabCount = props.labels.length;

    // "useReducer" isn't required here.
    // It was used as an experiment.
    const [tabClasses, change_tabClasses] = useReducer(
        (state, action) => getSelectionPattern(state.length, action),
        getSelectionPattern(tabCount, 0)
    );

    const selectTab = index => {
        change_tabClasses(index);
        props.onChange(index);
    };

    const headList = props.labels.map(
        (label, i) => <a key={i} className={tabClasses[i]} onClick={() => selectTab(i)}>{label}</a>
    );

    return <>{headList}</>;
}
