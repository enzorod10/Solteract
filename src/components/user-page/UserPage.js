import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tweet from "../tweet/Tweet";
import uniqid from 'uniqid'
import Reply from "../reply/Reply";
import styles from './UserPage.module.css'
import NavBar from "../nav-bar/NavBar";
import FollowSuggestions from "../follow-suggestions/FollowSuggestions";
import SetUpProfile from "../set-up-profile/setUpProfile";
import Search from "../search/Search";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersRef = collection(db, 'users')

const UserPage = props => {
    
    const [currentUser, setCurrentUser] = useState('')
    const [reply, setReply] = useState({replyMode: false, tweetObject: {}})
    const [pageOwnership, setPageOwnership] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [currentTab, setCurrentTab] = useState(0)
    
    const location = useLocation();
    const navigate = useNavigate();
    const source = 'home';

    const q = query(usersRef, where('username', '==', location.pathname.substring(6)))

    useEffect(() => {
        grabUser()
        window.scrollTo(0,0);
    }, [])    

    const grabUser = async () => {
        const user = await getDocs(q)
        if (user){
            setCurrentUser(user.docs[0].data())
        }
    }

    useEffect(() => {
        let user = props.auth.currentUser
        if (user){
            currentUser.uid === user.uid ? setPageOwnership(true) : setPageOwnership(false)
        }
    }, [currentUser])

    const handleFollowClick = () => {
        if(props.currentUser === ''){
            navigateToLandingPage()
        } else {
            props.followUser(currentUser.uid)
            grabUser()
        }
    }

    const deleteTweet = value => {
        props.deleteTweet(value)
    }

    const handleUnfollowClick = () => {
        props.unfollowUser(currentUser.uid)
    }

    const action = (value, action, actionBy) => {
        props.submitAction(value, action, actionBy)
    }

    const undoAction = (value, action, actionBy) => {
        props.undoAction(value, action, actionBy)
    }

    const replyToTweet = (value) => {
        setReply({replyMode: true, tweetObject: value})
    }

    const exitReply = () => {
        setReply({replyMode: false})
    }

    const navigateToLandingPage = () => {
        navigate('/')
    }

    const changeEditMode = () => {
        setEditMode(false)
    }
    
    const goBack = () => {
        navigate(-1)
    }

    const handleNavigation = (source) => {
        navigate('/listed-users', {state: {source, currentUser}})
    }

    if (editMode === true){
        return (
            <SetUpProfile source={source} changeEditMode={changeEditMode} notNewUser={props.notNewUser} userNameAvailable={props.userNameAvailable} currentUser={props.currentUser}/>
        )
    } else {
        return(
            <div className={styles.outerContainer}>
                {window.screen.width <= 585 && 
                    <div className={styles.header}>
                        <div className={styles.backButton}onClick={goBack}>
                            {'<'}
                        </div>
                        <div className={styles.nameAndTweetCounter}>
                                {currentUser !== '' && <div style={{fontWeight: 'bold'}}>{currentUser.name}</div>}
                                {currentUser !== '' && (currentUser.tweets.length === 1 ? <div style={{color: '#536471'}}> 1 Transmission </div> : <div style={{color: '#536471'}}> {currentUser.tweets.length} Transmissions </div>)}
                        </div>
                    </div>}
                <NavBar signOut={props.signOut}replyMode={reply.replyMode} currentUser={props.currentUser} isLoggedIn={props.isLoggedIn}/>
                <div style={{opacity: reply.replyMode ? '0.8' : '1', filter: reply.replyMode ? 'brightness(0.5) blur(5px)' : 'brightness(1) blur(0px)'}} className={styles.mainSection}>
                    {window.screen.width > 585 && 
                    <div className={styles.header}>
                        <div className={styles.backButton}onClick={goBack}>
                            {'<'}
                        </div>
                        <div className={styles.nameAndTweetCounter}>
                                {currentUser !== '' && <div style={{fontWeight: 'bold'}}>{currentUser.name}</div>}
                                {currentUser !== '' && (currentUser.tweets.length === 1 ? <div style={{color: '#536471'}}> 1 Transmission </div> : <div style={{color: '#536471'}}> {currentUser.tweets.length} Transmissions </div>)}
                        </div>
                    </div>}
                    <div className={styles.headerPicture}>
                        <img alt='header' src={currentUser.profileHeader && currentUser.profileHeader} />
                    </div>
                    <div className={styles.profilePicture}>
                        <img alt='Profile' src={currentUser.profilePicture && currentUser.profilePicture}/>
                    </div>
                    <div className={styles.userContainer}>
                        {pageOwnership ? 
                            <div onClick={() => setEditMode(true)} className={styles.editProfile} style={{position: 'absolute', top: -46, right: 10}}>
                                Edit Profile
                            </div> :
                            <div className={styles.followButton} style={{position: 'absolute', top: -46, right: 10 }}>
                                {props.currentUser !== '' && props.currentUser.following && props.currentUser.following.some(user => user === currentUser.uid) ?
                                <div onClick={() => handleUnfollowClick()}> Unfollow</div> :
                                <div onClick={() => handleFollowClick()}>Follow</div>}
                            </div>
                        } 
                        <div className={styles.nameAndUsername}>
                            <div style={{fontWeight: 'bold'}} className={styles.name}>
                                {currentUser.name}
                            </div>
                            <div style={{color: '#536471'}} className={styles.userName}>
                                @{currentUser.username}
                            </div>
                        </div>
                        {currentUser.description !== '' &&
                        <div className={styles.description}>
                            {currentUser.description}
                        </div> }
                        <div style={{color: '#536471'}}className={styles.joinDate}>
                            Joined {currentUser.joinDate}
                        </div>
                        <div className={styles.stats}>
                            <div onClick={() => handleNavigation('following')}>
                                <span style={{fontWeight: 'bold'}}>{currentUser && currentUser.following.length}</span> <span style={{color: '#536471'}}>Following</span>
                            </div>
                            <div onClick={() => handleNavigation('followers')}>
                                <span style={{fontWeight: 'bold'}}>{currentUser && currentUser.followers.length}</span> <span style={{color: '#536471'}}>Followers</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.userNav}>
                        <div className={styles.transmissionsTab} onClick={() => setCurrentTab(0)}>
                            <div style={{fontWeight: currentTab === 0 ? 'bold' : 'normal'}}> Transmissions </div> <div style={{display: currentTab === 0 ? 'flex' : 'none'}}></div>
                        </div>
                        <div className={styles.mediaTab} onClick={() => setCurrentTab(1)}>
                            <div style={{fontWeight: currentTab === 1 ? 'bold' : 'normal'}}> Media </div> <div style={{display: currentTab === 1 ? 'flex' : 'none'}}></div>
                        </div>
                        <div className={styles.favoritesTab} onClick={() => setCurrentTab(2)}>
                            <div style={{fontWeight: currentTab === 2 ? 'bold' : 'normal'}}> Favorites</div> <div style={{display: currentTab === 2 ? 'flex' : 'none'}}></div>
                        </div>
                    </div>
                    {currentTab === 0 &&
                    <div className={styles.feed}>
                        {currentUser.feed && currentUser.feed.map(tweetObject => {
                            return <Tweet fromUser={true} findRetweeter={props.findRetweeter} key={uniqid()} action={action} undoAction={undoAction} replyToTweet={replyToTweet} currentUser={props.currentUser} userPageCurrentUser={currentUser} deleteTweet={deleteTweet} tweetObject={tweetObject}/>
                        })}
                    </div>}
                    {currentTab === 1 &&
                    <div className={styles.feed}>
                        {currentUser.feed && currentUser.feed.filter(item => item.media && item.media !== '').map(tweetObject => {
                            return <Tweet fromUser={true} findRetweeter={props.findRetweeter} key={uniqid()} action={action} undoAction={undoAction} replyToTweet={replyToTweet} currentUser={props.currentUser} userPageCurrentUser={currentUser} deleteTweet={deleteTweet} tweetObject={tweetObject}/>
                        })}
                    </div>}
                    {currentTab === 2 &&
                    <div className={styles.feed}>
                        {currentUser.favoritesFeed && currentUser.favoritesFeed.reverse().map(tweetObject => {
                            return <Tweet fromUser={true} findRetweeter={props.findRetweeter} key={uniqid()} action={action} undoAction={undoAction} replyToTweet={replyToTweet} currentUser={props.currentUser} userPageCurrentUser={currentUser} deleteTweet={deleteTweet} tweetObject={tweetObject} />
                        })}
                    </div>}
                </div>
                <div style={{opacity: reply.replyMode ? '0.8' : '1', filter: reply.replyMode ? 'brightness(0.5) blur(5px)' : 'brightness(1) blur(0px)'}} className={styles.exploreSection}>
                    <Search db={props.db} fromUser={true} />
                    <FollowSuggestions currentUser={props.currentUser} followUser={props.followUser} unfollowUser={props.unfollowUser} isLoggedIn={props.isLoggedIn}/>
                </div>
                {props.currentUser !== '' && <Reply submitReply={props.submitReply} reply={reply} exitReply={exitReply} currentUser={props.currentUser}/>}
            </div>
        )
    }
}

export default UserPage;