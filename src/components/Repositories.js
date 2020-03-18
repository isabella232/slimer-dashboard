import React from "react";

import Octicon, {GitPullRequest, IssueOpened, Repo, RepoForked, Lock, Tools, Play} from '@githubprimer/octicons-react'

import "./Repositories.css";

export const Counts = ({ repositories = [] }) => {
    let travis = repositories.filter(repo => repo.cd.travis).length;
    let missingGitHub = repositories.filter(repo => !repo.cd.github).length;
    let missingRenovate = repositories.filter(repo => repo.renovate.notConfigured).length;
    return (<p>Total Repos: {repositories.length}, Missing Renovate: {missingRenovate}, Missing GitHub Actions: {missingGitHub}, Has Travis: {travis}.</p>);
}

export const Repositories = ({ repositories = [] }) => (
  <>
  <Counts repositories={repositories} />
  <ul className="repository-list">
    {repositories.map(
        ({ name, id, descriptionHTML, url, pullRequests, renovate, issues, isFork, isPrivate, cd, node }) => {
            return (
                <li key={id} className="repository-item">
                    <div className="box">
                        <div className="content">
                            <h4>
                                <Octicon icon={isFork ? RepoForked : (isPrivate ? Lock : Repo)} />
                                <a href={url}>{name}</a>
                            </h4>
                            <p className="description" dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
                            <p>Node: {node}</p>
                            <div className="stats">
                                <span className="stat"><Octicon icon={IssueOpened} />{issues.totalCount}</span>
                                <span className="stat"><Octicon icon={GitPullRequest} />{pullRequests.totalCount}</span>
                                <span className={renovate.notConfigured ? 'stat ok' : 'stat not-ok'}><Octicon icon={Tools} />{renovate.totalCount}</span>
                                <span className={cd.travis ? 'stat not-ok' : 'stat ok'}>{cd.travis || cd.github ? <Octicon icon={Play} /> : null}</span>
                            </div>
                        </div>
                    </div>
                </li>
            )
        }
    )}
    </ul>
    </>
);

export const RepositoriesPlaceholder = () => (
    <ul className="repository-list">
      {Array(20)
        .fill("")
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
