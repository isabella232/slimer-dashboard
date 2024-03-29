import React from 'react';
import {NavLink} from 'react-router-dom';
import {IssueOpenedIcon} from '@primer/octicons-react';

import Label from './Label';
import './List.css';

function getUrl(name, type) {
    return `/${type}?label=${name}`;
}

export const Issues = ({issues = []}) => (
    <ul className="card-list">
        {issues.map(
            ({number, title, url, author, labels, assignees, repository}) => {
                return (
                    <li key={url} className="card">
                        <h4 className="title">
                            <a href={url} target="_blank" rel="noopener noreferrer"><IssueOpenedIcon size={16} />{repository.name}#{number}</a> {labels.nodes.map(({name, color}) => {
                                return <NavLink to={getUrl(name, 'issues')}><Label color={color}>{name}</Label></NavLink>;
                            })}
                        </h4>
                        <div className="desc">
                            {title}
                        </div>

                        <div className="left">Assignees: {assignees.nodes.map(({login}) => login)}</div>
                        <div className="right">Author: {author.login}</div>

                    </li>
                );
            }
        )}
    </ul>
);

export default Issues;
