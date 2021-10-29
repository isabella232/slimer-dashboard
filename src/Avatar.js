import React from 'react';
import {Avatar} from 'gitstar-components';
import {useQuery, gql} from '@apollo/client';

const GET_AVATAR = gql`
  query {
    viewer {
      avatarUrl
    }
  }
`;

function UserAvatar() {
    const {loading, error, data} = useQuery(GET_AVATAR);

    if (!localStorage.getItem('github_token')) {
        return <Avatar {...data} />;
    }

    if (loading) {
        return <Avatar {...data} />;
    }

    if (error) {
        return <div>Error :(</div>;
    }

    return <Avatar url={data.viewer.avatarUrl} {...data} />;
}

export default UserAvatar;
