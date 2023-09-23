import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useUser } from '../../context/user';
import Small from "../../images/small.png"
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';


const Address = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isExistAddress, setIsExistAddress] = useState(false);
  const [address, setAddress] = useState([])

  const getAddress = async () => {
    try {
      const res = await axios.get(`http://localhost:8081/api/user/getaddress`, {
        headers: {
          'Authorization': user.token
        }
      })
      if (res.data.status === 200) {
        setIsExistAddress(true)
        setAddress(res.data.data)
      }
    } catch (error) {
      setIsExistAddress(false);
      console.log("Error in getAddress", error);
    }
  }

  useEffect(() => {
    getAddress();
    // eslint-disable-next-line
  }, [])

  const addNew = () => {
    navigate("/dashboard/user/addaddress");
  }

  const deleteAddress = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/user/deleteaddress/${id}`, {
        headers: {
          "Authorization": user.token
        }
      });
      if (res.data.status === 200) {
        getAddress();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  const editAddress = async (id) => {
    navigate(`/dashboard/user/editaddress/${id}`);
  }


  const defaultBtn = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8081/api/user/setdefaultaddress/${id}`, {
        headers: {
          'Authorization': user.token
        }
      });
      if (res.data.status === 200) {
        getAddress();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }
  return (
    <div className="container">
      <div className="row my-4">
        <div className="col-1">
          <KeyboardBackspaceIcon style={{ fontSize: "40px", cursor: "pointer" }} />
        </div>
        <div className="col-11 text-center">
          <p className='acTitle'>Manage Address</p>
        </div>
      </div>
      <div className="row">
        <div className="col-4">
          <div className='addressBox text-center pt-5'>
            <p className='plus'>+</p>
            <button className='btnAdd' onClick={addNew}>Add New address</button>
          </div>
        </div>
        {
          isExistAddress ?
            address.map((value) => {
              return (
                <div className="col-4 d-flex justify-content-center" key={value._id}>
                  <div className="existAddressBox">
                    {
                      value.isDefault === true ? <div className='text-center py-1 border-bottom border-2'><span>Default : </span><img src={Small} alt="small" /></div> : <div className='text-center py-3 border-bottom border-2'></div>
                    }
                    <div className='p-3 border-bottom border-2'>
                      <p>{`${value.baseaddress}`}</p>
                      <p>{`${value.assv}`}</p>
                      <p>{`${value.city} , ${value.state} ${value.pincode}`}</p>
                      <p>India</p>
                    </div>
                    {
                      value.isDefault === true ? <div className='text-center pt-2'><button className='btn btn-primary mx-2 px-4' onClick={() => { editAddress(value._id) }}>Edit</button><button className='btn btn-danger mx-2 px-4' onClick={() => { deleteAddress(value._id) }}>remove</button></div> : <div className='text-center pt-2'><button className='btn btn-primary mx-1' onClick={() => { editAddress(value._id) }}>Edit</button><button className='btn btn-danger mx-1' onClick={() => { deleteAddress(value._id) }}>remove</button> <button className='btn btn-warning' onClick={() => { defaultBtn(value._id) }}>Set Default</button></div>
                    }
                  </div>
                </div>
              )
            })
            : null
        }
      </div>
      <Toaster />
    </div>
  )
}

export default Address;