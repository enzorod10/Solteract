import { useEffect, useState } from 'react'
import styles from './ListedUsers.module.css'
import uniqid from 'uniqid'
import { useLocation, useNavigate } from 'react-router-dom';

import { doc, getDoc } from 'firebase/firestore'
import NavBar from '../nav-bar/NavBar';
import Search from '../search/Search';
import FollowSuggestions from '../follow-suggestions/FollowSuggestions';

const ListedUsers = props => {
    const [listName, setListName] = useState('')
    const [list, setList] = useState([])
    
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state.source === 'following'){
            setListName('Following')
        } else if (location.state.source === 'followers'){
            setListName('Followers')
        } else if (location.state.source === 'retweets'){
            setListName('Retransmitted By')
        } else if (location.state.source === 'favorites'){
            setListName('Favorited By')
        }
    }, [])

    useEffect(() => {
        if (listName === 'Following' || listName === 'Followers'){
            grabListFromUser()
        }

        if (listName === 'Retransmitted By' || listName === 'Favorited By'){
            grabListFromTweet()
        }
    }, [listName])

        const grabListFromUser = async () => {
        let count = 0;
        let tempUser = {};
        let tempList = [];

        let userRef = await getDoc(doc(props.db, 'users', location.state.currentUser.uid))
        if (listName === 'Following'){
            userRef.data().following.forEach(async item => {
                count++;
                let ref = await getDoc(doc(props.db, 'users', item))
                tempUser = {uid: item, username: ref.data().username, name: ref.data().name, profilePicture: ref.data().profilePicture}
                tempList.push(tempUser)
                if (count === userRef.data().following.length){
                    setList(tempList)
                }
            })
        }
        if (listName === 'Followers'){
            userRef.data().followers.forEach(async item => {
                count++;
                let ref = await getDoc(doc(props.db, 'users', item))
                tempUser = {uid: item, username: ref.data().username, name: ref.data().name, profilePicture: ref.data().profilePicture}
                tempList.push(tempUser)
                if (count === userRef.data().followers.length){
                    setList(tempList)
                }
            })
        }
    }

    const grabListFromTweet = async () => {
        let count = 0;
        let tempUser = {};
        let tempList = [];

        let userRef = await getDoc(doc(props.db, 'users', location.state.user))
        let foundTweet = userRef.data().tweets.find(item => item.tweetId === location.state.tweet)
        if (listName === 'Retransmitted By'){
            foundTweet.retweetedBy.forEach(async item => {
                count++;
                let ref = await getDoc(doc(props.db, 'users', item))
                tempUser = {uid: item, username: ref.data().username, name: ref.data().name, profilePicture: ref.data().profilePicture}
                tempList.push(tempUser)
                if (count === foundTweet.retweetedBy.length){
                    setList(tempList)
                }
            })
        }
        if (listName === 'Favorited By'){
            foundTweet.favoritedBy.forEach(async item => {
                count++;
                let ref = await getDoc(doc(props.db, 'users', item))
                tempUser = {uid: item, username: ref.data().username, name: ref.data().name, profilePicture: ref.data().profilePicture}
                tempList.push(tempUser)
                if (count === foundTweet.favoritedBy.length){
                    setList(tempList)
                }
            })
        }
    }

    return(
        <div className={styles.outerContainer}>
            <NavBar signOut={props.signOut} currentUser={props.currentUser} isLoggedIn={props.isLoggedIn}/>
            <div className={styles.mainSection}>
                <div className={styles.header}>
                    <span onClick={() => navigate(-1)}>{'<'}</span> <span>{listName}</span>
                </div>
                <div className={styles.usersContainer}>
                    {list.map(user => {
                        return <div key={uniqid()} className={styles.user} onClick={() => navigate('/user/' + user.username)}> 
                        <img src={user.profilePicture} alt='user profile icon' />
                        <div className={styles.userContent}>
                            <div>
                                {user.name}
                            </div>
                            <div>
                                @{user.username}
                            </div>
                        </div>
                        </div>
                    })}
                </div>
            </div>
            <div className={styles.exploreSection}>
                <Search db={props.db}/>
                <FollowSuggestions currentUser={props.currentUser} followUser={props.followUser} isLoggedIn={props.isLoggedIn} unfollowUser={props.unfollowUser}/>
            </div>
        </div>
    )
}

export default ListedUsers;