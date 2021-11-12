import {colord} from 'colord';

import './Label.css';

/*
 The calculation GitHub does is this:

--label-r: 225;
--label-g: 86;
--label-b: 63;
--label-h: 8;
--label-s: 72;
--label-l: 56;

--lightness-threshold: 0.453;
--border-threshold: 0.96;
--border-alpha: max(0, min(calc((var(--perceived-lightness) - var(--border-threshold)) * 100), 1));
--perceived-lightness: calc( ((var(--label-r) * 0.2126) + (var(--label-g) * 0.7152) + (var(--label-b) * 0.0722)) / 255 );
--lightness-switch: max(0, min(calc((var(--perceived-lightness) - var(--lightness-threshold)) * -1000), 1));

background: rgb(var(--label-r), var(--label-g), var(--label-b));
color: hsl(0, 0%, calc(var(--lightness-switch) * 100%));
border-color: hsla(var(--label-h), calc(var(--label-s) * 1%), calc((var(--label-l) - 25) * 1%), var(--border-alpha));

 */

const Label = ({children, color}) => {
    // let lightnessThreshold = 0.453;
    const borderThreshold = 0.96;

    const hexColor = `#${color}`;
    const textColor = colord(hexColor).isLight() ? '#000' : '#fff';

    let borderColor = hexColor;

    if (colord(hexColor).brightness() > borderThreshold) {
        borderColor = colord(hexColor).darken(0.5).toHex();
    }

    return <span className="label" style={{backgroundColor: hexColor, color: textColor, borderColor: borderColor}}>{children}</span>;
};

export default Label;
