import styles from './NavBar.module.css'
import { useNavigate, useLocation } from 'react-router-dom'
import icon from '../assets/icon/icon50.png'
import homeIcon from './assets/home.png'
import profileIcon from './assets/user.png'
import messageIcon from './assets/message.png'
import ellipsis from './assets/ellipsis.png'
import signOut from './assets/logout.png'
import searchIcon from './assets/searchIcon.png'
import { useEffect, useRef } from 'react'

const NavBar = props => {
    const navigate = useNavigate()
    const locate = useLocation()
    const outerContainer = useRef(null)
    
    const handleNavigation = (location) => {
        if (location !== locate.pathname){
            if (props.isLoggedIn){
                if (locate.pathname.substring(0, 5) === '/user'){
                    navigate(location)
                    if (location.substring(0, 5) === '/user'){
                        window.location.reload()
                    }
                } else {
                    navigate(location)
                }
            } else{
                navigate('/')
            }
        }
    }

    const handleSignOut = () => {
        props.signOut()
        navigate('/')
    }

    return(
        <div ref={outerContainer} className={styles.outerContainer} style={{opacity: props.replyMode ? '0.8' : '1', filter: props.replyMode ? 'brightness(0.5) blur(5px)' : 'brightness(1) blur(0px)'}}>
            <div className={styles.innerContainer}>
                <div className={styles.appIcon} onClick={() => handleNavigation('/home')}>
                    <img src={icon} alt='icon'/>
                </div>
                <div className={styles.home} onClick={() => handleNavigation('/home')}>
                    <img src={homeIcon} alt='home icon'/> <span> Home</span>
                </div>
                <div className={styles.profile} onClick={() => handleNavigation('/user/' + props.currentUser.username)}>
                    <img src={profileIcon} alt='profile icon' /> <span>Profile</span>
                </div>
                <div style={{display: 'none'}} className={styles.messages}>
                    <img src={messageIcon} alt='messages icon' /> <span>Messages</span>
                </div>
                <div style={{display: window.screen.width <= 1050 || window.screen.height <= 500? 'flex' : 'none' }} onClick={() => handleNavigation('/search')} className={styles.search}>
                    <img src={searchIcon} alt='search icon' /> <span>Search</span>
                </div>
                <div onClick={handleSignOut} className={styles.signOut}>
                    <img src={signOut} alt='sign out icon' /> <span>Sign out</span>
                </div>
            </div>
            <div className={styles.user} style={{display: props.isLoggedIn ? 'flex' : 'none'}}>
                <div>
                    <div className={styles.userIcon}>
                        <img alt='user' src={props.currentUser.profilePicture}/>
                    </div>
                    <div className={styles.userInfo}>
                        <div style={{fontWeight:'bold'}}className={styles.name}>
                            {props.currentUser.name}
                        </div>
                        <div style={{color: '#536471'}}className={styles.username}>
                            @{props.currentUser.username}
                        </div>
                    </div>
                </div>
                <div className={styles.elipsis}>
                    <img src={ellipsis} alt='elipsis' />
                </div>
            </div>
        </div>
    )
}

export default NavBar;