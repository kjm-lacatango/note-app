import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import swal from 'sweetalert2'
import {motion} from 'framer-motion'

function Register() {
    const navigate = useNavigate()
    const [fname, setFname] = useState("")
    const [lname, setLname] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPass, setConfirmPass] = useState("")

    const handleReg = (e) => {
      e.preventDefault()
      if (password === confirmPass) {
        Axios.post('http://localhost:5001/auth/register', {fname, lname, username, password})
          .then(res => {
            if (res.data.error) {
              swal.fire('Error!', res.data.error, 'error')
            } else {
              localStorage.setItem("key", res.data.result[0].id)
              navigate("/main")
              setFname("")
              setLname("")
              setUsername("")
              setPassword("")
              setConfirmPass("")
            }
          })
      } else {
        swal.fire('Error!', "password not match", 'error')
      }
    }
    
    useEffect(() => {
      const uid = localStorage.getItem("key")
      if (uid) {
        Axios.get(`http://localhost:5001/userInfo/${uid}`).then(res => {
          if (res.data.result.length > 0) {
            navigate("/main")
          }
        })
      }
    }, [])

  return (
    <div className='auth'>
      <motion.form onSubmit={handleReg} animate={{scale: 1}} initial={{scale: 0}}>
        <h1>Sign Up</h1>
        <input placeholder='Firstname' value={fname} onChange={(e) => setFname(e.target.value)} required />
        <input placeholder='Lastname' value={lname} onChange={(e) => setLname(e.target.value)} required />
        <input placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <input type="password" placeholder='Confirm Password' value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required />
        <div>
          <p><i>Already have an account?</i> <span onClick={() => navigate("/login")}>Login</span></p>
        </div>
        <button type="submit">Register</button>
      </motion.form>
    </div>
  )
}

export default Register
