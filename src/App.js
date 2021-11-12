import React, {useEffect, useState} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    NavLink
} from 'react-router-dom';

import {
    Container,
    Header
} from 'gitstar-components';

import Octicon, {Bookmark} from '@githubprimer/octicons-react';

import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';

import Avatar from './components/Avatar';
import Login from './components/Login';

import Repos from './routes/Repos';
import Issues from './routes/Issues';

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                search: {
                    keyArgs: ['type'],
                    merge(existing = {}, incoming) {
                        const existingNodes = existing.nodes || [];
                        const incomingNodes = incoming.nodes || [];

                        return {
                            ...existing,
                            ...incoming,
                            nodes: [...existingNodes, ...incomingNodes],
                            pageInfo: incoming.pageInfo
                        };
                    },
                    read(existing, {readField}) {
                        if (!existing || !existing.nodes) {
                            return existing;
                        }

                        if (existing.nodes.length > 0 && existing.repositoryCount) {
                            const sortedNodes = [...existing.nodes].sort((a, b) => {
                                const prsA = readField({from: a, fieldName: 'pullRequests', args: {first: 100, states: 'OPEN'}});
                                const prsB = readField({from: b, fieldName: 'pullRequests', args: {first: 100, states: 'OPEN'}});

                                return prsB.totalCount - prsA.totalCount;
                            });

                            return {
                                ...existing,
                                nodes: sortedNodes
                            };
                        }

                        return existing;
                    }
                }
            }
        },
        Repository: {
            keyFields: ['nameWithOwner'],
            fields: {
                renovateRequests: {
                    read(_, {readField}) {
                        const prs = readField({fieldName: 'pullRequests', args: {first: 100, states: 'OPEN'}});

                        const nodes = prs.nodes.filter(node => readField('isRenovate', node));
                        const totalCount = nodes.length;

                        return {
                            ...prs,
                            totalCount,
                            nodes
                        };
                    }
                }
            }
        },
        Issue: {
            keyFields: ['repository', ['nameWithOwner'], 'number']
        },
        PullRequest: {
            keyFields: ['repository', ['nameWithOwner'], 'number'],
            fields: {
                isRenovate: {
                    read(_, {readField}) {
                        return readField('author').login === 'renovate' ? true : false;
                    }
                }
            }
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
            <Router>
                <Container>
                    <Header>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Octicon icon={Bookmark} size='medium' />
                            <span className="logotype">Slimer Dashboard</span>
                        </div>
                        <div>
                            <nav>
                                <NavLink className={({isActive}) => (isActive ? 'active' : null)} to="/">Repos</NavLink>{' | '}
                                <NavLink className={({isActive}) => (isActive ? 'active' : null)} to="/issues">Issues</NavLink>
                            </nav>
                        </div>
                        <div>
                            <Avatar />
                        </div>
                    </Header>

                    <Routes>
                        <Route path="/" element={<Repos />} />
                        <Route path="/issues" element={<Issues />} />
                    </Routes>
                </Container>
            </Router>
        </ApolloProvider>
    );
};

export default App;
