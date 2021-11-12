import React, {useState} from 'react';
import {useQuery, gql} from '@apollo/client';
import Wrapper from '../components/Wrapper';

import {
    LoadMoreButton
} from 'gitstar-components';
import {Issues, IssuesPlaceholder} from '../components/Issues';

export const ISSUE_TILE_DATA = gql`
fragment IssueTile on Issue {
   id
   title
   number
   url
   repository {
        nameWithOwner
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
 query GetIssues($after: String) {
     search(
       type: ISSUE
       query: "org:TryGhost is:issue state:open sort:updated"
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

const IssuesWrapper = () => {
    const {loading, error, data, fetchMore} = useQuery(GET_ISSUES, {
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
                <p>Failed to load issues</p>
                <a href="/">Refresh Page</a>
            </div>
        );
    }

    // Show placeholders on first render
    if (loading && (!data || !data.search)) {
        return (
            <Wrapper>
                <IssuesPlaceholder />
            </Wrapper>
        );
    }

    if (loading || isLoadingMore) {
        // Show both repositories and placeholder when user clicks show more
        return (
            <Wrapper>
                <Issues
                    issues={filterIssues(data.search.nodes)}
                />
                <IssuesPlaceholder />
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <Issues
                issues={filterIssues(data.search.nodes)}
            />
            <LoadMoreButton loadMore={loadMore} />

        </Wrapper>
    );
};

export default IssuesWrapper;
