import {useContext, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Logout = ({setAuthTokens, setUser}) => {
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        logout(setAuthTokens, setUser);
        navigate('/');
    }, [setAuthTokens, setUser, navigate, logout]);

    return null;
};

export default Logout;