import './Label.css';

const Label = ({children, color}) => {
    console.log('color', color);
    return <span style={{backgroundColor: `#${color}`}}>{children}</span>;
};

export default Label;
