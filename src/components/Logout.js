import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        navigate('/home');
    }, [navigate]);

    return null;
};

export default Logout;