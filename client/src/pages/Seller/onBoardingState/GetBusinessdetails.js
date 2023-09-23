import React, { useState } from 'react'
import Gstin from './Gstin';

const GetBusinessdetails = () => {
  const [selected, setSelected] = useState('I have a GSTIN');

  const handleChange = (e) => {
    setSelected(e.target.value)
  }
  
  return (
    <div className="container d-flex justify-content-center">
      <form className="form border m-4 p-5" autoComplete='off'>
        <div className="row">
          <div className="col-md-12">
            <h1 className='logo'>Give your Business Details</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="form-check">
              <input className="form-check-input p-0 mt-2" type="radio" onChange={handleChange} name="GSTIN" id="firstRadioButton" value="I have a GSTIN" checked={selected === 'I have a GSTIN'} />
              <label className="form-check-label m-0 p-0" htmlFor="firstRadioButton">
                I have a GSTIN
              </label>
            </div>
          </div>
          <div className="col-12">
            <div className="form-check">
              <input className="form-check-input p-0 mt-2" type="radio" onChange={handleChange} name="GSTIN" id="secondRadioButton" value="I will only sell in GSTIN exempt categories like books" checked={selected === 'I will only sell in GSTIN exempt categories like books'} />
              <label className="form-check-label m-0 p-0" htmlFor="secondRadioButton">
                I will only sell in GSTIN exempt categories like books
              </label>
            </div>
          </div>
          <div className="col-12">
            <div className="form-check">
              <input className="form-check-input p-0 mt-2" type="radio" onChange={handleChange} name="GSTIN" id="thirdRadioButton" value="I have applied/will apply for a GSTIN" checked={selected === 'I have applied/will apply for a GSTIN'} />
              <label className="form-check-label m-0 p-0" htmlFor="thirdRadioButton">
                I have applied/will apply for a GSTIN
              </label>
            </div>
          </div>
          <Gstin gst={selected} />
        </div>
      </form>
    </div>
  )
}

export default GetBusinessdetails;