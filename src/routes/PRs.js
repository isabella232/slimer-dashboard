import React, {useState} from 'react';
import {useQuery, gql} from '@apollo/client';
import Wrapper from '../components/Wrapper';

import {
    LoadMoreButton
} from 'gitstar-components';
import {PullRequests, PullRequestsPlaceholder} from '../components/PullRequests';

export const PR_TILE_DATA = gql`
fragment PullRequestTile on PullRequest {
   id
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
   updatedAt
 }
 `;

const GET_PRS = gql`
 query GetPullRequest($after: String) {
     search(
       type: ISSUE
       query: "org:TryGhost is:pr state:open sort:updated"
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

const filterPRs = (issues) => {
    return issues;
};

const PRsWrapper = () => {
    const {loading, error, data, fetchMore} = useQuery(GET_PRS, {
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
                <PullRequestsPlaceholder />
            </Wrapper>
        );
    }

    if (loading || isLoadingMore) {
        // Show both repositories and placeholder when user clicks show more
        return (
            <Wrapper className="issues">
                <PullRequests
                    issues={filterPRs(data.search.nodes)}
                />
                <PullRequestsPlaceholder />
            </Wrapper>
        );
    }

    return (
        <Wrapper className="issues">
            <PullRequests
                issues={filterPRs(data.search.nodes)}
            />
            <LoadMoreButton loadMore={loadMore} />

        </Wrapper>
    );
};

export default PRsWrapper;
