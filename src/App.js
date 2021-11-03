import React, {useEffect, useState} from 'react';
import {
    Container,
    Header
} from 'gitstar-components';

import Octicon, {Bookmark} from '@githubprimer/octicons-react';

import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';

import Avatar from './Avatar';
import Repositories from './Repositories';

import Login from './components/Login';

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                search: {
                    keyArgs: [],
                    merge(existing = {}, incoming) {
                        const existingNodes = existing.nodes || [];
                        const incomingNodes = incoming.nodes || [];

                        return {
                            ...existing,
                            ...incoming,
                            nodes: [...existingNodes, ...incomingNodes],
                            pageInfo: incoming.pageInfo
                        };
                    }
                }
            }
        },
        Repository: {
            keyFields: ['nameWithOwner']
        }
    }
});

const App = () => {
    const [client, setClient] = useState();
    const [token, setToken] = useState();

    const storedToken = localStorage.getItem('github_token');
    if (!token && storedToken) {
        setToken(storedToken);
    }

    useEffect(() => {
        async function init() {
            console.log('got token', token);

            setClient(new ApolloClient({
                cache,
                uri: 'https://api.github.com/graphql',
                headers: {
                    authorization: `Bearer ${token}`
                }
            }));
        }

        init().catch(console.error);
    }, [token]);

    const onLoginSuccess = (_token) => {
        setToken(_token);
    };

    if (!token || !client) {
        return <Login onSuccess={onLoginSuccess} />;
    }

    return (
        <ApolloProvider client={client}>
            <Container>
                <Header>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Octicon icon={Bookmark} size='medium' />
                        <span className="logotype">Slimer Dashboard</span>
                    </div>
                    <div>
                        <Avatar />
                    </div>
                </Header>

                <Repositories />
            </Container>
        </ApolloProvider>
    );
};

export default App;
