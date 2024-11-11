import React from 'react';
import LoginForm from './LoginForm';

function Login() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>login</h1>
            <p>Welcome to login page</p>
            <LoginForm />
        </div>
    );
}

export default Login;