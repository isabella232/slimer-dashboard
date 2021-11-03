import React, {Component} from 'react';
import fetch from 'unfetch';
import {
    STATUS,
    Loading,
    Container,
    Header
} from 'gitstar-components';

import Octicon, {Bookmark} from '@githubprimer/octicons-react';

import {ApolloProvider, ApolloClient, InMemoryCache} from '@apollo/client';

import Avatar from './Avatar';
import Repositories from './Repositories';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
const AUTH_API_URI = process.env.REACT_APP_AUTH_API_URI;

const client = new ApolloClient({
    cache: new InMemoryCache({
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
    }),
    uri: 'https://api.github.com/graphql',
    headers: {
        authorization: `Bearer ${localStorage.getItem('github_token')}`
    }
});

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            status: STATUS.INITIAL
        };
    }

    componentDidMount() {
        const storedToken = localStorage.getItem('github_token');
        if (storedToken) {
            this.setState({
                status: STATUS.AUTHENTICATED
            });
            return;
        }
        const code =
      window.location.href.match(/\?code=(.*)/) &&
      window.location.href.match(/\?code=(.*)/)[1];

        if (code) {
            this.setState({status: STATUS.LOADING});
            fetch(`${AUTH_API_URI}${code}`)
                .then(response => response.json())
                .then(({token}) => {
                    if (token) {
                        localStorage.setItem('github_token', token);
                    }
                    this.setState({
                        status: STATUS.FINISHED_LOADING
                    });
                });
        }
    }
    render() {
        return (
            <ApolloProvider client={client}>
                <Container>
                    <Header>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <Octicon icon={Bookmark} size='medium' />
                            <span className="logotype">Slimer Dashboard</span>
                        </div>
                        <Avatar
                            style={{
                                transform: `scale(${
                                    this.state.status === STATUS.AUTHENTICATED ? '1' : '0'
                                })`
                            }}
                        />
                        <a
                            style={{
                                display: this.state.status === STATUS.INITIAL ? 'inline' : 'none'
                            }}
                            href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user,repo&redirect_uri=${REDIRECT_URI}`}
                        >
          Login
                        </a>
                    </Header>
                    <Loading
                        status={this.state.status}
                        callback={() => {
                            if (this.props.status !== STATUS.AUTHENTICATED) {
                                this.setState({
                                    status: STATUS.AUTHENTICATED
                                });
                            }
                        }}
                    />
                    {this.state.status === STATUS.AUTHENTICATED && <Repositories />}
                </Container>
            </ApolloProvider>
        );
    }
}

export default App;
