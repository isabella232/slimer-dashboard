import React from 'react';

import {RepoIcon, RepoForkedIcon, LockIcon, IssueOpenedIcon, GitPullRequestIcon, ToolsIcon, VersionsIcon} from '@primer/octicons-react';

import './List.css';

export const Repositories = ({repositories = []}) => (
    <ul className="card-list">
        {repositories.map(
            ({name, id, descriptionHTML, url, hasIssuesEnabled, pullRequests, renovateRequests, issues, isFork, isPrivate, isMono}) => {
                return (
                    <li key={id} className="card">
                        <h4 className="title">
                            {isFork ? <RepoForkedIcon size={16} /> : (isPrivate ? <LockIcon size={16} /> : <RepoIcon size={16} />)}
                            <a href={url}>{name}</a>
                            {isMono ? <VersionsIcon size={16} className="indicator" /> : null}
                        </h4>
                        <div className="desc" dangerouslySetInnerHTML={{__html: descriptionHTML}} />
                        <div className="stats-box left">
                            {hasIssuesEnabled ? <span className="stat"><IssueOpenedIcon />{issues.totalCount}</span> : null}
                        </div>
                        <div className="stats-box right">
                            <span className="stat"><GitPullRequestIcon />{pullRequests.totalCount}</span>
                            <span className="stat"><ToolsIcon />{renovateRequests.totalCount}</span>
                        </div>
                    </li>
                );
            }
        )}
    </ul>
);

export default Repositories;
