import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.css'
import backgroundImage from './assets/backgroundImage.jpg'
import googleIcon from './assets/googleIcon.png'
import icon100 from './assets/icon100.png'

import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';

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

const LandingPage = props => {
    const [isSigningUp, setIsSigningUp] = useState(false) 
    const navigate = useNavigate();

    useEffect(() => {
        if (props.isLoggedIn){
            navigate('/home')
        }
    }, [props.isLoggedIn])
    function clickedOnSignUp() {
        return setIsSigningUp(true)
    }

    const handleGoogleSignUp = async () => {
        let provider = new GoogleAuthProvider()
        let signIn = await signInWithRedirect(auth, provider)
    }

    return(
        <div style={isSigningUp === true ? {position: 'absolute'} : {position: 'relative'}} className={styles.outer}>
            <div className={styles.imageContainer}>
                <img alt='background' src={backgroundImage} />
            </div>
            <div className={styles.accountInformation}>
                <div className={styles.icon}>
                    <img alt='icon' src={icon100}/>
                </div>
                <h1>
                    The space for all of your ideas
                </h1>
                <div className={styles.signUpContainer}>
                    <span> Join Solteract today. </span>
                    <div className={styles.signUpButtons}>
                        <div onClick={handleGoogleSignUp}>
                           <img alt='gmail icon' src={googleIcon}/> <span>Sign up with Google</span>
                        </div>
                        <div className={styles.emailSignUp}>
                            <Link className={styles.emailSignUpLink} data={{handleClick: clickedOnSignUp}} to={{pathname:'/signup'}}>
                                Sign up with Email
                            </Link>
                        </div>
                    </div>
                </div>
                <div style={{display: 'flex', gap: 8, flexDirection:'column'}}className={styles.existingAccount}>
                    <p style={{fontSize: 19}}>Already have an account?</p>
                    <Link className={styles.signInLink} to={{pathname: '/login'}}>
                        <div className={styles.signInButton}>Sign In</div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;