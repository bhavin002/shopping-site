import React, { useEffect } from 'react'
import {  useSearchParams } from 'react-router-dom';
import Getpassword from '../onBoardingState/Getpassword';
import Getaddress from '../onBoardingState/Getaddress';
import GetBusinessdetails from '../onBoardingState/GetBusinessdetails';
import Getbankdetails from '../onBoardingState/Getbankdetails';
import Sellerboarding from '../onBoardingState/Sellerboarding';

const Selleronboarding = () => {
    const [onBoardingState, setOnBoardingState] = useSearchParams();
    useEffect(() => {
        if (!onBoardingState.has('onBoardingState')) {
            onBoardingState.set('onBoardingState','getPasswordDetails')
            setOnBoardingState(onBoardingState)
        }
    }, [onBoardingState, setOnBoardingState]);


    if (onBoardingState.get('onBoardingState') === 'getPasswordDetails') {
        return (
            <Getpassword/>

        )
    }

    if (onBoardingState.get('onBoardingState') === 'getAddressDetails') {
        return (
            <Getaddress/>
        )
    }
    if (onBoardingState.get('onBoardingState') === 'getBusinessDetails') {
        return (
            <GetBusinessdetails/>
        )
    }

    if (onBoardingState.get('onBoardingState') === 'getBankDetails') {
        return (
            <Getbankdetails/>
        )
    }
    if (onBoardingState.get('onBoardingState') === 'onSellerBoarding') {
        return (
            <Sellerboarding/>
        )
    }
};


export default Selleronboarding;