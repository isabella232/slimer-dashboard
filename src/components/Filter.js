import React from 'react';

import './Filter.css';

class Filter extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.onFilterChange(e.target.value);
    }
    render() {
        const options = this.props.options;

        return (
            <>
                <label>{this.props.name}:</label>&nbsp;
                <select name={this.props.name.toLowerCase()} defaultValue={this.props.value} onChange={this.handleChange}>
                    {Object.keys(this.props.options).map(key => (
                        <option key={key} value={options[key]}>{options[key]}</option>
                    ))}
                </select>
            </>
        );
    }
}

export default Filter;
