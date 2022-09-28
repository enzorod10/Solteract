import { useEffect, useState } from 'react'
import styles from './Reply.module.css'
import Tweet from '../tweet/Tweet.js'
import Textarea from 'react-expanding-textarea'
import uploadIcon from '../home/assets/uploadIcon.png'
import { useNavigate } from 'react-router-dom'

const Reply = props => {
    const [replyMessage, setReplyMessage] = useState({text: '', media: ''})
    const navigate = useNavigate();

    const deliverReply = () => {
        props.submitReply(props.reply.tweetObject.tweetId, props.reply.tweetObject.originalOwner, replyMessage)
        exitReply()
    }

    const exitReply = () => {
        document.querySelector('.replyText').value = ''
        setReplyMessage({text: '', media: ''})
        props.exitReply()
    }

    return(
        <div style={{position: 'absolute', top: document.documentElement.scrollTop + 30 , display: props.reply.replyMode ? 'flex' : 'none'}} className={styles.outerContainer}>
            <div className={styles.innerContainer}>
                <div className={styles.header} onClick={exitReply}> <span>{'<'}</span> <span style={{fontWeight: 'bold'}}>Reply</span></div>
                <Tweet currentUser={props.currentUser} replyMode={true} tweetObject={props.reply.tweetObject}/>
                <div style={{display: 'flex'}}className={styles.middlePassage}>
                    <div>
                        <div>
                        </div>
                    </div>
                    <div>
                        Replying to <span style={{cursor: 'pointer', color:'#12c5fc'}} onClick={() => navigate('/user/' + props.reply.tweetObject.originalOwnerUsername)}>@{props.reply.tweetObject && props.reply.tweetObject.originalOwnerUsername}</span>
                    </div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', padding: '10px 15px 10px 10px', gap: '10px'}} className={styles.reply}>
                    <div className={styles.replyContent}>
                        <img style={{height: '45px', width: '45px', borderRadius: '50%', backgroundColor: 'grey'}} src={props.currentUser.profilePicture && props.currentUser.profilePicture} alt='profile icon'/>
                        <div className={styles.replyMessage}>
                            <Textarea className='replyText' autoFocus style={{fontSize:'18px'}} placeholder='Transmit your reply' onChange={e => {setReplyMessage({...replyMessage, text: e.target.value})}} type='text'/>
                            {replyMessage.media !== '' && !!replyMessage.media && <img style={{width: '100%', borderRadius: '10px'}} src={replyMessage.media} alt='reply message media' />}
                        </div>
                    </div>
                    <div className={styles.bottomContainer}>
                        <input type='file' id='replyInput' onChange={e => setReplyMessage({...replyMessage, media: URL.createObjectURL(e.target.files[0])})} style={{display: 'none'}} />
                        <label htmlFor='replyInput'>
                            <img className={styles.uploadButton} src={uploadIcon} alt='upload icon' />
                        </label>
                        <div className={styles.replyButton} onClick={deliverReply}>Reply</div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default Reply