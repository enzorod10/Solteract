import { useEffect, useState } from 'react'
import styles from './Tweet.module.css'
import { useLocation, useNavigate } from 'react-router-dom'
import replyIcon from '../assets/actions/reply.png'
import shareIcon from '../assets/actions/share.png'
import ellipsis from './assets/ellipsis.png'
import trashIcon from './assets/trash.png'
import cancelIcon from './assets/cancel.png'

const Tweet = props => {
    const [replyMode, setReplyMode] = useState(false)
    const [tweetOwnership, setTweetOwnership] = useState(false)
    const [retweetStatus, setRetweetStatus] = useState(false)
    const [comingFrom, setComingFrom] = useState('')
    const [userRetweeted, setUserRetweeted] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [retweeter, setRetweeter] = useState('')

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (props.replyMode){
            setReplyMode(true)
        } else {
            props.currentUser.uid === props.tweetObject.originalOwner ? setTweetOwnership(true) : setTweetOwnership(false)
            if (props.userPageCurrentUser){
                setComingFrom('userPage')
            } else {
                setComingFrom('homePage')
            }
        }
    }, [])

    useEffect(() => {
        if (comingFrom === 'userPage'){
            if (props.tweetObject.isARetweet){
                setRetweetStatus(true)
                if (props.currentUser.uid === props.userPageCurrentUser.uid){
                    setUserRetweeted(true)
                }
            }
        } else if (comingFrom === 'homePage'){
            if (props.tweetObject.isARetweet && props.tweetObject.responsible === props.currentUser.uid){
                setRetweetStatus(true)
                setUserRetweeted(true)
            } else if (props.tweetObject.isARetweet && props.tweetObject.originalOwner !== props.currentUser.uid){
                setRetweetStatus(true)
            }
        }
    }, [comingFrom])

    useEffect(() => {
        if (comingFrom !== 'homepage'){
            if (userRetweeted === false && typeof props.tweetObject.responsible !== 'undefined'){
                let retweeterPromise = Promise.resolve(props.findRetweeter(props.tweetObject.responsible))
                retweeterPromise.then(result => setRetweeter(result))
            }
        }
        
    }, [retweetStatus])


    const reply = (tweet) => {
        if (props.currentUser !== ''){
            props.replyToTweet(tweet)
        } else {
            navigate('/')
        }
    }

    const action = (value, action, actionBy) => {
        if (props.currentUser !== ''){
            props.action(value, action, actionBy)
        } else {
            navigate('/')
        }
    }

    const undoAction = (value, action, actionBy) => {
        if (props.currentUser !== ''){
            props.undoAction(value, action, actionBy)
        } else {
            navigate('/')
        }
    }

    const editTweet = value => {
        !editMode && setEditMode(true)
    }

    const deleteTweet = value => {
        if (props.currentUser !== ''){
            props.deleteTweet(value)
            if(location.pathname !== ('/home' || '/user/' + props.currentUser.uid)){
                navigate('/home')
            }
        } else {
            navigate('/')
        }
    }

    const removeEditMode = () => {
        editMode && setEditMode(false)
    }

    const handleNavigate = () => {
        if(!props.noContainer){
            navigate('/' + props.tweetObject.originalOwner + '/status/' + props.tweetObject.tweetId)
        }
    }

    const handleUserNavigate = value => {
        if (props.fromUser){
            navigate('/user/' + value)
            window.location.reload()
        } else {
            navigate('/user/' + value)
        }
    }

    return(
        <div className={styles.outerContainer}>
            {retweetStatus && 
            <div style={{color: '#536471'}}onClick={handleNavigate} className={styles.retweetInfoContainer}>
                <div>
                    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	                viewBox="0 0 297 297" style={{height: '18px', width: '18px', fill: '#536471'}} xmlSpace="preserve">
                    <g>
                    <path d="M166.264,259C166.267,259,166.262,259,166.264,259c24.646,0,50.552-6.369,71.899-18.432
                        c2.737-1.547,4.594-4.283,5.019-7.398c0.425-3.115-0.631-6.25-2.855-8.473l-66.434-66.443c9.732-13.521,8.528-32.537-3.625-44.694
                        c-12.152-12.152-31.166-13.356-44.686-3.623L59.151,43.495c-2.223-2.224-5.358-3.279-8.474-2.854
                        c-3.115,0.425-5.854,2.282-7.399,5.02c-28.422,50.313-23.286,112.725,11.358,157.69l-40.393,79.091
                        c-1.559,3.118-1.392,6.822,0.441,9.788c1.833,2.966,5.071,4.771,8.558,4.771h132.963c5.556,0,10.06-4.504,10.06-10.06V259z
                        M156.04,127.786c4.256,4.256,5.307,10.52,3.157,15.77l-18.919-18.923C145.527,122.482,151.788,123.532,156.04,127.786z
                        M146.145,276.88H39.518l29.003-58.015c21.534,20.814,48.478,34.097,77.624,38.509V276.88z M167.859,238.887
                        c-0.002,0-0.006,0-0.008,0c-32.827-0.002-63.688-12.786-86.896-35.997c-35.689-35.695-45.609-89.648-26.126-135.261
                        l161.364,161.385C200.996,235.501,184.521,238.887,167.859,238.887z"/>
                    <path d="M153.607,73.852c31.08,0,56.366,25.289,56.367,56.375c0,5.556,4.505,10.06,10.06,10.06c5.557,0,10.061-4.505,10.061-10.06
                        c-0.001-42.18-34.313-76.495-76.487-76.495c-5.556,0-10.059,4.504-10.059,10.06C143.548,69.347,148.052,73.852,153.607,73.852z"/>
                    <path d="M153.607,0c-5.556,0-10.059,4.504-10.059,10.06c0,5.556,4.503,10.061,10.059,10.061
                        c60.704,0.001,110.091,49.394,110.091,110.106c0,5.555,4.504,10.06,10.06,10.06c5.556,0,10.061-4.505,10.061-10.06
                        C283.818,58.42,225.405,0.001,153.607,0z"/></g>
                    </svg>
                </div>
                {userRetweeted ? <div>You Retransmitted</div> : <div> {retweeter && retweeter.name} Retweeted</div>}
            </div>
            }
            <div style={{border: replyMode && 'none'}} className={styles.normalTweetContainer}>
                <div className={styles.profilePictureContainer}>
                    <img onClick={() => handleUserNavigate(props.tweetObject.originalOwnerUsername)} alt='User' src={props.tweetObject && props.tweetObject.originalOwnerProfilePicture && props.tweetObject.originalOwnerProfilePicture}/>
                </div>
                <div className={styles.tweetContent}>
                    <div className={styles.innerContainer}>
                        <div className={styles.tweetHeader}>
                            <div style={{width: window.screen.width <= 585 && (!tweetOwnership ? window.screen.width - 75 : window.screen.width - 110), overflow: 'auto'}}className={styles.userInfo}>
                                <div style={{ whiteSpace: 'nowrap'}} className={styles.name} onClick={() => handleUserNavigate(props.tweetObject.originalOwnerUsername)}>{props.tweetObject && props.tweetObject.originalOwnerName}</div>
                                <div style={{ whiteSpace: 'nowrap'}} className={styles.username} onClick={() => handleUserNavigate(props.tweetObject.originalOwnerUsername)}>@{props.tweetObject && props.tweetObject.originalOwnerUsername}</div>
                                <div style={{ whiteSpace: 'nowrap'}} className={styles.date} onClick={handleNavigate}>{props.tweetObject && props.tweetObject.humanDate}</div>
                            </div>
                        </div>                                                                                      
                        <div className={styles.tweetBody} onClick={handleNavigate}>{props.tweetObject && props.tweetObject.tweet}</div>
                    </div>
                    {props.tweetObject && props.tweetObject.media &&
                    <div onClick={handleNavigate} style={{cursor: 'pointer'}} className={styles.mediaContainer}>
                        <img style={{maxHeight: '600px'}}alt='tweet media' src={props.tweetObject && props.tweetObject.media}/>
                    </div>}
                    {!props.noContainer &&
                    <div style={{display: replyMode ? 'none' : 'flex' }} className={styles.interactionContainer}>
                        <div style={{display: props.disallowReply ? 'none' : 'flex'}} onClick={() => reply(props.tweetObject)}>
                            <img style={{height: '20px', width:'20px'}} alt='reply icon' src={replyIcon} />
                            {props.tweetObject && props.tweetObject.replies > 0 &&
                            <span style={{position: 'absolute', left: '32px', fontSize: '15px'}}className={styles.counter}>{props.tweetObject.replies.length}</span>}
                        </div>
                        {!replyMode && props.currentUser.retweets && props.currentUser.retweets.some(elem => elem.tweetId === props.tweetObject.tweetId) ? 
                        <div onClick={() => undoAction(props.tweetObject, 'retweets', 'retweetedBy')}>
                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 297 297" style={{height: '20px', width: '20px', fill: 'rgba(0, 128, 0, 0.7)'}} xmlSpace="preserve">
                            <g>
                            <path d="M166.264,259C166.267,259,166.262,259,166.264,259c24.646,0,50.552-6.369,71.899-18.432
                                c2.737-1.547,4.594-4.283,5.019-7.398c0.425-3.115-0.631-6.25-2.855-8.473l-66.434-66.443c9.732-13.521,8.528-32.537-3.625-44.694
                                c-12.152-12.152-31.166-13.356-44.686-3.623L59.151,43.495c-2.223-2.224-5.358-3.279-8.474-2.854
                                c-3.115,0.425-5.854,2.282-7.399,5.02c-28.422,50.313-23.286,112.725,11.358,157.69l-40.393,79.091
                                c-1.559,3.118-1.392,6.822,0.441,9.788c1.833,2.966,5.071,4.771,8.558,4.771h132.963c5.556,0,10.06-4.504,10.06-10.06V259z
                                M156.04,127.786c4.256,4.256,5.307,10.52,3.157,15.77l-18.919-18.923C145.527,122.482,151.788,123.532,156.04,127.786z
                                M146.145,276.88H39.518l29.003-58.015c21.534,20.814,48.478,34.097,77.624,38.509V276.88z M167.859,238.887
                                c-0.002,0-0.006,0-0.008,0c-32.827-0.002-63.688-12.786-86.896-35.997c-35.689-35.695-45.609-89.648-26.126-135.261
                                l161.364,161.385C200.996,235.501,184.521,238.887,167.859,238.887z"/>
                            <path d="M153.607,73.852c31.08,0,56.366,25.289,56.367,56.375c0,5.556,4.505,10.06,10.06,10.06c5.557,0,10.061-4.505,10.061-10.06
                                c-0.001-42.18-34.313-76.495-76.487-76.495c-5.556,0-10.059,4.504-10.059,10.06C143.548,69.347,148.052,73.852,153.607,73.852z"/>
                            <path d="M153.607,0c-5.556,0-10.059,4.504-10.059,10.06c0,5.556,4.503,10.061,10.059,10.061
                                c60.704,0.001,110.091,49.394,110.091,110.106c0,5.555,4.504,10.06,10.06,10.06c5.556,0,10.061-4.505,10.061-10.06
                                C283.818,58.42,225.405,0.001,153.607,0z"/></g>
                            </svg>
                            {props.tweetObject && props.tweetObject.amountOfRetweets > 0 &&
                            <span style={{position: 'absolute', left: '32px', fontSize: '15px', color: '#536471'}}className={styles.counter}>{props.tweetObject && props.tweetObject.amountOfRetweets}</span>}
                        </div>:
                        <div onClick={() => action(props.tweetObject, 'retweets', 'retweetedBy')}>
                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 297 297" style={{height: '20px', width: '20px'}} xmlSpace="preserve">
                            <g>
                            <path d="M166.264,259C166.267,259,166.262,259,166.264,259c24.646,0,50.552-6.369,71.899-18.432
                                c2.737-1.547,4.594-4.283,5.019-7.398c0.425-3.115-0.631-6.25-2.855-8.473l-66.434-66.443c9.732-13.521,8.528-32.537-3.625-44.694
                                c-12.152-12.152-31.166-13.356-44.686-3.623L59.151,43.495c-2.223-2.224-5.358-3.279-8.474-2.854
                                c-3.115,0.425-5.854,2.282-7.399,5.02c-28.422,50.313-23.286,112.725,11.358,157.69l-40.393,79.091
                                c-1.559,3.118-1.392,6.822,0.441,9.788c1.833,2.966,5.071,4.771,8.558,4.771h132.963c5.556,0,10.06-4.504,10.06-10.06V259z
                                M156.04,127.786c4.256,4.256,5.307,10.52,3.157,15.77l-18.919-18.923C145.527,122.482,151.788,123.532,156.04,127.786z
                                M146.145,276.88H39.518l29.003-58.015c21.534,20.814,48.478,34.097,77.624,38.509V276.88z M167.859,238.887
                                c-0.002,0-0.006,0-0.008,0c-32.827-0.002-63.688-12.786-86.896-35.997c-35.689-35.695-45.609-89.648-26.126-135.261
                                l161.364,161.385C200.996,235.501,184.521,238.887,167.859,238.887z"/>
                            <path d="M153.607,73.852c31.08,0,56.366,25.289,56.367,56.375c0,5.556,4.505,10.06,10.06,10.06c5.557,0,10.061-4.505,10.061-10.06
                                c-0.001-42.18-34.313-76.495-76.487-76.495c-5.556,0-10.059,4.504-10.059,10.06C143.548,69.347,148.052,73.852,153.607,73.852z"/>
                            <path d="M153.607,0c-5.556,0-10.059,4.504-10.059,10.06c0,5.556,4.503,10.061,10.059,10.061
                                c60.704,0.001,110.091,49.394,110.091,110.106c0,5.555,4.504,10.06,10.06,10.06c5.556,0,10.061-4.505,10.061-10.06
                                C283.818,58.42,225.405,0.001,153.607,0z"/></g>
                            </svg> 
                            {props.tweetObject && props.tweetObject.amountOfRetweets > 0 &&
                            <span style={{position: 'absolute', left: '32px', fontSize: '15px', color: '#536471'}}className={styles.counter}>{props.tweetObject.amountOfRetweets}</span>}
                        </div>}

                        {props.tweetObject && props.currentUser.favorites && props.currentUser.favorites.some(elem => elem.tweetId === props.tweetObject.tweetId) ?
                        <div onClick={() => undoAction(props.tweetObject, 'favorites', 'favoritedBy')}>
                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	                        viewBox="0 0 32 32" style={{height: '20px', width: '20px'}} xmlSpace="preserve">
                            <g>
                                <g id="heart_x5F_fill">
                                    <g>
                                        <g>
                            <path style={{fill: 'rgba(128, 0, 0, 0.7)'}} d="M16,5.844C14.387,3.578,11.871,2,8.887,2C3.984,2,0,5.992,0,10.891v0.734L16.008,30L32,11.625
                                v-0.734C32,5.992,28.016,2,23.113,2C20.129,2,17.613,3.578,16,5.844z"/>
                                        </g>
                                    </g>
                                </g>
                            </g>
                            </svg>
                            {props.tweetObject && props.tweetObject.amountOfFavorites > 0 &&
                            <span style={{position: 'absolute', left: '32px', fontSize: '15px', color: '#536471'}}className={styles.counter}>{props.tweetObject.amountOfFavorites}</span>}
                        </div>:
                        <div onClick={() => action(props.tweetObject, 'favorites', 'favoritedBy')}>
                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 490.4 490.4" style={{height: '20px', width: '20px'}} xmlSpace="preserve">
                            <g>
                            <g>
                                <path d="M222.5,453.7c6.1,6.1,14.3,9.5,22.9,9.5c8.5,0,16.9-3.5,22.9-9.5L448,274c27.3-27.3,42.3-63.6,42.4-102.1
                                    c0-38.6-15-74.9-42.3-102.2S384.6,27.4,346,27.4c-37.9,0-73.6,14.5-100.7,40.9c-27.2-26.5-63-41.1-101-41.1
                                    c-38.5,0-74.7,15-102,42.2C15,96.7,0,133,0,171.6c0,38.5,15.1,74.8,42.4,102.1L222.5,453.7z M59.7,86.8
                                    c22.6-22.6,52.7-35.1,84.7-35.1s62.2,12.5,84.9,35.2l7.4,7.4c2.3,2.3,5.4,3.6,8.7,3.6l0,0c3.2,0,6.4-1.3,8.7-3.6l7.2-7.2
                                    c22.7-22.7,52.8-35.2,84.9-35.2c32,0,62.1,12.5,84.7,35.1c22.7,22.7,35.1,52.8,35.1,84.8s-12.5,62.1-35.2,84.8L251,436.4
                                    c-2.9,2.9-8.2,2.9-11.2,0l-180-180c-22.7-22.7-35.2-52.8-35.2-84.8C24.6,139.6,37.1,109.5,59.7,86.8z"/>
                            </g>
                            </g>
                            </svg>
                            {props.tweetObject && props.tweetObject.amountOfFavorites > 0 && 
                            <span style={{position: 'absolute', left: '32px', fontSize: '15px', color: '#536471'}}className={styles.counter}>{props.tweetObject.amountOfFavorites}</span>}
                        </div>}

                        <div>
                            <img style={{height: '20px', width: '20px'}} alt='share icon' src={shareIcon}/>
                        </div>
                    </div>}
                    {props.tweetObject && !props.noContainer && props.disallowReply && (<div className={styles.favoritesAndRetweets}> {props.tweetObject.retweetedBy.length > 0 && <div onClick={() => navigate('/listed-users', {state: {source: 'retweets', user: props.tweetObject.originalOwner, tweet: props.tweetObject.tweetId}})}><span style={{fontWeight: 'bold'}}>{props.tweetObject.retweetedBy.length}</span> {props.tweetObject.retweetedBy.length > 1 ? <span style={{color: '#536471'}}>Retransmissions</span> : <span style={{color: '#536471'}}>Retransmission</span>}</div>} {props.tweetObject.favoritedBy.length > 0 && <div onClick={() => navigate('/listed-users', {state: {source: 'favorites', user: props.tweetObject.originalOwner, tweet: props.tweetObject.tweetId}})}><span style={{fontWeight: 'bold'}}>{props.tweetObject.favoritedBy.length} </span> {props.tweetObject.favoritedBy.length > 1 ? <span style={{color: '#536471'}}>Favorites</span> : <span style={{color: '#536471'}}>Favorite</span>}</div>}</div>)}
                </div>
                {tweetOwnership && !props.noContainer &&
                <div className={styles.editTweetButton} style={{zIndex: 1, display: replyMode ? 'none' : 'flex'}} onClick={editTweet}>
                    <img style={{width: '15px'}}alt='ellipsis button' src={ellipsis} />
                    <div style={{display: editMode ? 'flex' : 'none', position: 'absolute', top: 0, right: 0, flexDirection: 'column'}} className={styles.editTweetContainer}>
                        <div onClick={() => deleteTweet(props.tweetObject)}>
                            <img alt='delete button' src={trashIcon}/>Delete
                        </div>
                        <div onClick={removeEditMode}> 
                            <img alt='cancel button' src={cancelIcon}/>Cancel 
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default Tweet;