import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
    const userId = 1;
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/users/', {
            params: {
                ID: userId,
            },
        })
            .then((response) => {
                console.log(response.data);
                setUserData(response.data[0]);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            <h2>User ID: {userData.id}</h2>
            <p>Name: {userData.username}</p>
            <p>Email: {userData.email}</p>
        </div>
    );
}

export default UserProfile;