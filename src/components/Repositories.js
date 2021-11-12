import React from 'react';

import Octicon, {Repo, RepoForked, GitPullRequest, Tools, IssueOpened, Lock, Versions} from '@githubprimer/octicons-react';

import './List.css';

export const Repositories = ({repositories = []}) => (
    <ul className="card-list">
        {repositories.map(
            ({name, id, descriptionHTML, url, hasIssuesEnabled, pullRequests, renovateRequests, issues, isFork, isPrivate, isMono}) => {
                return (
                    <li key={id} className="card">
                        <h4 className="title">
                            <Octicon icon={isFork ? RepoForked : (isPrivate ? Lock : Repo)} />
                            <a href={url}>{name}</a>
                            {isMono ? <Octicon icon={Versions} size="medium" verticalAlign="middle" className="indicator" /> : null}
                        </h4>
                        <div className="desc" dangerouslySetInnerHTML={{__html: descriptionHTML}} />
                        <div className="stats-box left">
                            {hasIssuesEnabled ? <span className="stat"><Octicon icon={IssueOpened} />{issues.totalCount}</span> : null}
                        </div>
                        <div className="stats-box right">
                            <span className="stat"><Octicon icon={GitPullRequest} />{pullRequests.totalCount}</span>
                            <span className="stat"><Octicon icon={Tools} />{renovateRequests.totalCount}</span>
                        </div>
                    </li>
                );
            }
        )}
    </ul>
);

export const RepositoriesPlaceholder = () => (
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
