import React from 'react';

import Octicon, {Repo, RepoForked, GitPullRequest, IssueOpened, Lock, Versions} from '@githubprimer/octicons-react';

import './Repositories.css';

export const Repositories = ({repositories = []}) => (
    <>
        <ul className="repository-list">
            {repositories.map(
                ({name, id, descriptionHTML, url, pullRequests, issues, isFork, isPrivate, isMono}) => {
                    return (
                        <li key={id} className="repository-item">
                            <div className="box">
                                <div className="content">
                                    <h4>
                                        <Octicon icon={isFork ? RepoForked : (isPrivate ? Lock : Repo)} />
                                        <a href={url}>{name}</a>
                                        {isMono ? <Octicon icon={Versions} size="medium" verticalAlign="middle" className="indicator" /> : null}
                                    </h4>
                                    <p className="description" dangerouslySetInnerHTML={{__html: descriptionHTML}} />
                                    <div className="stats">
                                        <span className="stat"><Octicon icon={IssueOpened} />{issues.totalCount}</span>
                                        <span className="stat"><Octicon icon={GitPullRequest} />{pullRequests.totalCount}</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                    );
                }
            )}
        </ul>
    </>
);

export const RepositoriesPlaceholder = () => (
    <ul className="repository-list">
        {Array(20)
            .fill('')
            .map((line, index) => (
                <li key={index} className="repository-item">
                    <div className="box">
                        <div className="content">
                            <div className="name-placeholder" />
                            <div className="text-placeholder" />
                            <div className="text-placeholder" />
                        </div>
                    </div>
                </li>
            ))}
    </ul>
);
