import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from "../context/AuthContext";

const Logout = ({setAuthTokens, setUser}) => {
    const navigate = useNavigate();

    useEffect(() => {
        logout(setAuthTokens, setUser);
        navigate('/');
    }, [setAuthTokens, setUser, navigate]);

    return null;
};

export default Logout;