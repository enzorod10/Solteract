import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../nav-bar/NavBar'
import styles from './SearchPage.module.css'
import uniqid from 'uniqid'
import searchIcon from './assets/searchIcon.png'
import FollowSuggestions from '../follow-suggestions/FollowSuggestions.js'

const SearchPage = props => {
    const [uids, setUids] = useState('')
    const [users, setUsers] = useState('')
    const navigate = useNavigate();

    const usersCollection = collection(props.db, 'users')
    const q = query(usersCollection, where('newUser', '==', false))
    
    useEffect(() => {
        window.scrollTo(0,0);
    }, [])

    const lookUp = async val => {
        if (val !== ''){
            const exp = new RegExp(val, 'g')
            const tempArray = [];
            const queryDocs = await getDocs(q)
            for (let i=0; i<queryDocs.docs.length; i++){
                if([...queryDocs.docs[i].data().name.matchAll(exp)].length !== 0){
                    tempArray.push(queryDocs.docs[i].data().uid)
                    if (tempArray.length === 10){
                        break;
                    }
                }
            }
            setUids(tempArray)
        } else {
            setUids('')
        }
    }

    useEffect(() => {
        grabUsers()
    }, [uids])

    const grabUsers = async () => {
        const tempArray = []
        for (let i=0; i<uids.length; i++){
            let temp = await getDoc(doc(props.db, 'users', uids[i]))
            tempArray.push(temp.data())
        }
        setUsers(tempArray)
    }

    const handleClick = (value) => {
        if(props.fromUser){
            navigate('/user/' + value)
            window.location.reload()
        } else{
            navigate('/user/' + value)
        }
    }

    return(
        <div className={styles.outerContainer}>
            <div className={styles.header}>
                <span onClick={() => navigate(-1)}>{'<'} </span> <span>Explore</span>
            </div>
            <NavBar signOut={props.signOut} currentUser={props.currentUser} isLoggedIn={props.isLoggedIn}/>
            <div className={styles.mainSection}>
                <div className={styles.searchContainer}> 
                    <img src={searchIcon} alt='search icon'/>
                    <input placeholder='Search Solteract' onChange={e => lookUp(e.target.value)}/>
                </div>
                <div className={styles.resultsContainer}>
                    {users.length > 0 && users.map(user => {
                        return <div onClick={() => handleClick(user.username)} className={styles.result} key={uniqid()}>
                            <div className={styles.userPicture}>
                                <img src={user.profilePicture} alt='user icon'/>
                            </div>
                            <div className={styles.userContent}>
                                <div style={{fontWeight: 'bold'}}> {user.name}</div>
                                <div style={{color: '#536471'}}> @{user.username}</div>
                            </div>
                            </div>
                    })}
                </div>
                <FollowSuggestions isLoggedIn={props.isLoggedIn} followUser={props.followUser} unfollowUser={props.unfollowUser} currentUser={props.currentUser} />
            </div>
        </div>
    )
}

export default SearchPage;