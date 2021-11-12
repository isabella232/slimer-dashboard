import React from 'react';
import './Wrapper.css';

class Wrapper extends React.Component {
    render() {
        return <div className={this.props.className + ' wrapper'}>{this.props.children}</div>;
    }
}

export default Wrapper;
