import actionTypes from '../constants/actionTypes';
//import runtimeEnv from '@mars/heroku-js-runtime-env'
const env = process.env;

function userLoggedIn(username) {
    return {
        type: actionTypes.USER_LOGGEDIN,
        username: username
    }
}

function logout() {
    return {
        type: actionTypes.USER_LOGOUT
    }
}

export function submitLogin(data) {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/signin`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.msg || 'Login failed');
                });
            }
            return response.json();
        }).then((res) => {
            localStorage.setItem('username', data.username);
            localStorage.setItem('token', res.token);

            dispatch(userLoggedIn(data.username));
        }).catch((e) => dispatch({ type: actionTypes.AUTH_ERROR, message: e.message }))
    }
}

export function submitRegister(data) {
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            mode: 'cors'
        }).then((response) => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.msg || data.message || 'Register failed');
                });
            }
            return response.json();
        }).then((res) => {
            dispatch(submitLogin(data));
        }).then((response) => {
            if (response && !response.ok) {
                return response.json().then(data => {
                    throw new Error(data.msg || 'Login failed');
                });
            }
            return response.json();
        }).catch((e) => dispatch({ type: actionTypes.AUTH_ERROR, message: e.message }))
    }
}

export function logoutUser() {
    return dispatch => {
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        dispatch(logout())
    }
}