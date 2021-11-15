import React from 'react';
import {NavLink} from 'react-router-dom';

import {RepoIcon, RepoForkedIcon, LockIcon, IssueOpenedIcon, GitPullRequestIcon, ToolsIcon, VersionsIcon} from '@primer/octicons-react';

import './List.css';

function getUrl(name, type) {
    return `/${type}?repo=${name}`;
}

export const Repositories = ({repositories = []}) => (
    <ul className="card-list">
        {repositories.map(
            ({name, descriptionHTML, url, hasIssuesEnabled, pullRequests, renovateRequests, issues, isFork, isPrivate, isMono}) => {
                return (
                    <li key={url} className="card">
                        <h4 className="title">
                            {isFork ? <RepoForkedIcon size={16} /> : (isPrivate ? <LockIcon size={16} /> : <RepoIcon size={16} />)}
                            <a href={url}>{name}</a>
                            {isMono ? <VersionsIcon size={16} className="indicator" /> : null}
                        </h4>
                        <div className="desc" dangerouslySetInnerHTML={{__html: descriptionHTML}} />
                        <div className="stats-box left">
                            {hasIssuesEnabled ? <NavLink to={getUrl(name, 'issues')}><span className="stat"><IssueOpenedIcon />{issues.totalCount}</span></NavLink> : null}
                        </div>
                        <div className="stats-box right">
                            <NavLink to={getUrl(name, 'prs')}><span className="stat"><GitPullRequestIcon />{pullRequests.totalCount}</span></NavLink>
                            <NavLink to={getUrl(name, 'renovate')}><span className="stat"><ToolsIcon />{renovateRequests.totalCount}</span></NavLink>
                        </div>
                    </li>
                );
            }
        )}
    </ul>
);

export default Repositories;
