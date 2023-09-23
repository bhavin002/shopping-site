import React from 'react'
import "../../style/Seller.css";
import Offer from "../../images/offer.png"
import persone1 from "../../images/testimonial/persone1.png"
import persone2 from "../../images/testimonial/persone2.png"
import persone3 from "../../images/testimonial/persone3.png"
import { useNavigate } from 'react-router-dom';

const Seller = () => {
  const navigate = useNavigate();
  const createAc = () => {
    navigate("/seller/signup");
  }
  const loginAc = () =>{
    navigate("/seller/signin")
  }
  return (
    <>
      <div style={{ backgroundColor: "#d2eafc" }}>
        <div className="container">
          <div className="row" style={{ paddingBottom: "30px" }}>
            <div className="col-6" style={{ marginTop: "100px" }}>
              <span className='btnSpan'>LIMITED TIME OFFER</span>
              <p className='sellerTitle my-3'>Become an Amazon seller</p>
              <p className='title my-3'>Sell to crores of customers with <b className='lead'>50% off on Selling Fee*</b> on Amazon.in</p>
              <div><span><button className='btnSeller' onClick={createAc}>Start Selling</button><button className='btnSellerLogin' onClick={loginAc}>Login</button></span></div>
            </div>
            <div className="col-6 mt-4">
              <img src={Offer} alt="Offer" className='img img-fluid' />
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <p className="sellerTitle text-center my-3">Testimonial of our best seller</p>
          </div>
        </div>
        <div className="row mb-5">
          <div className="col-4">
            <div className="testimonialCard">
              <div className='text-center'><img src={persone1} alt="persone1" className='bestSellerImg' /></div>
              <div className='bestSellerDescription py-3 text-center'><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, quod doloremque. Perspiciatis molestiae quasi asperiores beatae vitae vero minima, adipisci consequatur totam voluptatibus architecto dignissimos dolorem, at officia? Dolore, saepe.</p></div>
              <div className='bestSellerName text-center'><p>Williamson</p></div>
            </div>
          </div>
          <div className="col-4">
            <div className="testimonialCard">
              <div className='text-center'><img src={persone2} alt="persone1" className='bestSellerImg' /></div>
              <div className='bestSellerDescription py-3 text-center'><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, quod doloremque. Perspiciatis molestiae quasi asperiores beatae vitae vero minima, adipisci consequatur totam voluptatibus architecto dignissimos dolorem, at officia? Dolore, saepe.</p></div>
              <div className='bestSellerName text-center'><p>Kristina</p></div>
            </div>
          </div>
          <div className="col-4">
            <div className="testimonialCard">
              <div className='text-center'><img src={persone3} alt="persone1" className='bestSellerImg' /></div>
              <div className='bestSellerDescription py-3 text-center'><p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum, quod doloremque. Perspiciatis molestiae quasi asperiores beatae vitae vero minima, adipisci consequatur totam voluptatibus architecto dignissimos dolorem, at officia? Dolore, saepe.</p></div>
              <div className='bestSellerName text-center'><p>Steve Thomas</p></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Seller;