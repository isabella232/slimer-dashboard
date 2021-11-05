import React, {useEffect} from 'react';
import fetch from 'unfetch';

import {MarkGithubIcon} from '@primer/octicons-react';

import './Login.css';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
const AUTH_API_URI = process.env.REACT_APP_AUTH_API_URI;

const Login = ({onSuccess}) => {
    useEffect(() => {
        async function auth() {
            const storedToken = localStorage.getItem('github_token');
            if (storedToken) {
                return;
            }

            const code = window.location.href.match(/\?code=(.*)/) && window.location.href.match(/\?code=(.*)/)[1];

            if (code) {
                await fetch(`${AUTH_API_URI}${code}`)
                    .then(response => response.json())
                    .then(({token}) => {
                        if (token) {
                            localStorage.setItem('github_token', token);
                            onSuccess(token);
                        }
                    });
            }
        }

        auth().catch(console.error);
    }, []);

    return (
        <div className="login-wrapper">
            <a
                href={`https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=user,repo&redirect_uri=${REDIRECT_URI}`}
            >
                <span>Sign in with GitHub <MarkGithubIcon size={22} /></span>
            </a>
        </div>
    );
};

export default Login;
