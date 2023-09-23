import React, { useEffect, useState } from 'react'
import Sellermenu from '../../component/Layout/Sellermenu';
import axios from 'axios';
import { useSeller } from '../../context/seller';

const Payments = () => {
    const { seller } = useSeller();
    const [payments, setPaymnets] = useState([]);
    const paymentByUser = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/api/seller/getpayments`, {
                headers: {
                    "Authorization": seller.token
                }
            });
            if (res.data.status === 200) {
                setPaymnets(res.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        paymentByUser();
        // eslint-disable-next-line
    }, [])


    return (
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <Sellermenu />
                </div>
                <div className="col-md-9">
                    <div className='heading'>
                        <p>Manage Your Payments</p>
                    </div>
                    {
                        payments && <table className='table table-bordered table-striped'>
                            <thead className='text-center'>
                                <tr>
                                    <th>Sr.no</th>
                                    <th>Byuer</th>
                                    <th>Pending Payment</th>
                                    <th>Done Payment</th>
                                    <th>Total Payment</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {
                                    payments.map((values, index) => {
                                        return (
                                            <tr key={index + 1}>
                                                <td>{index + 1}</td>
                                                <td>{values.fullname}</td>
                                                <td>₹ {values.pendingTotal}</td>
                                                <td>₹ {values.doneTotal}</td>
                                                <td>₹ {values.pendingTotal + values.doneTotal}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </div>
    )
}

export default Payments;