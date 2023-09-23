import React, { useEffect, useState } from 'react'
import { useUser } from '../../context/user';
import axios from 'axios';
import { Outlet, useNavigate } from 'react-router-dom';

const Userprivate = () => {
    const [success, setSuccess] = useState();
    const navigate = useNavigate();
    const { user } = useUser();

    useEffect(() => {
        const isValid = async () => {
            const res = await axios.get(`http://localhost:8081/api/user/validoneuser`, { headers: { "Authorization": `${user.token}` } });
            if (res.data.ok) {
                setSuccess(true)
            } else {
                setSuccess(false)
            }
        }
        if (user?.token) {
            isValid();
        }
        if (success === false) {
            navigate('/login')
        }
    }, [navigate, success, user?.token]);
    return success && <Outlet />
}

export default Userprivate;
