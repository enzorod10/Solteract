import styles from './Login.module.css'
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import googleIcon from './assets/googleIcon.png'
import icon50 from './assets/icon50.png'

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

const Login = props => {
    const [userInfo, setUserInfo] = useState({})
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate();

    useEffect(() => {
        if (props.isLoggedIn){
            navigate('/home')
        }
    }, [props.isLoggedIn])

    const grabUserInfo = (prop, value) => {
        setUserInfo({...userInfo, [prop]: value})
        setErrorMessage('')
    }

    const handleLoginClick = () => {
        try{
            signInWithEmailAndPassword(auth, userInfo.email, userInfo.password).then(() => {
                props.updateUser()
                navigate('/home')
            }, () => setErrorMessage('Email or password is incorrect')
            )
        } catch{
        }
    }

    const handleGoogleSignUp = async () => {
        let provider = new GoogleAuthProvider()
        let signIn = await signInWithRedirect(auth, provider)
    }

    return(
        <div className={styles.outerContainer}>
            <div className={styles.formContainer}>
                <div className={styles.xButton} onClick={() => navigate('/')} style={{display: 'absolute', top: 0, left: 0}}>
                    X
                </div>
                <div className={styles.innerContainer}>
                    <div>
                        <img alt='icon' src={icon50} />
                    </div>
                    <div className={styles.loginContent}>
                        <h1>
                            Sign in to Solteract
                        </h1>
                        <div onClick={handleGoogleSignUp} className={styles.googleLogin}>
                            <img alt='google icon' src={googleIcon}/>Sign in with google
                        </div>
                        <div className={styles.orContainer}>
                            <div>
                            </div>
                            <div>
                                OR
                            </div>
                            <div>
                            </div>
                        </div>
                        <form style={{position: 'relative'}} className={styles.emailAndPassword}>
                            <input onChange={e => grabUserInfo('email', e.target.value)}placeholder='Email'/>
                            <input type='password' onChange={e => grabUserInfo('password', e.target.value)}placeholder='Password'/>
                            {errorMessage !== '' && 
                            <div style={{color: 'red', fontSize: '12px', position: 'absolute', bottom: '-20px'}}>
                                Email or password is incorrect!
                            </div>}
                        </form>
                        
                        <div className={styles.loginButton} onClick={handleLoginClick}>
                            Log in
                        </div>
                    </div>
                    <div>
                        Dont have an account? <Link style={{textDecoration: 'none'}} to={{pathname:'/signup'}}>Sign up</Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login;