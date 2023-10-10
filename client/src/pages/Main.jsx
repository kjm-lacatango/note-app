import React, { useContext, useEffect, useState } from 'react'
import LeftSide from '../components/LeftSide'
import { useNavigate } from 'react-router-dom'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faPenNib, faUser, faArrowLeft, faPowerOff} from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios'
import swal from 'sweetalert2'
import {motion} from 'framer-motion'

function Main() {
  const navigate = useNavigate()
  const [isShow, setIsShow] = useState(false)
  const [isManageAcc, setIsManageAcc] = useState(false)
  const [userLists, setUserLists] = useState([])
  const [isUpdateFname, setIsUpdateFname] = useState(false)
  const [isUpdateLname, setIsUpdateLname] = useState(false)
  const [updateFname, setUpdateFname] = useState("")
  const [updateLname, setUpdateLname] = useState("")
  const [file, setFile] = useState(null)

  const handleLogout = () => {
    swal.fire({
      title: 'Are you sure?',
      text: 'You want to Logout',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(res => {
      if (res.isConfirmed) {
        navigate("/")
        localStorage.removeItem("key")
      }
    })
  }

  const manageAcc = () => {
    setIsShow(prev => !prev)
    setIsManageAcc(false)
  }
  
  const handleUpload = (id) => {
    swal.fire({
      title: 'Are you sure?',
      text: 'You want to update your profile',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(result => {
      if (result.isConfirmed) {
        const formData = new FormData()
        formData.append('image', file)
        Axios.post(`http://localhost:5001/upload/profile/${id}`, formData)
        .then(res => swal.fire('Success', res.data, 'success'))
        .catch(err => console.log(err))
        setFile(null)
      } else if (result.dismiss === swal.DismissReason.cancel) {
        swal.fire('Cancelled', 'Your profile is not updated', 'error')
        setFile(null)
      }
    })
    getUser()
  }

  const handleSaveLname = (id) => {
    if (updateLname.trim() !== "") {
      Axios.put(`http://localhost:5001/user/lname/${id}`, {fname: updateLname}).then(res => {
        getUser()
        swal.fire("Success", res.data.message, 'success')
        setIsUpdateLname(false)
        setUpdateFname("") 
      })
    } else {
      swal.fire('Error', "Doesn't accept empty field", 'error')
      setUpdateFname("")
    }
  }

  const handleSaveFname = (id) => {
    if (updateFname.trim() !== "") {
      Axios.put(`http://localhost:5001/user/fname/${id}`, {fname: updateFname}).then(res => {
        swal.fire("Success", res.data.message, 'success')
        setIsUpdateFname(false)
        setUpdateFname("") 
      }).then(err => console.log(err))
    } else {
      swal.fire('Error', "Doesn't accept empty field", 'error')
      setUpdateFname("")
    }
    getUser()
  }

  const getUser = () => {
    const uid = localStorage.getItem("key")
    Axios.get(`http://localhost:5001/userInfo/${uid}`).then(res => {
      setUserLists(res.data.result)
    })
  }
  useEffect(() => {
    getUser()
  }, [])

  return (
    <div className='main'>
      <header className='main-headerCont'>
        <motion.h1 animate={{x: 1}} initial={{x: -100}} transition={{duration: .5}}>KJM</motion.h1>
        {userLists.map(list => (
          <motion.div className='header-leftCont' key={list.id} animate={{scale: 1, x: 1}} initial={{scale: 0, x: 100}} transition={{duration: .3}}>
            <span>{list.firstname} {list.lastname}</span>
            <div className='profile' onClick={manageAcc}>
              {list.profilePic ? (
                <img className='nav-pic' src={`http://localhost:5001/images/`+list.profilePic} alt="pic" />
              ) : (
                <FontAwesomeIcon className="user-icon" icon={faUser} />
              )}
            </div>
          </motion.div>
        ))}
      </header>

      <main className='main-cont'>
        {/* this are the notes container */}
        <LeftSide setIsShow={setIsShow} isShow={isShow} />
        {isShow && (
          <>
            {/* this is for dropdown main */}
            <motion.div className='right-side' animate={{height: 130}} initial={{height: 0}} transition={{duration: .3}}>
              <motion.h4 onClick={() => {setIsManageAcc(true)}} animate={{visibility: 'visible'}} initial={{visibility: 'hidden'}} transition={{delay: .2}}>
                <FontAwesomeIcon className='manage-acc-icon' icon={faUser} />Manage Account
              </motion.h4>
              <motion.h4 className='logout' onClick={handleLogout} animate={{scale: 1}} initial={{scale: 0}} transition={{duration: .1}}>
                <FontAwesomeIcon className='logout-icon' icon={faPowerOff} />Logout
              </motion.h4>
            </motion.div>

            {/* this is for dropdown manage account */}
            {isManageAcc && (
              <motion.div className='manage-acc' animate={{height: 460}} initial={{height: 0}} transition={{duration: .3}}>
                <motion.span  animate={{visibility: 'visible'}} initial={{visibility: 'hidden'}} transition={{delay: .2}}>
                  <FontAwesomeIcon className='arrow-left-icon' icon={faArrowLeft} onClick={() => {setIsShow(true);setIsManageAcc(false)}} />
                </motion.span>
                {userLists.map(list => (
                  <div key={list.id}>
                    <motion.div className="prof-cont" animate={{scale: [0,1.06,1]}}  transition={{duration: .7}}>
                      {list.profilePic ? (
                        // if user already have profile
                        <>
                          {file ? (
                            <>
                              <img src={URL.createObjectURL(file)} alt="pic" className='prof-img' />
                              <button className='save-prof-btn' onClick={() => handleUpload(list.id)}>save</button>
                              <button className='cancel-prof-btn' onClick={() => setFile(null)}>cancel</button>
                            </>
                          ) : (
                            <img src={`http://localhost:5001/images/`+list.profilePic} alt="pic" className='prof-img' />
                          )}
                        </>
                      ) : (
                        // if user dont have profile
                        <>
                          {file ? (
                            <>
                              <img src={URL.createObjectURL(file)} alt="pic" className='prof-img' />
                              <button className='save-prof-btn' onClick={() => handleUpload(list.id)}>save</button>
                              <button className='cancel-prof-btn' onClick={() => setFile(null)}>cancel</button>
                            </>
                          ) : (
                            <FontAwesomeIcon className="user-icon" icon={faUser} />
                          )}
                        </>
                      )}
                      <input type="file" id="input-file" style={{display: 'none'}} onChange={(e) => setFile(e.target.files[0])} />
                      <label htmlFor="input-file"  className='pic-update-icon'>
                        <FontAwesomeIcon icon={faPenNib} title="update" />
                      </label>
                      <p>{list.username}</p>
                    </motion.div>

                    {/* this is for firstname and lastname */}
                    <motion.span animate={{visibility: 'visible'}} initial={{visibility: 'hidden'}} transition={{delay: .3}}><hr /></motion.span>
                    <motion.div animate={{visibility: 'visible'}} initial={{visibility: 'hidden'}} transition={{delay: .4}}>
                      <div className='div one'>
                        <label>Firstname:</label>
                        {isUpdateFname ? (
                          <div>
                            <button onClick={() => handleSaveFname(list.id)}>save</button>
                            <span className='cancel-btn' onClick={() => {setIsUpdateFname(false);setUpdateFname("")}} title='cancel'><b>X</b></span>
                          </div>
                        ) : (
                          <FontAwesomeIcon className='update' icon={faPenNib} title="update" onClick={() => setIsUpdateFname(true)} />
                        )}
                      </div>
                      {isUpdateFname ? <input className='inp' value={updateFname}  onChange={(e) => setUpdateFname(e.target.value)} /> : <p className='p'>{list.firstname}</p>}
                    </motion.div>

                    <motion.div animate={{visibility: 'visible'}} initial={{visibility: 'hidden'}} transition={{delay: .5}}>
                      <div className='div'>
                        <label>Lastname:</label>
                        {isUpdateLname ? (
                          <div>
                            <button onClick={() => handleSaveLname(list.id)}>save</button>
                            <span className='cancel-btn' onClick={() => {setIsUpdateLname(false);setUpdateLname("") }} title='cancel'><b>X</b></span>
                          </div>
                        ) : (
                          <FontAwesomeIcon className='update' icon={faPenNib} title="update" onClick={() => setIsUpdateLname(true)} />
                        )}
                      </div>
                      {isUpdateLname ? <input className='inp' value={updateLname} onChange={(e) => setUpdateLname(e.target.value)} /> : <p className='p'>{list.lastname}</p>}
                    </motion.div>
                  </div>
                ))}
                
              </motion.div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Main
