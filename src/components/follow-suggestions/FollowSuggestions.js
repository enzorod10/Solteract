import { useEffect, useState } from 'react'
import styles from './FollowSuggestions.module.css'
import uniqid from 'uniqid'
import { Link, useNavigate } from 'react-router-dom';

import { initializeApp } from "firebase/app";
import { getFirestore, query, where, collection, doc, getDocs, getDoc, QuerySnapshot } from 'firebase/firestore'
import defaultIcon from './assets/defaultIcon.png'

const firebaseConfig = {
    apiKey: "AIzaSyBMUyuCaT-w1Djk9COvL_uv5hpEWgWbvFU",
    authDomain: "soterak-1f634.firebaseapp.com",
    projectId: "soterak-1f634",
    storageBucket: "soterak-1f634.appspot.com",
    messagingSenderId: "1011495664589",
    appId: "1:1011495664589:web:40d0f06ae1df49bbbea284"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const users = collection(db, 'users')
const q = query(users, where('newUser', '==', false))

const FollowSuggestions = props => {
    const [accountsDisplayed, setAccountsDisplayed] = useState([])
    const [uids, setUids] = useState([])
    const [showMoreMode, setShowMoreMode] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        grabUsers()
    }, [])

    useEffect(() => {
        grabUsers()
    }, [showMoreMode])

    const grabUsers = async () => {
        let uidArray = []
        let randomNumber;
        let repeat;
        const querySnapshot = await getDocs(q)

        if (querySnapshot.docs && showMoreMode && querySnapshot.docs.length < 10){
            repeat = querySnapshot.docs.length
        } else if (querySnapshot.docs && showMoreMode && querySnapshot.docs.length >= 10){
            repeat = 10
        }

        if (!showMoreMode){
            repeat = 3
        }

        if (querySnapshot.docs.length >=3){
            uidArray.push('iJU8GbD9inVVP5agL6ZDr7QNfOd2')
            for (let i=0; i< repeat; i++){
                randomNumber = Math.floor(Math.random() * 15)
                if (typeof querySnapshot.docs[(i + 1) * randomNumber] === 'undefined'){
                    if (querySnapshot.docs[i] && !uidArray.some(item => item === querySnapshot.docs[i].id)){
                        uidArray.push(querySnapshot.docs[i].id)
                    } else {
                        if (querySnapshot.docs[i+1]){
                            uidArray.push(querySnapshot.docs[i+1].id)   
                        }    
                    }
                } else {
                    uidArray.push(querySnapshot.docs[(i + 1) * randomNumber].id)
                }
                if (!showMoreMode && i === 1){
                    break;
                }
            }
            setUids(uidArray)
        }
    }

    useEffect(() => {
        grabAccountsToDisplay()
    }, [uids])

    const grabAccountsToDisplay = async () => {
        const tempArray = [];
        for (let i=0; i<uids.length; i++){
            let userRef = await getDoc(doc(db, 'users', uids[i]))
            tempArray.push(userRef.data())
        }
        setAccountsDisplayed(tempArray)
    }

    const followUser = (value) => {
        props.isLoggedIn ? props.followUser(value.uid) : navigate('/')
    }

    const unfollowUser = (value) => {
        props.isLoggedIn ? props.unfollowUser(value.uid) : navigate('/')
    }

    const handleClick = (username) => {
        navigate('/user/' + username)
        window.location.reload()
    }

    return(
        <div className={styles.outerContainer}>
            <div style={{fontWeight: 'bold'}}className={styles.header}> Who to follow </div>
            <div className={styles.usersContainer}>
                {accountsDisplayed.map(user => {
                    return <div className={styles.user}  key={uniqid()}>
                        {user.profilePicture && <div onClick={() => handleClick(user.username)} className={styles.profilePicture}> <img alt='Profile' src={user.profilePicture}/></div>}
                        <div className={styles.userContent}onClick={() => handleClick(user.username)}> 
                            <div style={{fontWeight: 'bold'}}>
                                {user.name}
                            </div>
                            <div style={{color: '#536471'}}>
                                @{user.username}
                            </div>
                        </div>
                        {props.currentUser && props.currentUser.uid === user.uid ? <div onClick={() => handleClick(user.username)}> Profile</div> :
                        (props.currentUser && props.currentUser.following.some(item => item === user.uid) ?
                        <div onClick={() => unfollowUser(user)}>
                            Unfollow
                        </div>:
                            <div onClick={() => followUser(user)}> Follow</div>)}
                        </div>
                })}
            </div>
            {showMoreMode ? 
            <div onClick={() => setShowMoreMode(false)} style={{textAlign: 'center', cursor: 'pointer'}} >
                Show Less
            </div> : 
            <div onClick={() => setShowMoreMode(true)} style={{textAlign: 'center', cursor: 'pointer'}} >
                Show More
            </div>}
        </div>
    )
}

export default FollowSuggestions;