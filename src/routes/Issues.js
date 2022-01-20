import React, {useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useQuery, gql} from '@apollo/client';
import Wrapper from '../components/Wrapper';
import buildQuery from '../utils/buildQuery';

import {
    LoadMoreButton
} from 'gitstar-components';
import Issues from '../components/Issues';
import Placeholder from '../components/Placeholder';

export const ISSUE_TILE_DATA = gql`
fragment IssueTile on Issue {
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

const GET_ISSUES = gql`
 query GetIssues($after: String, $query: String!) {
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
         ...IssueTile
       }
     }
   }
   ${ISSUE_TILE_DATA}
   `;

const filterIssues = (issues) => {
    return issues;
};

const IssuesWrapper = (...args) => {
    const [params] = useSearchParams();
    const query = buildQuery(params, 'issue');

    const {loading, error, data, fetchMore} = useQuery(GET_ISSUES, {
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
                <p>Failed to load issues</p>
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

    if (loading || isLoadingMore) {
        // Show both repositories and placeholder when user clicks show more
        return (
            <Wrapper className="issues">
                <div>Issues: {data.search.issueCount}</div>
                <Issues
                    issues={filterIssues(data.search.nodes)}
                />
                <Placeholder />
            </Wrapper>
        );
    }

    return (
        <Wrapper className="issues">
            <div>Issues: {data.search.issueCount}</div>
            <Issues
                issues={filterIssues(data.search.nodes)}
            />
            <LoadMoreButton loadMore={loadMore} />

        </Wrapper>
    );
};

export default IssuesWrapper;
