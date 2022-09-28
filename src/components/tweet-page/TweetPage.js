import { getDoc, doc } from "firebase/firestore";
import styles from './TweetPage.module.css'
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import NavBar from "../nav-bar/NavBar";
import Search from "../search/Search";
import FollowSuggestions from "../follow-suggestions/FollowSuggestions";
import Tweet from '../tweet/Tweet.js'
import uniqid from 'uniqid'

const TweetPage = props => {
    const [tweet, setTweet] = useState('')
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        grabLink()
    }, [])

    useEffect(() => {
        if (typeof tweet === 'undefined'){
            navigate('/home')
        }
    }, [tweet])

    const grabLink = async () => {
        let split = location.pathname.split('/')
        let user = await getDoc(doc(props.db, 'users', split[1]))
        let foundTweet = user.data().tweets.filter(item => item.tweetId === split[3])
        setTweet(foundTweet[0])
    }

    return (
        <div className={styles.outerContainer}>
                {window.screen.width <= 585 && 
                <div className={styles.header}>
                    <span style={{fontSize: '25px'}} onClick={() => navigate(-1)}>{'<'}</span> <span>Transmission</span>
                </div>}

                <NavBar signOut={props.signOut} currentUser={props.currentUser} isLoggedIn={props.isLoggedIn}/>

            <div className={styles.mainSection}>
                {window.screen.width > 585 &&
                <div className={styles.header}>
                    <span style={{fontSize: '25px'}} onClick={() => navigate(-1)}>{'<'}</span> <span>Transmission</span>
                </div>}
                <Tweet disallowReply={true} deleteTweet={props.deleteTweet} action={props.submitAction} undoAction={props.undoAction} replyToTweet={props.submitReply}currentUser={props.currentUser} tweetObject={tweet}/>
                {typeof tweet.replies !== 'undefined' && tweet.replies.length > 0 && 
                <div style={{display: "flex", justifyContent: "center", padding: '10px 0px', borderBottom: '1px rgba(165, 163, 163, 0.404) dashed'}}>
                    Replies
                </div>}
                <div className={styles.repliesContainer}>
                    {typeof tweet.replies !== 'undefined' && tweet.replies.reverse().map(reply => {
                        return <Tweet key={uniqid()} noContainer={true} disallowReply={true} deleteTweet={props.deleteTweet} action={props.submitAction} undoAction={props.undoAction} replyToTweet={props.submitReply} currentUser={props.currentUser} tweetObject={reply}/>
                    })}
                </div>
            </div>
            <div className={styles.exploreSection}>
                <Search db={props.db}/>
                <FollowSuggestions currentUser={props.currentUser} followUser={props.followUser} unfollowUser={props.unfollowUser} isLoggedIn={props.isLoggedIn}/>
            </div>
            
        </div>
    )
}

export default TweetPage