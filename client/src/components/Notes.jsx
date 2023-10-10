import React, { useContext, useEffect, useState } from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTrash, faPenNib} from '@fortawesome/free-solid-svg-icons'
import Axios from 'axios'
import swal from 'sweetalert2'


function Notes({mynote, deleteNote, setNotes}) {
  const [newTitle, setNewTitle] = useState('')
  const [newNote, setNewNote] = useState('')
  const [isTog, setIsTog] = useState(true)
  const uid = localStorage.getItem('key')

  useEffect(() => {
    setNewTitle(mynote.title)
    setNewNote(mynote.note)
  },[])

  const updateNote = (id) => {
    Axios.put(`http://localhost:5001/updateNote/${id}`, {newTitle, newNote})
    .then(res => swal.fire('Success', res.data.message, 'success'))
    .catch(err => console.log(err))
    
    Axios.get(`http://localhost:5001/getNotes/${uid}`)
    .then(res => setNotes(res.data.result))
    .catch(err => console.log(err))

    setIsTog(true)
  }

  const handleUpdate = () => {
    setNewTitle(mynote.title)
    setNewNote(mynote.note)
    setIsTog(false)
  }
  const handleCancel = () => {
    setNewTitle('')
    setNewNote('')
    setIsTog(true)
  }

  return (
    <div>
        {isTog ? (
          <div className='my-note'>
            <h3>{mynote.title}</h3>
            <p>{mynote.note}</p>
            <div className='bot-note'>
              <span>{mynote.createdAt}</span>
              <div>
                <FontAwesomeIcon className='update-icon' icon={faPenNib}  title="update" onClick={handleUpdate} />
                <FontAwesomeIcon className='delete-icon' icon={faTrash}  title="delete" onClick={() => deleteNote(mynote.id)} />
              </div>
            </div>
          </div>
        ) : (
          <div className='my-note'>
            <input className='txt-title' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <textarea className='txt-note' value={newNote} onChange={(e) => setNewNote(e.target.value)} />
            <div className='bot-note'>
              <span>{mynote.createdAt}</span>
              <div>
                <button className='btn-save' onClick={() => updateNote(mynote.id)}>Save</button>
                <button className='btn-cancel' onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default Notes
