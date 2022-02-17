import React, {useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useQuery, gql} from '@apollo/client';
import Wrapper from '../components/Wrapper';
import buildQuery from '../utils/buildQuery';

import {containsKnownOwner, matchOwner} from '../utils/ownership';
import {
    LoadMoreButton
} from 'gitstar-components';
import PullRequests from '../components/PullRequests';
import Placeholder from '../components/Placeholder';

export const PR_TILE_DATA = gql`
fragment PullRequestTile on PullRequest {
   title
   number
   url
   repository {
        name
   }
   labels (first:10) {
     nodes {
       name
       color
     }
   }
    author {
     login
   }
   assignees (first:5) {
     nodes {
       login
     }
   }
   status @client
   commits(last: 1) {
     nodes {
        commit {
            statusCheckRollup {
                   state


               }
             }
     }
   }
   updatedAt
 }
 `;

const GET_PRS = gql`
 query GetPullRequest($after: String, $query: String!) {
     search(
       type: ISSUE
       query: $query
       first: 20
       after: $after
     ) {
       issueCount
       pageInfo {
         endCursor
         hasNextPage
       }
       nodes {
         ...PullRequestTile
       }
     }
   }
   ${PR_TILE_DATA}
   `;

const filterPRs = (prs, params) => {
    const owner = params.getAll('owner');

    if (owner && containsKnownOwner(owner)) {
        return prs.filter((pr) => {
            return matchOwner(owner, pr.repository.name);
        });
    }

    return prs;
};

const PRsWrapper = () => {
    const [params] = useSearchParams();
    const query = buildQuery(params, 'pr', 'author:app/renovate');

    const {loading, error, data, fetchMore} = useQuery(GET_PRS, {
        variables: {
            after: null,
            query
        }
    });

    const [isLoadingMore, setIsLoadingMore] = useState(false);

    const loadMore = async () => {
        setIsLoadingMore(true);
        await fetchMore({
            variables: {after: data.search.pageInfo.endCursor, query}
        });
        setIsLoadingMore(false);
    };

    if (error) {
        return (
            <div style={{padding: 20}}>
                <p>Failed to load PRs</p>
                <p>{error.message}</p>
                <a href="/">Refresh Page</a>
            </div>
        );
    }

    // Show placeholders on first render
    if (loading && (!data || !data.search)) {
        return (
            <Wrapper className="issues">
                <div>Loading...</div>
                <Placeholder />
            </Wrapper>
        );
    }

    const prs = filterPRs(data.search.nodes, params);

    if (loading || isLoadingMore) {
        // Show both repositories and placeholder when user clicks show more
        return (
            <Wrapper className="issues">
                <div>PRs: {prs.length}</div>
                <PullRequests
                    issues={prs}
                />
                <Placeholder />
            </Wrapper>
        );
    }

    return (
        <Wrapper className="issues">
            <div>PRs: {prs.length}</div>
            <PullRequests
                issues={prs}
            />
            <LoadMoreButton loadMore={loadMore} />

        </Wrapper>
    );
};

export default PRsWrapper;
