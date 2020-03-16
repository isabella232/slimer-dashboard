import React from "react";
import { gql } from "apollo-boost";
import { graphql, compose } from "react-apollo";
import {
  LoadMoreButton
} from "gitstar-components";

import { Repositories, RepositoriesPlaceholder } from "./components/Repositories";
import Wrapper from "./components/Wrapper";

const DEFAULT_REPOS = 100;

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
        headRefName
      }
    }
    issues(states: OPEN) {
      totalCount
    }
    stargazers {
      totalCount
    }
    isFork
    isPrivate
  }
`;

const GET_REPOSITORIES = gql`
  query($after: String) {
    search(
      type: REPOSITORY
      query: "org:TryGhost archived:false fork:true"
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

class RepositoriesWrapper extends React.Component {

  getRepositories() {
    this.props.repositories.sort((a, b) => {
      return b.pullRequests.totalCount - a.pullRequests.totalCount;
    });

    return this.props.repositories.filter(repo => {
      let access = false;
      let origin = false;

      if (this.props.access === 'all') {
        access = true;
      } else if (this.props.access === 'private' && repo.isPrivate) {
        access = true;
      } else if (this.props.access === 'public' && !repo.isPrivate) {
        access = true;
      }

      if (this.props.origin === 'all') {
        origin = true;
      } else if (this.props.origin === 'fork' && repo.isFork) {
        origin = true;
      } else if (this.props.origin === 'source' && !repo.isFork) {
        origin = true;
      }

      return access && origin;
    });
  }
  render() {
    if (this.props.error) {
      return (
        <div style={{ padding: 20 }}>
          <p>Failed to load repositories</p>
          <a href="/">Refresh Page</a>
        </div>
      );
    }
    // Show placeholders on first render
    if (this.props.loading && !this.props.repositories) {
      return (
        <Wrapper>
        <RepositoriesPlaceholder />
        </Wrapper>
      );
    }
    // Show both repositories and placeholder when user clicks show more
    if (this.props.loading) {
      return (
        <Wrapper>
          <Repositories
            repositories={this.getRepositories()}
      />
          <RepositoriesPlaceholder />
          <LoadMoreButton loadMore={this.props.loadMore} />
        </Wrapper>
      );
    }
    return (
        <Wrapper>
            {this.props.count}
        <Repositories
            repositories={this.getRepositories()}
        />
        <LoadMoreButton loadMore={this.props.loadMore} />
      </Wrapper>
    );
  }
}

export default compose(
  graphql(GET_REPOSITORIES, {
    props: ({ data: { error, loading, search, fetchMore } }) => {
      return {
        count: search ? search.repositoryCount : 0,
        repositories: search ? search.nodes : null,
        loading,
        error,
        loadMore: () =>
          fetchMore({
            variables: { after: search.pageInfo.endCursor },
            updateQuery: (previousResult = {}, { fetchMoreResult = {} }) => {
              if (fetchMoreResult.search.nodes.length === 0) {
                return previousResult;
              }

              const previousSearch = previousResult.search || {};
              const currentSearch = fetchMoreResult.search || {};
              const previousNodes = previousSearch.nodes || [];
              const currentNodes = currentSearch.nodes || [];
              // Specify how to merge new results with previous results


              return {
                ...previousResult,
                search: {
                  ...previousSearch,
                  nodes: [...previousNodes, ...currentNodes],
                  pageInfo: currentSearch.pageInfo
                }
              };
            }
          })
      };
    },
    options: {
      notifyOnNetworkStatusChange: true // Update loading prop after loadMore is called
    }
  })
)(RepositoriesWrapper);
