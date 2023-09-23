import React, { useEffect, useState } from 'react'
import bg1 from "../images/bg1.png";
import bg3 from "../images/bg3.png";
import "../style/Home.css";
import Carousel from 'react-bootstrap/Carousel';
import Watch from "../videos/watch.mp4"
import Headphones from "../videos/headphones.mp4"
import Earphones from "../videos/earphones.mp4"
import Speaker from "../videos/speaker.mp4"
import Airdopes from "../videos/airdopes.mp4"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from "../context/user"
import { useCart } from '../context/cart';
import { Toaster, toast } from "react-hot-toast";


const Home = () => {
  const [listings, setlistings] = useState([]);
  const { user } = useUser();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const getAllListings = async () => {
    try {
      const res = await axios.get("http://localhost:8081/api/seller/listing/getlistings");
      if (res.data.status === 200) {
        setlistings(res.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllListings();
    // eslint-disable-next-line
  }, [])

  const singleProduct = async (id) => {
    navigate(`/product/${id}`);
  }

  const singleCategory = (category) => {
    navigate(`/category/${category}`)
  }

  const addItem = (_id, sellerId, pname, pprice, pcolor, pdescription, pimage) => {
    if (!user?.token) {
      navigate("/login");
    } else {
      addToCart(_id, sellerId, pname, pprice, pcolor, pdescription, pimage);
      toast.success("Item Add Suuccessfully into cart");
    }
  }

  return (
    <>
      <Carousel slide={false}>
        <Carousel.Item>
          <img className="d-block w-100" src={bg1} alt="First slide" />
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src={bg3} alt="Second slide" />
        </Carousel.Item>
      </Carousel>
      <div className="container scroll-container">
        <div className="row">
          <div className="col-12">
            <p className='lead mx-5 my-4'><span className='eBestsellers'>Explore Bestsellers</span></p>
          </div>
        </div>
        <div className='videosRow scroll-content my-3'>
          <div className="video-frame">
            <video width="320" height="240" loop autoPlay muted controlsList="nodownload" onClick={() => { singleCategory("watch") }}>
              <source src={Watch} type="video/mp4" />
            </video>
            <p className="lead text-center"><span className='eBestsellers'>Smartwatches</span></p>
          </div>
          <div className="video-frame">
            <video width="320" height="240" loop autoPlay muted controlsList="nodownload" onClick={() => { singleCategory("earphone") }}>
              <source src={Earphones} type="video/mp4" />
            </video>
            <p className="lead text-center"> <span className='eBestsellers'>Wireless Earphones</span> </p>
          </div>
          <div className="video-frame">
            <video width="320" height="240" loop autoPlay muted controlsList="nodownload" onClick={() => { singleCategory("headphone") }}>
              <source src={Headphones} type="video/mp4" />
            </video>
            <p className="lead text-center"> <span className='eBestsellers'>Headphones</span></p>
          </div>
          <div className="video-frame">
            <video width="320" height="240" loop autoPlay muted controlsList="nodownload" onClick={() => { singleCategory("speaker") }}>
              <source src={Speaker} type="video/mp4" />
            </video>
            <p className="lead text-center"> <span className='eBestsellers'>Wireless Speaker</span></p>
          </div>
          <div className="video-frame">
            <video width="320" height="240" loop autoPlay muted controlsList="nodownload" onClick={() => { singleCategory("airdopes") }}>
              <source src={Airdopes} type="video/mp4" />
            </video>
            <p className="lead text-center"> <span className='eBestsellers'> Wirelss Earbuds</span></p>
          </div>
        </div>
      </div>
      <div>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <p className='lead text-center my-4'><span className='eBestsellers'>Shopping Start Now</span></p>
            </div>
          </div>
          <div className="row my-4">
            {
              listings.map((values) => {
                return (
                  <div className="col-3 product_card" key={values._id}>
                    <img src={`/uploads/${values.listingInfoObj.product.pimage}`} onClick={() => { singleProduct(values._id) }} className='img img-fluid' alt={values.listingInfoObj.product.pname} />
                    <div className="bottomCard">
                      <div className='titleofproduct'><p>boAt - lifestyle</p></div>
                      <p className='nameofproduct'>{values.listingInfoObj.product.pname}</p>
                      <div className='price'>₹ {values.listingInfoObj.product.pprice}.00</div>
                      <div className='btnCart' onClick={() => { addItem(values._id, values.sellerId, values.listingInfoObj.product.pname, values.listingInfoObj.product.pprice, values.listingInfoObj.product.pcolor, values.listingInfoObj.product.pdescription, values.listingInfoObj.product.pimage) }}><button>Add To Cart</button></div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}

export default Home;