import React, {useCallback, useEffect, useState} from 'react';
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

import {BookmarkIcon, SyncIcon} from '@primer/octicons-react';

import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';
import {persistCache, LocalStorageWrapper} from 'apollo3-cache-persist';

import Avatar from './components/Avatar';
import Login from './components/Login';

import Repos from './routes/Repos';
import Issues from './routes/Issues';
import PRs from './routes/PRs';
import Renovate from './routes/Renovate';

const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                search: {
                    keyArgs: ['query'],
                    merge(existing = {}, incoming, {readField, mergeObjects}) {
                        const existingNodes = existing.nodes || [];
                        const incomingNodes = incoming.nodes || [];

                        const mergedNodes = [...existingNodes];
                        const repoUrlToIndex = {};

                        existingNodes.forEach((repo, index) => {
                            repoUrlToIndex[readField('url', repo)] = index;
                        });

                        incomingNodes.forEach((repo) => {
                            const url = readField('url', repo);
                            const index = repoUrlToIndex[url];
                            if (typeof index === 'number') {
                                // Merge the new repo data with the existing repo data.
                                mergedNodes[index] = mergeObjects(mergedNodes[index], repo);
                            } else {
                                // First time we've seen this repo in this array.
                                repoUrlToIndex[url] = mergedNodes.length;
                                mergedNodes.push(repo);
                            }
                        });

                        return {
                            ...existing,
                            ...incoming,
                            nodes: mergedNodes,
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
            keyFields: ['name'],
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
                },
                nonRenovateRequests: {
                    read(_, {readField}) {
                        const prs = readField({fieldName: 'pullRequests', args: {first: 100, states: 'OPEN'}});

                        const nodes = prs.nodes.filter(node => !readField('isRenovate', node));
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
            keyFields: ['repository', ['name'], 'number']
        },
        PullRequest: {
            keyFields: ['repository', ['name'], 'number'],
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
            await persistCache({
                cache,
                storage: new LocalStorageWrapper(window.localStorage),
                debug: true,
                trigger: 'write'
            });

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

    const clearCache = useCallback(async () => {
        await client.resetStore();
    }, [client]);

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
                            <BookmarkIcon size={16} />
                            <span className="logotype">Slimer Dashboard</span>
                        </div>
                        <div>
                            <nav>
                                <NavLink className={({isActive}) => (isActive ? 'active' : null)} to="/">Repos</NavLink>{' | '}
                                <NavLink className={({isActive}) => (isActive ? 'active' : null)} to="/renovate">Renovate</NavLink>{' | '}
                                <NavLink className={({isActive}) => (isActive ? 'active' : null)} to="/prs">PRs</NavLink>{' | '}
                                <NavLink className={({isActive}) => (isActive ? 'active' : null)} to="/issues">Issues</NavLink>
                            </nav>
                        </div>
                        <div>
                            <Avatar />
                            <a onClick={clearCache}><SyncIcon /></a>
                        </div>
                    </Header>

                    <Routes>
                        <Route path="/" element={<Repos />} />
                        <Route path="/renovate" element={<Renovate />} />
                        <Route path="/prs" element={<PRs />} />
                        <Route path="/issues" element={<Issues />} />
                    </Routes>
                </Container>
            </Router>
        </ApolloProvider>
    );
};

export default App;
