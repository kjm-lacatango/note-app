import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Axios from 'axios'
import swal from 'sweetalert2'
import {motion} from 'framer-motion'

function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (e) => {
    e.preventDefault()
    Axios.post('http://localhost:5001/auth/login', {username: username, password: password}).then(res => {
      if (res.data.error || !res.data.auth) {
        swal.fire('Error!', res.data.error, 'error')
      } else {
        localStorage.setItem("key", res.data.result[0].id)
        navigate("/main")
        setUsername("")
        setPassword("")
      }
    })
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
      <motion.form onSubmit={handleLogin} animate={{scale: 1}} initial={{scale: 0}}>
        <h1>Login</h1>
        <input placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div>
          <p><i>Don't have an account?</i> <span onClick={() => navigate("/register")}>Register</span></p>
        </div>
        <button type="submit">Login</button>
      </motion.form>
    </div>
  )
}

export default Login
