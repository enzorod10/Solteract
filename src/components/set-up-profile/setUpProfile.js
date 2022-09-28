import { useEffect, useState } from 'react'
import styles from './SetUpProfile.module.css'
import { useNavigate } from 'react-router-dom'
import icon from '../assets/icon/icon50.png'
import bender96 from '../assets/profile-pictures/bender96.png'
import bmo96 from '../assets/profile-pictures/bmo96.png'
import cookieMonster96 from '../assets/profile-pictures/cookieMonster96.png'
import jerry96 from '../assets/profile-pictures/jerry96.png'
import ericCartman96 from '../assets/profile-pictures/ericCartman96.png'
import flash96 from '../assets/profile-pictures/flash96.png'
import frankenstein96 from '../assets/profile-pictures/frankenstein96.png'
import frodo96 from '../assets/profile-pictures/frodo96.png'
import hawkeye96 from '../assets/profile-pictures/hawkeye96.png'
import homer96 from '../assets/profile-pictures/homer96.png'
import hulk96 from '../assets/profile-pictures/hulk96.png'
import luigi96 from '../assets/profile-pictures/luigi96.png'
import marceline96 from '../assets/profile-pictures/marceline96.png'
import morty96 from '../assets/profile-pictures/morty96.png'
import ninja96 from '../assets/profile-pictures/ninja96.png'
import obitoUchiha96 from '../assets/profile-pictures/obitoUchiha96.png'
import popeye80 from '../assets/profile-pictures/popeye80.png'
import sonic96 from '../assets/profile-pictures/sonic96.png'
import spongebob96 from '../assets/profile-pictures/spongebob96.png'
import steve96 from '../assets/profile-pictures/steve96.png'
import stitch96 from '../assets/profile-pictures/stitch96.png'
import tom96 from '../assets/profile-pictures/tom96.png'
import wolverine96 from '../assets/profile-pictures/wolverine96.png'
import wonderWoman96 from '../assets/profile-pictures/wonderWoman96.png'
import woodpecker96 from '../assets/profile-pictures/woodpecker96.png'
import zoidberg96 from '../assets/profile-pictures/zoidberg96.png'
import kakashi96 from '../assets/profile-pictures/kakashi96.png'
import goku128 from '../assets/profile-pictures/goku128.png'
import hinata96 from '../assets/profile-pictures/hinata96.png'
import uploadIcon from './assets/uploadIcon.png'
import defaultIcon from '../assets/profile-pictures/defaultIcon.png'
import abstractHeader from '../assets/headers/abstract.jpg'
import balloonHeader from '../assets/headers/balloon.jpg'
import blackHeader from '../assets/headers/black.jpg'
import coffeeHeader from '../assets/headers/coffee.jpg'
import greenBlueHeader from '../assets/headers/greenBlue.jpg'
import moonHeader from '../assets/headers/moon.jpg'
import sunsetHeader from '../assets/headers/sunset.jpg'
import textureHeader from '../assets/headers/texture.jpg'
import treeHeader from '../assets/headers/tree.jpg'
import whiteBricksHeader from '../assets/headers/whiteBricks.jpg'
import yellowHeader from '../assets/headers/yellow.jpg'
import defaultHeader from '../assets/headers/defaultHeader.png'


const SetUpProfile = props => {
    const [errorMessage, setErrorMessage] = useState('')
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [description, setDescription] = useState('')
    const [profilePicture, setProfilePicture] = useState(defaultIcon)
    const [profileHeader, setProfileHeader] = useState(defaultHeader)
    const [stage, setStage] = useState({index: 1, name: 'Set User Profile Picture'})

    const navigate = useNavigate()

    useEffect(() => {
        setUsername(props.currentUser.username)
        setName(props.currentUser.name)
    }, [props.currentUser])

    useEffect(() => {
        username === '' && setUsername(props.currentUser.username)
    }, [username])
    
    useEffect(() => {
        name === '' && setName(props.currentUser.name)
    }, [name])

    useEffect(() => {
        if (props.currentUser.description){
            description === '' && setDescription(props.currentUser.description)
        }
    }, [description])

    useEffect(() => {
        if (stage.index === 0){
            setStage({index: 0, name: 'Set User Information'})
        }
        if (stage.index === 1){
            setStage({index: 1, name: 'Set User Profile Picture'})
        }
        if (stage.index === 2){
            setStage({index: 2, name: 'Set User Header Picture'})
        }
    }, [stage.index])

    const handleInitialClick = async() => {
        if (username.length < 3){
            setErrorMessage('Username must be at least 4 characters')
            return true;
        }else if (username.length > 16){
            setErrorMessage('Username must be at most 16 characters')
            return true;
        } else if (name.length > 25){
            setErrorMessage('Name is too long')
            return true;
        } else if (!username.match(/^[a-zA-z0-9\s]+$/)){
            setErrorMessage('Username can only be letters and numbers')
            return true;
        } else {
            for (let i=0; i<username.length; i++){
                if(username[i] === ' '){
                    setErrorMessage('Username can not contain spaces')
                    return true;
                }
            }
        } 
        
        if (await props.userNameAvailable(username) === true){
            if (props.source && props.source === 'home'){
                let promise = await props.notNewUser(username, name, description, profilePicture, profileHeader)
                props.changeEditMode()
                navigate('/home')

            } else {
                props.notNewUser(username, name, description, profilePicture, profileHeader)

            }
        }else {
            setErrorMessage(username + ' is taken already!')
        }
    }

    const changeUsername = value => {
        setErrorMessage('')
        setUsername(value)
    }

    const changeStage = (action) => {
        if (action === 'back'){
            setStage({index: Math.abs(stage.index - 1) % 3})
        } else {
            setStage({index: (stage.index + 1) % 3})
        }
    }

    const handleLogoClick = () => {
        if (props.currentUser && !props.currentUser.newUser){
            props.changeEditMode()
        }
    }

    return (
        <div className={styles.formContainer}>
            <img style={{cursor: 'pointer'}} onClick={handleLogoClick}src={icon} alt='icon'/>
            <div className={styles.demonstrationContainer}>
                <div className={styles.headerPicture}>
                    {profileHeader === '' ? <img src={defaultHeader} alt='default header' /> : <img src={profileHeader} alt='Profile header' />}
                </div>
                <div className={styles.userContainer}>
                    <div className={styles.profilePicture}>
                        {profilePicture === '' ? <img src={defaultIcon} alt='default icon' /> : <img src={profilePicture} alt='Profile icon'/>}
                    </div>
                    <div className={styles.nameAndUsername}>
                        <div style={{fontWeight: 'bold'}}className={styles.name}>
                            {name}
                        </div>
                        <div style={{color: '#536471'}}className={styles.userName}>
                            @{username}
                        </div>
                    </div>
                    <div className={styles.description}>
                        {description}
                    </div>
                </div>
            </div>
            <div className={styles.editContainer}>
                {stage.index === 0 &&
                <div className={styles.firstPage}>
                    <div className={styles.chooseNameContainer}> 
                        <div className={styles.nameLabel}>
                            Name
                        </div>
                        <input placeholder={props.currentUser.name} onChange={e => setName(e.target.value)}/>
                    </div>
                    <div className={styles.chooseUsernameContainer}> 
                        <div className={styles.usernameLabel}>
                            Username
                        </div>
                        <div className={styles.inputUsername}>
                            <p>@</p> <input className='selectUsername' placeholder={props.currentUser.username} 
                            onChange={e => changeUsername(e.target.value)}/> 
                        </div>
                        {errorMessage !== '' && <div> {errorMessage} </div>}
                    </div>
                    <div className={styles.inputDescription}> 
                        <div className={styles.descriptionLabel}>
                            Description
                        </div>
                        <textarea maxLength={266} onChange={e => setDescription(e.target.value)} placeholder={props.currentUser.description}/>
                    </div>
                </div>}
                {stage.index === 1 &&
                <div className={styles.secondPage}>
                    <div className={styles.imagesContainer}>
                        <input onChange={e => setProfilePicture(URL.createObjectURL(e.target.files[0]))} id='uploadFile' type='file' style={{display: 'none'}} />
                        <label htmlFor='uploadFile'><img src={uploadIcon} alt='upload icon'/> </label>
                        <img src={bender96} alt='bender' onClick={() => setProfilePicture(bender96)}/>
                        <img src={bmo96} alt='bmo' onClick={() => setProfilePicture(bmo96)}/>
                        <img src={popeye80} alt='popeye' onClick={() => setProfilePicture(popeye80)}/>
                        <img src={wonderWoman96} alt='wonder woman' onClick={() => setProfilePicture(wonderWoman96)}/>
                        <img src={cookieMonster96} alt='cookie monster' onClick={() => setProfilePicture(cookieMonster96)}/>
                        <img src={jerry96} alt='jerry' onClick={() => setProfilePicture(jerry96)}/>
                        <img src={ericCartman96} alt='eric cartman' onClick={() => setProfilePicture(ericCartman96)}/>
                        <img src={flash96} alt='flash' onClick={() => setProfilePicture(flash96)}/>
                        <img src={frankenstein96} alt='frankenstein' onClick={() => setProfilePicture(frankenstein96)}/>
                        <img src={frodo96} alt='frodo' onClick={() => setProfilePicture(frodo96)}/>
                        <img src={hawkeye96} alt='hawkeye' onClick={() => setProfilePicture(hawkeye96)}/>
                        <img src={homer96} alt='homer' onClick={() => setProfilePicture(homer96)}/>
                        <img src={hulk96} alt='hulk' onClick={() => setProfilePicture(hulk96)}/>
                        <img src={hinata96} alt='hulk' onClick={() => setProfilePicture(hinata96)}/>
                        <img src={goku128} alt='hulk' onClick={() => setProfilePicture(goku128)}/>
                        <img src={kakashi96} alt='hulk' onClick={() => setProfilePicture(kakashi96)}/>
                        <img src={luigi96} alt='luigi' onClick={() => setProfilePicture(luigi96)}/>
                        <img src={marceline96} alt='marceline' onClick={() => setProfilePicture(marceline96)}/>
                        <img src={morty96} alt='morty' onClick={() => setProfilePicture(morty96)}/>
                        <img src={ninja96} alt='ninja' onClick={() => setProfilePicture(ninja96)}/>
                        <img src={obitoUchiha96} alt='obito uchiha' onClick={() => setProfilePicture(obitoUchiha96)}/>
                        <img src={sonic96} alt='sonic' onClick={() => setProfilePicture(sonic96)}/>
                        <img src={spongebob96} alt='spongebob' onClick={() => setProfilePicture(spongebob96)}/>
                        <img src={steve96} alt='steve' onClick={() => setProfilePicture(steve96)}/>
                        <img src={stitch96} alt='stitch' onClick={() => setProfilePicture(stitch96)}/>
                        <img src={tom96} alt='tom' onClick={() => setProfilePicture(tom96)}/>
                        <img src={wolverine96} alt='wolverine' onClick={() => setProfilePicture(wolverine96)}/>
                        <img src={woodpecker96} alt='woodpecker' onClick={() => setProfilePicture(woodpecker96)}/>
                        <img src={zoidberg96} alt='zoidberg' onClick={() => setProfilePicture(zoidberg96)}/>
                    </div>
                </div>}
                {stage.index === 2 &&
                <div className={styles.thirdPage}>
                    <div className={styles.chooseHeaderContainer}>
                        <input onChange={e => setProfileHeader(URL.createObjectURL(e.target.files[0]))} id='header' type='file' style={{display: 'none'}}/>
                        <label htmlFor='header'> <img src={uploadIcon} alt='upload icon' /> </label>
                        <img src={abstractHeader} onClick={() => setProfileHeader(abstractHeader)} alt='abstract header' />
                        <img src={balloonHeader} onClick={() => setProfileHeader(balloonHeader)} alt='balloon header' />
                        <img src={blackHeader} onClick={() => setProfileHeader(blackHeader)} alt='black header' />
                        <img src={coffeeHeader} onClick={() => setProfileHeader(coffeeHeader)} alt='coffee header' />
                        <img src={greenBlueHeader} onClick={() => setProfileHeader(greenBlueHeader)} alt='greenish blueish header' />
                        <img src={moonHeader} onClick={() => setProfileHeader(moonHeader)} alt='moon header' />
                        <img src={sunsetHeader} onClick={() => setProfileHeader(sunsetHeader)} alt='sunset header' />
                        <img src={textureHeader} onClick={() => setProfileHeader(textureHeader)} alt='texture header' />
                        <img src={treeHeader} onClick={() => setProfileHeader(treeHeader)} alt='tree header' />
                        <img src={whiteBricksHeader} onClick={() => setProfileHeader(whiteBricksHeader)} alt='white bricks header' />
                        <img src={yellowHeader} onClick={() => setProfileHeader(yellowHeader)} alt='yellow header' />
                    </div>
                </div>}
                <div className={styles.navigationContainer}>
                    <div onClick={() => changeStage('back')}>
                        {'<'}
                    </div>
                    <div>
                        {stage.name}
                    </div>
                    <div onClick={() => changeStage('forward')}>
                        {'>'}
                    </div>
                </div>
            </div>
            <div className={styles.finishButton} onClick={() => handleInitialClick()}>Finish</div>
        </div> 
    )
}

export default SetUpProfile;