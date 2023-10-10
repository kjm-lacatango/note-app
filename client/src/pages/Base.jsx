import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import {faBars, faHouse, faCircleInfo} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {motion} from 'framer-motion'


function Base() {
  const navigate = useNavigate()
  const [isHomeActive, setHomeIsActive] = useState(true)
  const [isAboutActive, setAboutIsActive] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const aboutNav = () => {
    setHomeIsActive(false)
    setAboutIsActive(true)
  }
  const homeNav = () => {
    setAboutIsActive(false)
    setHomeIsActive(true)
  }

  useEffect(() => {
    const uid = localStorage.getItem("key")
    if (uid) {
      Axios.get(`http://localhost:5001/userInfo/${uid}`).then(res => {
        if (res.data.result.length > 0) {
          navigate("/main")
        }
      }).catch(err => console.log(err))
    }
    
  }, [])

  return (
    <div className='base'>
      <div className='lg-bg' />
      <header className='base-navCont'>
        <motion.h1 animate={{x: 1}} initial={{x: -100}} transition={{duration: .5}}>KJM</motion.h1>
        <motion.div className='base-nav' animate={{scale: 1, x: 1}} initial={{scale: 0, x: 100}} transition={{duration: .3}}>
          <div className='ha'>
            <h4 onClick={homeNav} style={{color: isHomeActive && 'rgb(148, 11, 34)'}}>Home</h4>
            <h4 onClick={aboutNav} style={{color: isAboutActive && 'rgb(148, 11, 34)'}}>About</h4>
          </div>
          <span className='base-signup' onClick={() => navigate("/register")}>SignUp</span>
        </motion.div>
        <FontAwesomeIcon className='menu' icon={faBars} onClick={() => setShowMenu(prev => !prev)} />
      </header>

      <main className='base-main'>
        {isHomeActive ? (
          <motion.div className='main-cont' animate={{y: 1, opacity: 1}} initial={{y: -200, opacity: 0}} transition={{delay: .3}}>
            <h1>Note App</h1>
            <p>Create yours now</p>
            <button className='main-btn' onClick={() => navigate("/login")}>Get Started</button>
          </motion.div> 
        ) : (
          <div className='about-cont'>
            <h1>About Us</h1>
            <p>
              This was developed by Keannu John Mellen Lacatango using react, mysql, express, and node.<br /><br />
              You can enter some of your confidential information here.
              If you are unable to tell somebody what you are going through, you can also express it here.
              This program will help in lessening negative emotions and thoughts.
            </p>
            <button className='main-btn' onClick={() => navigate("/login")}>Continue</button>
          </div>
        )}
        <div className='note-pic' />

        {showMenu && (
          <div className='drop-menu' >
            <h4 onClick={homeNav} style={{color: isHomeActive && 'rgb(148, 11, 34)'}}><FontAwesomeIcon className='icon' icon={faHouse} />Home</h4>
            <h4 onClick={aboutNav} style={{color: isAboutActive && 'rgb(148, 11, 34)'}}><FontAwesomeIcon className='icon' icon={faCircleInfo} />About</h4>
            <h4 className='signup' onClick={() => navigate("/register")}>SignUp</h4>
          </div>
        )}
      </main>
    </div>
  )
}

export default Base
