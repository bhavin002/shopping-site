import React, { useEffect, useState } from 'react'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import axios from 'axios';
import { useUser } from '../../context/user';
import "../../style/Order.css";
import CloseIcon from '@mui/icons-material/Close';

const Oreder = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    onumber: '',
    odate: '',
    products: [],
    totalAmount: ''
  });

  const getAllOrders = async () => {
    const res = await axios.get(`http://localhost:8081/api/user/getallorders`, {
      headers: {
        "Authorization": user?.token
      }
    })
    if (res.data.status === 200) {
      setOrders(res.data.data)
    }
  }

  useEffect(() => {
    getAllOrders();
    // eslint-disable-next-line
  }, [])

  const getOrderDetails = async (oid) => {
    setIsOpen(true)
    const res = await axios.get(`http://localhost:8081/api/user/orderdetails/${oid}`, {
      headers: {
        "Authorization": user?.token
      }
    })

    if (res.data.status === 200) {
      const { date, products, totalAmount, _id } = res.data.data[0];
      setOrderDetails({
        ...orderDetails,
        onumber: _id,
        odate: date,
        products: products,
        totalAmount: totalAmount
      })
    }
  }

  const currentDateTime = new Date(orderDetails.odate);

  const formatDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return currentDateTime.toLocaleDateString(undefined, options);
  };

  const formatTime = () => {
    const options = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return currentDateTime.toLocaleTimeString(undefined, options);
  };

  return (
    <div className="container">
      <div className="row my-4">
        <div className="col-1">
          <KeyboardBackspaceIcon style={{ fontSize: "40px", cursor: "pointer" }} />
        </div>
        <div className="col-11 text-center">
          <p className='acTitle'>Manage Your Orders</p>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <table className='table table-bordered'>
            <thead className='text-center'>
              <tr>
                <th>Order Number</th>
                <th>Date</th>
                <th>Payment Type</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Invoice</th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {
                orders.map((values) => {
                  console.log(values)
                  const formattedDate = new Date(values.date).toLocaleDateString('en-GB');
                  return (
                    <tr key={values._id}>
                      <td><span className='oid' onClick={() => { getOrderDetails(values._id) }}>{values._id}</span></td>
                      <td>{formattedDate}</td>
                      <td style={{ textTransform: "uppercase" }}>{values.ptype}</td>
                      <td style={{ textTransform: "uppercase" }}>{values.payment}</td>
                      <td>₹ {values.totalAmount}.00</td>
                      <th>-</th>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>
      {
        isOpen && <div className="modal_box">
          <div className="modal_header">
            <div className="row">
              <div className="col-10">
                <p className='px-5'>Order</p>
              </div>
              <div className="col-2" onClick={() => { setIsOpen(false) }}>
                <CloseIcon style={{ cursor: "pointer" }} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-center my-1">
              <p className="lead">Order #{orderDetails.onumber}</p>
              <p className="title">{formatDate()} {formatTime()}</p>
            </div>
          </div>
          <div className="model_content">
            <div className="row">
              <div className="col-12">
                <table className='table'>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className='text-center'>Quantity</th>
                      <th className='text-center'>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      orderDetails.products.map((values) => {
                        return (
                          <tr key={values._id}>
                            <td>
                              <div className="row">
                                <div className="col-3">
                                  <img src={`/uploads/${values.pimage}`} className='img img-fluid orderImg' alt={values.pimage} />
                                </div>
                                <div className="col-9">
                                  <p className='lead' style={{ fontWeight: "bold" }}>{values.pname} - {values.pcolor}</p>
                                  <p className="title">{values.pcolor}</p>
                                  <p className="lead">Rs. {values.pprice}.00</p>
                                </div>
                              </div>
                            </td>
                            <td className='text-center'>{values.quantity}</td>
                            <td>Rs.{values.total}.00</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <div className="row py-2">
                <div className="col-12 d-flex justify-content-end">
                  <span className='mx-3 lead' style={{ fontWeight: "bold" }}>Total</span>
                  <span className='mx-3 lead' style={{ fontWeight: "bold" }}>Rs.{orderDetails.totalAmount}.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default Oreder;