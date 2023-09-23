import React, { useEffect, useState } from 'react'
import Sellermenu from '../../component/Layout/Sellermenu';
import axios from 'axios';
import { useSeller } from '../../context/seller';

const Orders = () => {
    const { seller } = useSeller();
    const [orders, setOrders] = useState([]);
    const getUserOrder = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/api/seller/getuserorders`, {
                headers: {
                    "Authorization": seller.token
                }
            });
            if (res.data.status === 200) {
                setOrders(res.data.data)
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getUserOrder();
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
                        <p>Manage Your Orders</p>
                    </div>
                    {
                        orders && <table className='table table-bordered table-striped'>
                            <thead className='text-center'>
                                <tr>
                                    <th>Sr.no</th>
                                    <th>PName</th>
                                    <th>PImage</th>
                                    <th>PColor</th>
                                    <th>PPrice</th>
                                    <th>Qty</th>
                                    <th>Total</th>
                                    <th>PType</th>
                                    <th>PStatus</th>
                                    <th>Buyer</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {
                                    orders.map((values, index) => {
                                        return (
                                            <tr key={index + 1}>
                                                <td>{index + 1}</td>
                                                <td>{values.products.pname}</td>
                                                <td className='m-0 p-0' ><img src={`/uploads/${values.products.pimage}`} alt={values.products.pname} width="50px" height="50px" /></td>
                                                <td>{values.products.pcolor}</td>
                                                <td>₹ {values.products.pprice}</td>
                                                <td>{values.products.quantity}</td>
                                                <td>₹ {values.products.total}</td>
                                                <td>{values.products.ptype}</td>
                                                <td>{values.products.payment}</td>
                                                <td>{values.products.fullname}</td>
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

export default Orders;