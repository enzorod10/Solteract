import styles from './Home.module.css'
import { useState, useEffect } from 'react'
import uniqid from 'uniqid'
import FollowSuggestions from '../follow-suggestions/FollowSuggestions'
import Tweet from '../tweet/Tweet'
import Reply from '../reply/Reply'
import NavBar from '../nav-bar/NavBar'
import Textarea from 'react-expanding-textarea'
import SetUpProfile from '../set-up-profile/setUpProfile'
import Search from '../search/Search'
import uploadIcon from './assets/uploadIcon.png'

const Home = props => {
    const [tweet, setTweet] = useState({text: '', media: ''})
    const [reply, setReply] = useState({replyMode: false, tweetObject: {}})

    useEffect(() => {
        props.grabTimeline('follow')
        window.scrollTo(0,0);
    }, [])

    const updateTweet = (value) => {
        setTweet({...tweet, text: value})
    }

    const action = (value, action, actionBy) => {
        props.submitAction(value, action, actionBy)
        document.querySelector('#fileInput').value = ''
        document.querySelector('.textareaInput').value = ''
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

    const deleteTweet = (value) => {
        props.deleteTweet(value)
    }

    const uploadFile = async e => {
        setTweet({...tweet, media: URL.createObjectURL(e.target.files[0])})
    }

    const submitTweet = async value => {
        props.submitTweet(value)
        setTweet({text: '', media: ''})
        document.querySelector('.textareaInput').value = ''
        document.querySelector('.textareaInput').style = {height: '10px'}
    }

    if (props.currentUser.newUser){
        return( 
            <div className={styles.outerContainer}>
                <SetUpProfile notNewUser={props.notNewUser} userNameAvailable={props.userNameAvailable} currentUser={props.currentUser}/>
            </div>
        )
    } else {
        return(
            <div className={styles.outerContainer}>
                {window.screen.width <= 585 && 
                <div className={styles.mainSectionHeader}>Home</div>}
               
                <NavBar signOut={props.signOut}replyMode={reply.replyMode} currentUser={props.currentUser} isLoggedIn={props.isLoggedIn}/>

                <div className={styles.mainSection} style={{opacity: reply.replyMode ? '0.8' : '1', filter: reply.replyMode ? 'brightness(0.5) blur(20px)' : 'brightness(1) blur(0px)'}}>
                    {window.screen.width > 585 && 
                    <div className={styles.mainSectionHeader}>Home</div>}
                    <div className={styles.inputTweetContainer}>
                        <div className={styles.profilePictureContainer}>
                            <img alt='User' src={props.currentUser.profilePicture && props.currentUser.profilePicture}/>
                        </div>
                        <div className={styles.tweetContent}>
                            <div className={styles.textAndMediaContainer}>
                                <Textarea maxLength='270' className={'textareaInput'} onChange={e => updateTweet(e.target.value)} placeholder={`What's happening?`}/>
                                {!!tweet.media && tweet.media !== '' && <div className={styles.media}> <img style={{maxHeight: '600px'}}alt='media displayed' src={tweet.media}/></div>}
                            </div>
                            <div className={styles.inputTweetNav}>
                                <div className={styles.mediaContainer}>
                                    <div className={styles.uploadMedia}>
                                        <input type='file' id='fileInput' onChange={e => uploadFile(e)} style={{display: 'none'}}></input>
                                        <label htmlFor='fileInput'>
                                            <img className={styles.uploadButton} style={{height: '26px'}} src={uploadIcon} alt='upload button' />
                                        </label>
                                    </div>
                                </div>
                                <div className={styles.tweetButton} onClick={() => submitTweet(tweet)}> Transmit </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.timeline}>
                        {props.currentUser.timeline && props.currentUser.timeline.map(item => {
                            return <Tweet storage={props.storage} findRetweeter={props.findRetweeter} tweetObject={item} deleteTweet={deleteTweet} action={action} undoAction={undoAction} currentUser={props.currentUser} replyToTweet={replyToTweet} key={uniqid()} />
                        })}
                        </div>
                </div>
                <div className={styles.exploreSection} style={{opacity: reply.replyMode ? '0.8' : '1', filter: reply.replyMode ? 'brightness(0.5) blur(20px)' : 'brightness(1) blur(0px)'}}>
                    <Search db={props.db}/>
                    <FollowSuggestions currentUser={props.currentUser} followUser={props.followUser} isLoggedIn={props.isLoggedIn} unfollowUser={props.unfollowUser}/>
                </div>
                <Reply submitReply={props.submitReply} currentUser={props.currentUser} exitReply={exitReply} reply={reply}/>
            </div>
        )
    }
}

export default Home;