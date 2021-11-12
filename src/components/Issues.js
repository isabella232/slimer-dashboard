import React from 'react';
import {IssueOpenedIcon} from '@primer/octicons-react';

import Label from './Label';
import './List.css';

export const Issues = ({issues = []}) => (
    <ul className="card-list">
        {issues.map(
            ({id, number, title, url, author, labels, assignees, repository}) => {
                return (
                    <li key={id} className="card">
                        <h4 className="title">
                            <a href={url}><IssueOpenedIcon size={16} />{repository.nameWithOwner}#{number}</a> {labels.nodes.map(({name, color}) => {
                                return <Label color={color}>{name}</Label>;
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

export const IssuesPlaceholder = () => (
    <ul className="card-list placeholder">
        {Array(20)
            .fill('')
            .map((line, index) => (
                <li key={index} className="card">
                    <div className="title name-placeholder" />
                    <div className="desc text-placeholder" />
                    <div className="left text-placeholder" />
                    <div className="right text-placeholder" />
                </li>
            ))}
    </ul>
);
