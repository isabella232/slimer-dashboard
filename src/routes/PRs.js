import React, {useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useQuery, gql} from '@apollo/client';
import Wrapper from '../components/Wrapper';

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
   updatedAt
 }
 `;

const GET_PRS = gql`
 query GetPullRequest($after: String) {
     search(
       type: ISSUE
       query: "org:TryGhost is:pr state:open sort:updated -author:app/renovate"
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
    let filteredPRs = prs;

    const repoFilter = params.getAll('repo');
    const authorFilter = params.getAll('author');
    const labelFilter = params.getAll('label');

    if (repoFilter.length > 0) {
        filteredPRs = prs.filter((issue) => {
            return repoFilter.some((filter) => {
                return filter.toLowerCase() === issue.repository.name.toLowerCase();
            });
        });
    }

    if (authorFilter.length > 0) {
        filteredPRs = prs.filter((issue) => {
            return authorFilter.some((filter) => {
                return filter.toLowerCase() === issue.author.login.toLowerCase();
            });
        });
    }

    if (labelFilter.length > 0) {
        filteredPRs = prs.filter((issue) => {
            return issue.labels.nodes.some((node) => {
                return labelFilter.indexOf(node.name) > -1;
            });
        });
    }

    return filteredPRs;
};

const PRsWrapper = () => {
    const {loading, error, data, fetchMore} = useQuery(GET_PRS, {
        variables: {
            after: null
        }
    });

    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [params] = useSearchParams();

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
                <Placeholder />
            </Wrapper>
        );
    }

    if (loading || isLoadingMore) {
        // Show both repositories and placeholder when user clicks show more
        return (
            <Wrapper className="issues">
                <PullRequests
                    issues={filterPRs(data.search.nodes, params)}
                />
                <Placeholder />
            </Wrapper>
        );
    }

    return (
        <Wrapper className="issues">
            <PullRequests
                issues={filterPRs(data.search.nodes, params)}
            />
            <LoadMoreButton loadMore={loadMore} />

        </Wrapper>
    );
};

export default PRsWrapper;
