import React from "react";

import Octicon, {GitPullRequest, IssueOpened, Repo, RepoForked, Lock} from '@githubprimer/octicons-react'

import "./Repositories.css";

export const Repositories = ({ repositories = [] }) => (
  <ul class="repository-list">
    {repositories.map(
      ({ name, id, descriptionHTML, url, pullRequests, issues, isFork, isPrivate }) => (
        <li key={id} className="repository-item">
            <div className="box">
                <div className="content">
                    <h4>
                    <Octicon icon={isFork ? RepoForked : (isPrivate ? Lock : Repo)} />
                    <a href={url}>{name}</a>
                    </h4>
                    <p dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
                    <div className="stats">
                        <span className="stat"><Octicon icon={IssueOpened} />{issues.totalCount}</span>
                        <span className="stat"><Octicon icon={GitPullRequest} />{pullRequests.totalCount}</span>
                    </div>
                </div>
            </div>
        </li>
      )
    )}
  </ul>
);

export const RepositoriesPlaceholder = () => (
    <ul class="repository-list">
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