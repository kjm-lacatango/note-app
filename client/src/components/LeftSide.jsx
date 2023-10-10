import React, {useContext, useEffect, useState} from 'react'
import Note from './Notes'
import Axios from 'axios'
import swal from 'sweetalert2'
import {motion} from 'framer-motion'

const LeftSide = (setIsShow, isShow) => {
  const [notes, setNotes] = useState([])
  const [isAdd, setIsAdd] = useState(false)
  const [title, setTitle] = useState("")
  const [note, setNote] = useState("")
  const uid = localStorage.getItem('key')
  const [search, setSearch] = useState('')

    const handleSaveNote = () => {
      if (title.trim() !== "" && note.trim() !== "") {
        Axios.post('http://localhost:5001/addNote', {title, note, uid})
        .then(res => swal.fire('Success', res.data.message, 'success'))
        .catch(err => console.log(err))

        setTitle("")
        setNote("")
        getNotes()
        setIsAdd(false)
      } else {
        swal.fire('Information', 'All fields are required', 'info')
      }
    }

    const deleteNote = (id) => {
      swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this note',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then(result => {
        if (result.isConfirmed) {
          Axios.delete(`http://localhost:5001/delNote/${id}`)
          .then(res => {
            getNotes()
            swal.fire('Deleted', res.data.message, "success")
          })
          .catch(err => console.log(err))
        } 
      })
    }

    const getNotes = () => {
      Axios.get(`http://localhost:5001/getNotes/${uid}`)
      .then(res => setNotes(res.data.result))
      .catch(err => console.log(err))
    }
    useEffect(() => {
      getNotes()
    }, [])

  return (
    <div className={setIsShow.isShow ? 'left-side blur-active' : 'left-side'  } onClick={() => setIsShow.setIsShow(false)}>
      <div className='main-top'>
        <motion.h1 animate={{scale: [0,1.3,1]}}  transition={{duration: .8, delay: .7}}>My Notes</motion.h1>
        <motion.span animate={{scale: 1}} initial={{scale: 0}} transition={{duration: .3, delay: .7}}>
          <input className='search' placeholder='Search Title...' onChange={(e) => setSearch(e.target.value)} />
        </motion.span>
      </div>
 
      <motion.div className='note-cont' animate={{y: 1, scale: 1}} initial={{y: -500, scale: 0}} transition={{duration: .3, delay: .4}}>
        {/* this is for search */}
        {notes.filter(n => (
          search.toLowerCase() === '' ? n : n.title.toLowerCase().includes(search)
        )).map(mynote => (
          <Note key={mynote.id} mynote={mynote} deleteNote={deleteNote} setNotes={setNotes} /> 
        ))}
        
        {/* this is for creating note */}
        {isAdd ? (
          <div className='create-note'>
            <input className='title' placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className='text-note' placeholder="Enter Note..." value={note} onChange={(e) => setNote(e.target.value)} />
            <div className='bot-btn'>
              <button className='save' onClick={handleSaveNote}>Save</button>
              <button className='cancel' onClick={() => setIsAdd(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className='add-note' onClick={() => setIsAdd(true)}>
            <span className='plus'><b>+</b></span>
            <span className="add">Add Note</span>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default LeftSide
