import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.css'
import backgroundImage from './assets/backgroundImage.jpg'
import googleIcon from './assets/googleIcon.png'
import icon100 from './assets/icon100.png'

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, signInWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId
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

    const useGuestAccount = () => {
        try{
            signInWithEmailAndPassword(auth, 'Guest@gmail.com', '123456').then(() => {
            navigate('/home')})
        } catch{
        }
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
                    <div className={styles.signInLink} onClick={useGuestAccount}>
                        <div className={styles.signInButton}>Use Guest Account</div>
                    </div>
                    <Link className={styles.signInLink} to={{pathname: '/login'}}>
                        <div className={styles.signInButton}>Sign In</div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LandingPage;