import styles from './Signup.module.css'
import React, { useEffect, useState } from "react";
import LandingPage from '../landing-page/LandingPage';
import { useNavigate } from 'react-router-dom';

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBMUyuCaT-w1Djk9COvL_uv5hpEWgWbvFU",
    authDomain: "soterak-1f634.firebaseapp.com",
    projectId: "soterak-1f634",
    storageBucket: "soterak-1f634.appspot.com",
    messagingSenderId: "1011495664589",
    appId: "1:1011495664589:web:40d0f06ae1df49bbbea284"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth();

// Signup component
const Signup = props => {
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [errorMessages, setErrorMessages] = useState('')
    const [validPassword, setValidPassword] = useState(false)

    const navigate = useNavigate()

    // Update user's info
    const changeUserInfo = (prop, value) => {
        setUserInfo({
            ...userInfo,
            [prop]: value
        })  
    }

    useEffect(() => {
        handleValidation()
    }, [userInfo.password])

    useEffect(() => {
        setErrorMessages('')
    }, [userInfo])

    const handleValidation = () => {
        let formIsValid = true
        for (let key in userInfo){
            if (key === 'name'){
                if (userInfo[key].trim() === ''){
                    setErrorMessages(`Name can't be left empty!`)
                    return formIsValid = false
                }
                else if (!userInfo[key].match(/^[a-zA-z\s]+$/)){
                    setErrorMessages(`Name can only be letters.`)
                    return formIsValid = false
                }
            }
            if (key === 'email'){
                if (userInfo[key].trim() === ''){
                    setErrorMessages(`Email can't be left empty!`)
                    return formIsValid = false
                }
            }
            if (key === 'password'){
                if (userInfo[key].trim() === ''){
                    setErrorMessages(`Password can't be left empty!`)
                    setValidPassword(false)
                    return formIsValid = false
                } else if (userInfo[key].length < 6){
                    setErrorMessages(`Password must be at least 6 characters`)
                    setValidPassword(false)
                    return formIsValid = false
                } 
                else {
                    setValidPassword(true)
                }
            }
        }
        return formIsValid = true
    }

    const handleSignUp = async () => {
        if (handleValidation() === true){
            try{
                const user = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password )
                props.addToUserCollection(userInfo.name)
                navigate('/home')
            } catch{
                setErrorMessages('Email must be in correct email format or email taken')
            }
        }
    }

    const handleClick = () => {
        if (handleValidation() === true){
            handleSignUp()
        }
    }
  
    return(
        <div className={styles.outerContainer}>
            <div style={{position: 'absolute', backgroundColor: 'rgba(0, 0, 0, .5)', opacity: 0.4}}>
                <LandingPage/>
            </div>
            <div className={styles.formContainer}>
                <div style={{cursor: 'pointer'}} onClick={(() => navigate('/'))}>
                    X
                </div>
                <div className={styles.nameAndPhoneContainer}>
                    <div>
                        <h1>Create your account</h1>
                        <div>
                            <input placeholder='Name' onChange={e => changeUserInfo('name', e.target.value)}/>
                            <input placeholder='Email' onChange={e => changeUserInfo('email', e.target.value)}/>
                            <input placeholder='Password' type='password' onChange={e => changeUserInfo('password', e.target.value)}/>
                            <div>{errorMessages}</div>
                        </div>
                    </div>
                    <div className={styles.next} style={{backgroundColor: validPassword ? 'black' : 'rgb(0, 0, 0, 0.3'}} onClick={handleClick}>
                    {validPassword ?
                    <div style={{textDecoration: 'none', color: 'white'}} to='/home'> Next</div>
                    : <span>Next</span>}
                    </div>
                </div>
            </div>
        </div>
    ) 
}

export default Signup;