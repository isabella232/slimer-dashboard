import React, {useState} from 'react';

import {useQuery, gql} from '@apollo/client';

import {
    LoadMoreButton
} from 'gitstar-components';

import {Repositories, RepositoriesPlaceholder} from './components/Repositories';
import Wrapper from './components/Wrapper';

const DEFAULT_REPOS = 20;

export const REPOSITORY_TILE_DATA = gql`
  fragment RepositoryTile on Repository {
    id
    nameWithOwner
    name
    url
    descriptionHTML
    pullRequests(states: OPEN, first: 100) {
      totalCount
      nodes {
        id: databaseId,
        isRenovate @client
        author {
          login
        }
        url
      }
    }
    issues(states: OPEN) {
      totalCount
    }
    isFork
    isPrivate
  }
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

const getRepositories = (repositories) => {
    if (!repositories) {
        return repositories;
    }

    repositories = [...repositories].sort((a, b) => {
        return b.pullRequests.totalCount - a.pullRequests.totalCount;
    });

    return repositories;
};

const RepositoriesWrapper = () => {
    const {loading, error, data, fetchMore} = useQuery(GET_REPOSITORIES, {
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
            <Wrapper>
                <RepositoriesPlaceholder />
            </Wrapper>
        );
    }

    if (loading || isLoadingMore) {
        // Show both repositories and placeholder when user clicks show more
        return (
            <Wrapper>
                <Repositories
                    repositories={getRepositories(data.search.nodes)}
                />
                <RepositoriesPlaceholder />
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <Repositories
                repositories={getRepositories(data.search.nodes)}
            />
            <LoadMoreButton loadMore={loadMore} />

        </Wrapper>
    );
};

export default RepositoriesWrapper;
