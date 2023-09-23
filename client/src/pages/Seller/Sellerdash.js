import React from 'react'
import Sellermenu from '../../component/Layout/Sellermenu';
import { useSeller } from '../../context/seller';

const Sellerdash = () => {
  const {seller} = useSeller();
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <Sellermenu />
        </div>
        <div className="col-md-9">
          <div className='heading'>
            <p>Hello, {seller?.seller.fullname} !!!</p>
          </div>
          <div className="card py-5">
            <h1>{seller?.seller.fullname}</h1>
            <p className="title">{seller?.seller.email}</p>
            <p className='lead mt-3'>{seller?.seller.pnumber}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sellerdash;