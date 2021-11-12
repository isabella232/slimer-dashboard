import React from 'react';

// import Octicon, {Repo, RepoForked, GitPullRequest, Tools, IssueOpened, Lock, Versions} from '@githubprimer/octicons-react';

import Label from './Label';
import './List.css';

export const Issues = ({issues = []}) => (
    <ul className="card-list">
        {issues.map(
            ({id, number, title, url, author, labels, assignees}) => {
                return (
                    <li key={id} className="card">
                        <h4 className="title">
                            {number}
                            <a href={url}>{title}</a>
                        </h4>
                        <div className="title">
                            {labels.nodes.map(({name, color}) => {
                                return <Label color={color}>{name}</Label>;
                            })}
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
