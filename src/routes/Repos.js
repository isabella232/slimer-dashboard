import React, {useState} from 'react';
import {useSearchParams} from 'react-router-dom';

import {useQuery, gql} from '@apollo/client';

import {containsKnownOwner, matchOwner} from '../utils/ownership';
import {containsKnownType, matchType} from '../utils/type';

import {
    LoadMoreButton
} from 'gitstar-components';

import Repositories from '../components/Repositories';
import Placeholder from '../components/Placeholder';

import Wrapper from '../components/Wrapper';

const DEFAULT_REPOS = 20;

export const PULL_REQUEST_LIST = gql`
    fragment PullRequestList on PullRequestConnection {
        totalCount
        nodes {
            number
            isRenovate @client
            headRefName
            author {
                login
            }
            url
            repository {
                name
           }
        }
    }
`;

export const REPOSITORY_TILE_DATA = gql`
  fragment RepositoryTile on Repository {
    name
    url
    descriptionHTML
    hasIssuesEnabled
    renovateRequests @client {
        ...PullRequestList
    }
    nonRenovateRequests @client {
        ...PullRequestList
    }
    pullRequests(states: OPEN, first: 100) {
       ...PullRequestList
    }
    issues(states: OPEN) {
      totalCount
    }
    isFork
    isPrivate
  }
  ${PULL_REQUEST_LIST}
`;

const GET_REPOSITORIES = gql`
  query GetRepositories($after: String) {
    search(
      type: REPOSITORY
      query: "org:TryGhost archived:false fork:false"
      first: ${DEFAULT_REPOS}
      after: $after
    ) {
      repositoryCount
      pageInfo {
        endCursor
        hasNextPage
      }
      nodes {
        ...RepositoryTile
      }
    }
  }
  ${REPOSITORY_TILE_DATA}
`;

const getRepositories = (repositories, params) => {
    if (!repositories) {
        return repositories;
    }

    const owner = params.getAll('owner');
    const type = params.getAll('type');

    if (owner && containsKnownOwner(owner)) {
        return repositories.filter((repo) => {
            return matchOwner(owner, repo.name);
        });
    }

    if (type && containsKnownType(type)) {
        return repositories.filter((repo) => {
            return matchType(type, repo.name);
        });
    }

    return repositories;
};

const getTotals = (repositories) => {
    return repositories.reduce((a, b, c) => {
        if (c === 1) {
            return {repos: repositories.length, issues: b.issues.totalCount, prs: b.nonRenovateRequests.totalCount, renovate: b.renovateRequests.totalCount};
        }

        return {repos: repositories.length, issues: a.issues + b.issues.totalCount, prs: a.prs + b.nonRenovateRequests.totalCount, renovate: a.renovate + b.renovateRequests.totalCount};
    });
};

const RepositoriesWrapper = () => {
    const [params] = useSearchParams();

    const {loading, error, data, fetchMore} = useQuery(GET_REPOSITORIES, {
        fetchPolicy: 'cache-and-network', // Used for first execution
        nextFetchPolicy: 'cache-first', // Used for subsequent executions
        variables: {
            after: null
        }
    });

    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadMore = async () => {
        setIsLoadingMore(true);
        await fetchMore({
            variables: {after: data.search.pageInfo.endCursor}
        });
        setIsLoadingMore(false);
    };

    if (error) {
        return (
            <div style={{padding: 20}}>
                <p>Failed to load repositories</p>
                <a href="/">Refresh Page</a>
            </div>
        );
    }

    // Show placeholders on first render
    if (loading && (!data || !data.search)) {
        return (
            <Wrapper className="repositories">
                <div>Loadding...</div>
                <Placeholder />
            </Wrapper>
        );
    }

    const totals = getTotals(getRepositories(data.search.nodes, params));

    if (loading || isLoadingMore) {
        // Show both repositories and placeholder when user clicks show more

        return (
            <Wrapper className="repositories">
                <div>Repos: {totals.repos}, Issues: {totals.issues}, PRs: {totals.prs}, Renovate PRs: {totals.renovate}</div>
                <Repositories
                    repositories={getRepositories(data.search.nodes, params)}
                />
                <Placeholder />
            </Wrapper>
        );
    }

    return (
        <Wrapper className="repositories">
            <div>Repos: {totals.repos}, Issues: {totals.issues}, PRs: {totals.prs}, Renovate PRs: {totals.renovate}</div>
            <Repositories
                repositories={getRepositories(data.search.nodes, params)}
            />
            <LoadMoreButton loadMore={loadMore} />

        </Wrapper>
    );
};

export default RepositoriesWrapper;
