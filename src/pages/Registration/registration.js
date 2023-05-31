/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-useless-concat */
import React, { useState } from 'react'
import { regImg, successImg } from '../../assets/assets';
import RegistrationForm from '../../component/form';
import useWindowDimensions from '../../component/windowDimension';

function Registration() {
  
  const [transitionClassnameCol1, setTransitionClassnameCol1] = useState();
  const [transitionClassnameCol2, setTransitionClassnameCol2] = useState();
  const [incomingDivClassname, setIncomingDivClassname] = useState();
  const [form, setForm] = useState({"firstName":"John", "lastName":"kua", "company":"", "telephone":"", "email":"youremail@gmail.com", "password":"","confirm":""})
  const [state, setState] = useState(false)
  const { width } = useWindowDimensions()

  const onFinish = (value) => {
    setForm(value)
    setTransitionClassnameCol1('col-1-ease-left')
    setTransitionClassnameCol2('col-2-ease-right')
    setTimeout(() => {  setState(true) }, 3000);
    setIncomingDivClassname('register-confirmation')
  }

  return (
    <div className='registrationParentDiv'>
      <div className='centerBox'>
        <div className='centerBoxInnerSpace'>
          <div className={'centerBoxInnerCol1' + ' ' + transitionClassnameCol1}>
            <div className='formHeadingDiv'>
              <h2>REGISTER NOW</h2>
              <p >Already have an account? <a>Sign in</a></p>
            </div>
            <RegistrationForm onFinish={onFinish}/>
          </div>
          {
            width > 600
            ? <div className={'centerBoxInnerCol2' + ' ' + transitionClassnameCol2}>
                <img alt='regImg' width={400} src={regImg}/>
              </div>
            : null
          }
          
        </div>
      </div>
      <div className={state ? incomingDivClassname : 'noDisplay'}>
        <img alt='regImg' width={ width > 600 ? 500 : 300} src={successImg}/>
        <div className='successContent'>
          <h1>Thanks for registering!</h1>
          <p>We have sent you an email verification to {form.email}.</p>
          <p>Please check it and grab the link from there.</p>
        </div>
      </div>
    </div>
  )
}

export default Registration