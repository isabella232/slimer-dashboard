import React from 'react';
import {NavLink} from 'react-router-dom';
import {GitPullRequestIcon} from '@primer/octicons-react';

import Label from './Label';
import './List.css';

function getUrl(name, type) {
    return `/${type}?label=${name}`;
}

export const PullRequests = ({issues = []}) => (
    <ul className="card-list">
        {issues.map(
            ({id, number, title, url, author, labels, assignees, repository}) => {
                return (
                    <li key={id} className="card">
                        <h4 className="title">
                            <a href={url}><GitPullRequestIcon size={16} />{repository.name}#{number}</a> {labels.nodes.map(({name, color}) => {
                                return <NavLink to={getUrl(name, 'prs')}><Label color={color}>{name}</Label></NavLink>;
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

export default PullRequests;
