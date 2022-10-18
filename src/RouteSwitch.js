/* eslint-disable */

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LandingPage from './components/landing-page/LandingPage.js'
import Signup from './components/signup/Signup'
import Login from './components/login/Login'
import Home from './components/home/Home.js'
import UserPage from './components/user-page/UserPage.js'
import TweetPage from './components/tweet-page/TweetPage.js'
import SearchPage from './components/search-page/SearchPage.js'
import ListedUsers from './components/listed-users/ListedUsers.js'
import ProtectedRoutes from './ProtectedRoutes.js'
import uniqid from 'uniqid'
import dayjs from 'dayjs'

import { initializeApp } from "firebase/app";
import { getFirestore, updateDoc, collection, doc, arrayUnion, getDoc, setDoc, arrayRemove, query, where, getDocs } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { onAuthStateChanged, getAuth } from 'firebase/auth'

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
const auth = getAuth();
const storage = getStorage(app);

function RouteSwitch(){

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [currentUser, setCurrentUser] = useState('')

    useEffect(() => {
        const listener = onAuthStateChanged(auth, user => {
            if (user){
                setIsLoggedIn(true)
                updateUser()
            }
            else{
                setIsLoggedIn(false)
            }
        })
    }, [])

    const updateUser = async () => {
        const user = auth.currentUser;
        if (user){
            const userDoc = await getDoc(doc(db, 'users', user.uid))
            if(userDoc.exists()){
                setCurrentUser(userDoc.data())
            } else {
                if(user.providerData[0].providerId === 'google.com'){
                    addToUserCollection(user.displayName.split(' ')[0])
                }
            }
        }
    }

    const uploadTweetMedia = async (value, id) => {
        const media = await fetch(value) 
        const mediaImg = await media.blob() 

        const mediaRef = ref(storage, `${currentUser.uid}/${id}`)

        const uploadMedia = await uploadBytes(mediaRef, mediaImg)

        const mediaLink = await getDownloadURL(mediaRef)

        return mediaLink
    }

    const submitTweet = async value => {
        const tweet = {
            tweet: value.text,
            originalOwner: currentUser.uid,
            originalOwnerName: currentUser.name,
            originalOwnerUsername: currentUser.username,
            originalOwnerProfilePicture: currentUser.profilePicture,
            tweetId: uniqid(),
            amountOfFavorites: 0,
            amountOfRetweets: 0,
            favoritedBy: [],
            retweetedBy: [],
            replies: [],
            date: new Date().getTime(),
            humanDate: dayjs().format('MMMM D, YYYY'),
            maxNumberOfReplyChains: 0 
        }

        if (value.media !== ''){
            tweet.media = await uploadTweetMedia(value.media, tweet.tweetId)
        }

        const updatedUser = await updateDoc(doc(db, 'users', currentUser.uid), {
            tweets: arrayUnion(tweet)
        })
        grabTimeline('tweet')
    }

    const deleteTweet = async (value) => {
        const updatedUser = await getDoc(doc(db, 'users', currentUser.uid))

        const indexOfTweet = updatedUser.data().tweets.findIndex(elem => elem.tweetId === value.tweetId)

        if (updatedUser.data().tweets[indexOfTweet].replies && updatedUser.data().tweets[indexOfTweet].replies.length > 0){
            updatedUser.data().tweets[indexOfTweet].replies.forEach(async item => {
                let user = await getDoc(doc(db, 'users', currentUser.uid))
                let newReplies = user.data().replies.filter(reply => {
                    return reply.replyTo !== value.tweetId
                })
                let update = updateDoc(doc(db, 'users', item.originalOwner), {
                    replies: newReplies
                })
            })
        }

        updatedUser.data().tweets[indexOfTweet].retweetedBy.forEach(async user => {
            const userRef = await updateDoc(doc(db, 'users', user), {
                retweets: arrayRemove({originalOwner: value.originalOwner, tweetId: value.tweetId})
            })
        })

        updatedUser.data().tweets[indexOfTweet].favoritedBy.forEach(async user => {
            const userReference = await getDoc(doc(db, 'users', user))
            const newArray = userReference.data().favoritesFeed.filter(item => item.tweetId !== value.tweetId)
            
            const userRef = await updateDoc(doc(db, 'users', user), {
                favorites: arrayRemove({originalOwner: value.originalOwner, tweetId: value.tweetId}),
                favoritesFeed: newArray
            })
        })


        const newTweets = await updateDoc(doc(db, 'users', currentUser.uid), {
            tweets: updatedUser.data().tweets.filter(elem => elem.tweetId !== value.tweetId)
        })
        grabTimeline('undoTweet', value)

        if (value.media && value.media !== ''){
            const mediaRef = ref(storage, `${currentUser.uid}/${value.tweetId}`)
            deleteObject(mediaRef).then(() => {}).catch((err) => {})
        }
    }

    const submitReply = async (tweetId, recipient, value) => {
        
        const replies = {
            tweet: value.text,
            originalOwner: currentUser.uid,
            originalOwnerName: currentUser.name,
            originalOwnerUsername: currentUser.username,
            originalOwnerProfilePicture: currentUser.profilePicture,
            tweetId: uniqid(),
            date: new Date().toUTCString(),
            humanDate: dayjs().format('MMMM D, YYYY'),
            amountOfFavorites: 0,
            amountOfRetweets: 0,
            replyTo: tweetId,
            chainPosition: 0,
        }

        if (value.media !== ''){
            replies.media = await uploadTweetMedia(value.media, replies.tweetId)
        }

        const updatedUser = await updateDoc(doc(db, 'users', currentUser.uid), {
            replies: arrayUnion(replies)
        })

        const recipientRef = await getDoc(doc(db, 'users', recipient))
        const found = recipientRef.data().tweets.find(elem => elem.tweetId === tweetId)
        const indexOfFound = recipientRef.data().tweets.findIndex(elem => elem.tweetId === tweetId)
        if (typeof found.replies === 'undefined'){
            found.replies = []
        }
        found.replies.unshift(replies)
        const tempArray = recipientRef.data().tweets
        tempArray[indexOfFound] = found
        const updatedRecepient = await setDoc(doc(db, 'users', recipient), {
            ...recipientRef.data(),
            tweets: tempArray
        })
        updateUser()
    }

    const deleteReply = async () => {
        // Must do
    }

    const submitAction = async(value, action, actionBy) => {
        const updatedUser = await updateDoc(doc(db, 'users', currentUser.uid), {
            [action]: arrayUnion({tweetId: value.tweetId, originalOwner: value.originalOwner})
        })

        const recipientRef = await getDoc(doc(db, 'users', value.originalOwner))

        const found = recipientRef.data().tweets.find(elem => elem.tweetId === value.tweetId)
        const indexOfFound = recipientRef.data().tweets.findIndex(elem => elem.tweetId === value.tweetId)
        if (typeof found[actionBy] === 'undefined'){
            found[actionBy] = []
        }
        found[actionBy].push(currentUser.uid)
        const tempArray = recipientRef.data().tweets
        tempArray[indexOfFound] = found
        action === 'retweets' ? tempArray[indexOfFound].amountOfRetweets = found[actionBy].length : tempArray[indexOfFound].amountOfFavorites = found[actionBy].length 

        const updatedRecipient = await setDoc(doc(db, 'users', value.originalOwner), {
            ...recipientRef.data(),
            tweets: tempArray
        })
        if (action === 'retweets'){
            grabTimeline('retweet', value)
        } else {
            grabFavorites(value, 'add')
            updateUser()
        }

    }

    const undoAction = async (value, action, actionBy) => {
        const user = await getDoc(doc(db, 'users', currentUser.uid))

        const updatedUser = await setDoc(doc(db, 'users', currentUser.uid), {
            ...user.data(),
            [action]: user.data()[action].filter(elem => elem.tweetId !== value.tweetId)
        })
        
        const recipientRef = await getDoc(doc(db, 'users', value.originalOwner))

        const indexOfFound = recipientRef.data().tweets.findIndex(elem => elem.tweetId === value.tweetId)
        const tempArray = recipientRef.data().tweets
        const updatedArray = tempArray[indexOfFound][actionBy].filter(elem => elem !== currentUser.uid)
        tempArray[indexOfFound][actionBy] = updatedArray
        action === 'retweets' ? tempArray[indexOfFound].amountOfRetweets = tempArray[indexOfFound][actionBy].length : tempArray[indexOfFound].amountOfFavorites = tempArray[indexOfFound][actionBy].length 

        const updatedRecipient = await setDoc(doc(db, 'users', value.originalOwner), {
            ...recipientRef.data(),
            tweets: tempArray
        })
        if(action === 'retweets'){
            grabTimeline('undoRetweet', value)
        } else {
            grabFavorites(value, 'remove')
            updateUser()
        }
    }

    const findRetweeter = async(user) => {
        if (currentUser.newUser === false){
            const retweeter = await getDoc(doc(db, 'users', user))
            return {    
                name: retweeter.data().name,
                username: retweeter.data().username
            }
        } 
    }

    const followUser = async (recipient) => {
        const userDoingTheFollowing = await updateDoc(doc(db, 'users', currentUser.uid), {
            following: arrayUnion(recipient),
        })
        const userBeingFollowed = await updateDoc(doc(db, 'users', recipient), {
            followers: arrayUnion(currentUser.uid)
        })

        const getSender = await getDoc(doc(db, 'users', currentUser.uid))
        const getRecipient = await getDoc(doc(db, 'users', recipient))

        const userFollowing = await updateDoc(doc(db, 'users', currentUser.uid), {
            amountOfFollowing: getSender.data().following.length
        })
        const userFollowed = await updateDoc(doc(db, 'users', recipient), {
            amountOfFollowers: getRecipient.data().followers.length
        })
        grabTimeline('follow')
    }

    const unfollowUser = async (recipient) => {
        const userDoingTheFollowing = await updateDoc(doc(db, 'users', currentUser.uid), {
            following: arrayRemove(recipient)
        })
        const userBeingFollowed = await updateDoc(doc(db, 'users', recipient), {
            followers: arrayRemove(currentUser.uid)
        })
        grabTimeline('follow')
        updateUser()
    }

    const grabTimeline = async (action, value) => {
        if (currentUser.newUser === false){
            // tweets
            if (action === 'tweet'){
                const userRef = await getDoc(doc(db, 'users', currentUser.uid))
                if (userRef.exists()){
                    let timeline = userRef.data().timeline
                    let feed = userRef.data().feed
                    timeline.unshift(userRef.data().tweets[userRef.data().tweets.length-1])
                    feed.unshift(userRef.data().tweets[userRef.data().tweets.length-1])
                    
                    const updatedUser = await updateDoc(doc(db, 'users', currentUser.uid), {
                        timeline: timeline,
                        feed: feed
                    })
                    updateUser()
                }
            }

            // retweets
            if (action === 'retweet'){
                const userRef = await getDoc(doc(db, 'users', currentUser.uid))
                if (userRef.exists()){
                    let timeline = userRef.data().timeline
                    let feed = userRef.data().feed
                    let retweetedUser = await getDoc(doc(db, 'users', value.originalOwner))
                    if (retweetedUser.exists()){
                        timeline.unshift(retweetedUser.data().tweets.find(item => item.tweetId === value.tweetId))
                        feed.unshift(retweetedUser.data().tweets.find(item => item.tweetId === value.tweetId))
                    }
                    timeline[0] = {...timeline[0], responsible: currentUser.uid, isARetweet: true, retweetDate: new Date().getTime()}
                    feed[0] = {...feed[0], responsible: currentUser.uid, isARetweet: true, retweetDate: new Date().getTime()}

                    let modifiedTimeline = []
                    let modifiedFeed= []
                    let timelinePromise = Promise.resolve(timeline.forEach(item => {
                        if (!modifiedTimeline.some(tweet => tweet.tweetId === item.tweetId)){
                            modifiedTimeline.push(item)
                        }
                    }))
                    timelinePromise.then(async () => await updateDoc(doc(db, 'users', currentUser.uid), {
                        timeline: modifiedTimeline,
                    }))
                    
                    let feedPromise = Promise.resolve(feed.forEach(item => {
                        if (!modifiedFeed.some(tweet => tweet.tweetId === item.tweetId)){
                            modifiedFeed.push(item)
                        }
                    }))
                    feedPromise.then(async () => await updateDoc(doc(db, 'users', currentUser.uid), {
                        feed: modifiedFeed,
                            
                        
                    })).then(() => updateUser())
                }
            }

            // following
            if (action === 'follow'){
                const userRef = await getDoc(doc(db, 'users', currentUser.uid))
                let allFeeds = [];
                if (userRef.exists()){
                    let count = 0;
                    userRef.data().following.forEach(async item => {
                        let following = await getDoc(doc(db, 'users', item))
                        if (following.exists()){
                            allFeeds.unshift(...following.data().feed)
                        }
                        count++
                        if (count === userRef.data().following.length){
                            allFeeds.unshift(...userRef.data().feed)
                            allFeeds.sort((a, b) => b.date - a.date)
                            const updatedUser = await updateDoc(doc(db, 'users', currentUser.uid),{
                                timeline: allFeeds
                            })
                        }
                        updateUser()
                    })
                    if(userRef.data().following.length === 0){
                        const updatedUser = await updateDoc(doc(db, 'users', currentUser.uid),{
                            timeline: userRef.data().feed
                        })
                    updateUser()
                    }
                }
            }

            // undo retweet
            if (action === 'undoRetweet'){
                const userRef = await getDoc(doc(db, 'users', currentUser.uid))
                if (userRef.exists()){
                    if(value.originalOwner === currentUser.uid){
                        let timeline = userRef.data().timeline
                        let timelineIndex = timeline.findIndex(item => item.tweetId === value.tweetId)
                        let feed = userRef.data().feed
                        let feedIndex = feed.findIndex(item => item.tweetId === value.tweetId)
                        
                        timeline[timelineIndex] = {...timeline[timelineIndex], isARetweet: false}
                        feed[feedIndex] = {...feed[feedIndex], isARetweet: false}

                        let updated = await updateDoc(doc(db, 'users', currentUser.uid), {
                            timeline: timeline.sort((a, b) => b.date - a.date),
                            feed: feed.sort((a, b) => b.date - a.date)
                        })
                        updateUser()
                    } else if (currentUser.following.some(item => item === value.originalOwner)){
                        let timeline = userRef.data().timeline
                        let feed = userRef.data().feed
                        let index = timeline.findIndex(item => item.tweetId === value.tweetId)
                        feed.splice(feed.findIndex(item => item.tweetId === value.tweetId), 1)
                        timeline[index] = {...timeline[index], isARetweet: false}

                        let updated = await updateDoc(doc(db, 'users', currentUser.uid), {
                            timeline: timeline.sort((a, b) => b.date - a.date),
                            feed: feed.sort((a, b) => b.date - a.date)
                        })
                        updateUser()
                    } else {
                        let timeline = userRef.data().timeline
                        let feed = userRef.data().feed
                        let index = timeline.findIndex(item => item.tweetId === value.tweetId)
                        feed.splice(feed.findIndex(item => item.tweetId === value.tweetId), 1)
                        timeline.splice(index, 1)

                        let updated = await updateDoc(doc(db, 'users', currentUser.uid), {
                            timeline: timeline,
                            feed: feed
                        })
                        updateUser()
                    }
                }
            }

            // undo tweet
            if (action === 'undoTweet'){
                const userRef = await getDoc(doc(db, 'users', currentUser.uid))
                let timeline = userRef.data().timeline
                let index = timeline.findIndex(item => item.tweetId === value.tweetId)
                let feed = userRef.data().feed
                feed.splice(feed.findIndex(item => item.tweetId === value.tweetId), 1)
                timeline.splice(index, 1)

                let updated = await updateDoc(doc(db, 'users', currentUser.uid), {
                    timeline: timeline,
                    feed: feed
                })
                updateUser()
            }
        }
    }

    const grabFavorites = async (value, action) => {
        if (action === 'add'){
            const user = await getDoc(doc(db, 'users', currentUser.uid))
            let newArray = user.data().favoritesFeed
            
            newArray.unshift(value)
            const userUpdated = await updateDoc(doc(db, 'users', currentUser.uid), {
                favoritesFeed: newArray
            })
        } else if (action === 'remove'){
            const user = await getDoc(doc(db, 'users', currentUser.uid))
            let newArray = user.data().favoritesFeed.filter(item => item.tweetId !== value.tweetId)
            const updated = await updateDoc(doc(db, 'users', currentUser.uid), {
                favoritesFeed: newArray
            })
        }
    }

    const userNameAvailable = async (value) => {
        const q = query(collection(db, 'users'), where('username', '==', value));
        const get = await getDocs(q)
        if (get.docs.length === 0 || currentUser.username === get.docs[0].data().username){
            return true
        } else {
            return false
        }
    }

    const notNewUser = async (username, name, description, profilePicture, profileHeader) => {
        handleUserMedia(profilePicture, profileHeader)
        const userDoc = await updateDoc(doc(db, 'users', currentUser.uid), {
            newUser: false,
            username: username,
            name: name, 
            description: description
        })
        updateUser()
    }

    // Set profile picture & header
    const handleUserMedia = async (profilePicture, profileHeader) => {
        const profilePictureResponse = await fetch(profilePicture) 
        const profilePictureImg = await profilePictureResponse.blob() 

        const profileHeaderResponse = await fetch(profileHeader) 
        const profileHeaderImg = await profileHeaderResponse.blob() 

        const profilePictureStorageRef = ref(storage, `${currentUser.uid}/profilePicture`)
        const profileHeaderStorageRef = ref(storage, `${currentUser.uid}/profileHeader`)

        const uploadProfilePicture = await uploadBytes(profilePictureStorageRef, profilePictureImg)
        const uploadProfileHeader = await uploadBytes(profileHeaderStorageRef, profileHeaderImg)

        const profilePictureLink = await getDownloadURL(ref(storage, `${currentUser.uid}/profilePicture`))
        const profileHeaderLink = await getDownloadURL(ref(storage, `${currentUser.uid}/profileHeader`))

        const userRef = await updateDoc(doc(db, 'users', currentUser.uid), {
            profilePicture: profilePictureLink,
            profileHeader: profileHeaderLink
        })
        updateUser()
    }

    const addToUserCollection = async (name) => {
        const user = auth.currentUser;
        if (user){
            const docRef = await setDoc(doc(db, 'users', user.uid), {
                uid: user.uid,
                name: name,
                username: generateUserName(name),
                amountOfFollowing: 0,
                amountOfFollowers: 0,
                following: [],
                followers: [],
                tweets: [],
                favorites: [],
                retweets: [],
                timeline: [],
                feed: [],
                favoritesFeed: [],
                newUser: true,
                joinDate: dayjs().format('MMMM YYYY')
            });
            updateUser()
        }
    }

    const generateUserName = (givenName) => {
        let name;
        let blankSpace = givenName.indexOf(' ')
        let numArray = [];
        for (let i=0; i<3; i++){
            numArray[i] = Math.floor(Math.random() * 9)
        }

        name = givenName.substring(0, blankSpace !== -1 ? blankSpace : 8) + numArray[0] + numArray[1] + numArray[2]

        return name
    }

    const signOut = () => {
        auth.signOut()
    }

    return(
        <BrowserRouter basename='/'>
            <Routes>
                <Route path='/' element={<LandingPage updateUser={updateUser} addToUserCollection={addToUserCollection} isLoggedIn={isLoggedIn} />}/> 
                <Route path='/signup' element={<Signup addToUserCollection={addToUserCollection} updateUser={updateUser}/>} />
                <Route path='/login' element={<Login isLoggedIn={isLoggedIn} updateUser={updateUser}/>} />
                <Route element={<ProtectedRoutes isLoggedIn={isLoggedIn}/>}>
                    <Route path='/home' element={<Home uploadTweetMedia={uploadTweetMedia} storage={storage} userNameAvailable={userNameAvailable} followUser={followUser} unfollowUser={unfollowUser} findRetweeter={findRetweeter} updateUser={updateUser} grabTimeline={grabTimeline} isLoggedIn={isLoggedIn} currentUser={currentUser} submitTweet={submitTweet} deleteTweet={deleteTweet} submitReply={submitReply} deleteReply={deleteReply} submitAction={submitAction} undoAction={undoAction} notNewUser={notNewUser} db={db} signOut={signOut}/>} />
                    <Route path='/listed-users' element={<ListedUsers getDoc={getDoc} doc={doc} db={db} signOut={signOut} currentUser={currentUser} isLoggedIn={isLoggedIn} followUser={followUser} unfollowUser={unfollowUser}/>} />
                </Route>
                <Route path='/user/:id' element={<UserPage signOut={signOut} auth={auth} storage={storage} db={db} userNameAvailable={userNameAvailable} notNewUser={notNewUser} findRetweeter={findRetweeter} isLoggedIn={isLoggedIn} updateUser={updateUser} submitReply={submitReply} deleteReply={deleteReply} deleteTweet={deleteTweet} currentUser={currentUser} submitAction={submitAction} undoAction={undoAction} followUser={followUser} unfollowUser={unfollowUser}/>}/>
                <Route path='/search' element={<SearchPage followUser={followUser} unfollowUser={unfollowUser} db={db} signOut={signOut} currentUser={currentUser} isLoggedIn={isLoggedIn}/>}/>
                <Route path='/:id/status/:id' element={<TweetPage signOut={signOut} deleteTweet={deleteTweet} followUser={followUser} unfollowUser={unfollowUser} currentUser={currentUser} isLoggedIn={isLoggedIn} db={db} submitReply={submitReply} submitAction={submitAction} undoAction={undoAction}/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default RouteSwitch;