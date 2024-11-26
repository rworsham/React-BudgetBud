import React from 'react';
import LoginForm from './LoginForm';

function Login({ loginUser }) {
    return (
        <div style={{ padding: '20px' }}>
            <LoginForm loginUser={loginUser} />
        </div>
    );
}

export default Login;