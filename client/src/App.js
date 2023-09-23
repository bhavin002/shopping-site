import React from 'react';
import "./style/App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './component/Layout/Header';
import { Routes, Route } from "react-router-dom"
import Home from './pages/Home';
import Login from './pages/User/userAc/Login';
import Seller from './pages/Seller/Seller';
import Register from './pages/User/userAc/Register';
import Error from './pages/Error';
import Oreder from './pages/User/Oreder';
import Profile from './pages/User/Profile';
import Address from './pages/User/Address';
import Addaddress from './pages/User/Addaddress';
import Editaddress from './pages/User/Editaddress';
import Signin from './pages/Seller/sellerAc/Signin';
import Signup from './pages/Seller/sellerAc/Signup';
import Selleronboarding from './pages/Seller/sellerAc/Selleronboarding';
import Sellerprivate from './component/Routes/Sellerprivate';
import Sellerdash from './pages/Seller/Sellerdash';
import Userprivate from './component/Routes/Userprivate';
import Newlisting from './pages/Seller/Newlisting';
import Orders from './pages/Seller/Orders';
import Payments from './pages/Seller/Payments';
import Listings from './pages/Seller/Listings';
import SingleProduct from './pages/SingleProduct';
import SingleCategory from './pages/SingleCategory';
import Checkout from './pages/Checkout';
import Account from "./component/Layout/Account"

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path='dashboard' element={<Userprivate />}>
          <Route path='user' element={<Account/>} />
          <Route path='user/order' element={<Oreder />} />
          <Route path='user/profile' element={<Profile />} />
          <Route path='user/address' element={<Address />} />
          <Route path='user/addaddress' element={<Addaddress />} />
          <Route path='user/editaddress/:id' element={<Editaddress />} />
        </Route>
        <Route path='/checkout/:userid' element={<Checkout />} />
        <Route path="becomeseller" element={<Seller />} />
        <Route path='seller/signup' element={<Signup />} />
        <Route path='seller/signin' element={<Signin />} />
        <Route path='seller/selleronboarding' element={<Selleronboarding />} />
        <Route path='sellerdash' element={<Sellerprivate />}>
          <Route path='seller' element={<Sellerdash />} />
          <Route path='seller/newlisting' element={<Newlisting />} />
          <Route path='seller/listings' element={<Listings />} />
          <Route path='seller/orders' element={<Orders />} />
          <Route path='seller/payments' element={<Payments />} />
        </Route>
        <Route path="product/:id" element={<SingleProduct />} />
        <Route path="category/:category" element={<SingleCategory />} />
        <Route path='*' element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
