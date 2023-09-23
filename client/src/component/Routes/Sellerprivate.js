import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { useSeller } from '../../context/seller';
import { useNavigate, Outlet } from 'react-router-dom';

const Sellerprivate = () => {
    const [success, setSuccess] = useState();
    const navigate = useNavigate();
    const { seller } = useSeller();

    useEffect(() => {
        const isValid = async () => {
            const res = await axios.get(`http://localhost:8081/api/seller/validoneseller`, { headers: { "Authorization": `${seller.token}` } });
            if (res.data.ok) {
                setSuccess(true)
            } else {
                setSuccess(false)
            }
        }
        if (seller?.token) {
            isValid();
        }
        if (success === false) {
            navigate('/seller/signin')
        }
    }, [navigate, success, seller?.token]);
    return success && <Outlet />
}

export default Sellerprivate;