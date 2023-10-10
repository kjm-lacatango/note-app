const express = require('express')
const app = express()

const mysql = require('mysql')
const cors = require('cors')
const bcrypt = require('bcryptjs')
require('dotenv').config()
const multer = require('multer')
const path = require('path')

app.use(cors({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}))
app.use(express.json())
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'pass05',
    database: 'notedb'
})
app.use(express.static('public'))

// THESE IS FOR USERS TABLE
app.post('/auth/register', (req, res) => {
    const {fname, lname, username, password} = req.body

    db.query('SELECT * FROM users WHERE firstname = ? AND lastname = ? AND username = ?', [fname, lname, username], (err, result) => {
        if (err) console.log(err)
        if (result.length > 0) {
            res.json({error: "User already exists"})
        }
    })
    
    const salt = bcrypt.genSaltSync(10)
    const hashedPass = bcrypt.hashSync(password, salt)
    const q = 'INSERT INTO users (firstname, lastname, username, password) VALUES (?, ?, ?, ?)'
    db.query(q, [fname, lname, username, hashedPass], (err, result) => {
        if (err) console.log(err)
        db.query('SELECT * FROM users WHERE firstname = ? AND username = ?', [fname, username], (err, result) => {
            if (err) console.log(err)
            res.json({result: result})
        })
    })

})

app.post('/auth/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) console.log(err)
        if (result.length > 0) {
            const checkPass = bcrypt.compareSync(password, result[0].password)
            if (!checkPass) {
                res.json({auth: false, error: "Incorrect Password"})
            } else {
                res.json({auth: true, message: "Successfully login", result: result})
            }
        } else {
            res.json({auth: false, error: "User not found"})
        }
    })
})

app.get('/userInfo/:id', (req, res) => {
    const {id} = req.params
    db.query('SELECT * FROM users WHERE id = ?', id, (err, result) => {
        if (err) console.log(err)
        res.json({result: result})
    })
})

app.put('/user/fname/:id', (req, res) => {
    const {id} = req.params
    const fname = req.body.fname

    db.query('UPDATE users SET firstname = ? WHERE id = ?', [fname, id], (err, result) => {
        if (err) console.log(err)
        res.json({message: "Firstname updated successfully"})
    })
})

app.put('/user/lname/:id', (req, res) => {
    const {id} = req.params
    const lname = req.body.fname

    db.query('UPDATE users SET lastname = ? WHERE id = ?', [lname, id], (err, result) => {
        if (err) console.log(err)
        res.json({message: "Lastname updated successfully"})
    })
})

// this is for updating user's profile pic
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({
    storage: storage
})
app.post('/upload/profile/:id', upload.single('image'), (req, res) => {
    const {id} = req.params
    const image = req.file.filename

    db.query('UPDATE users SET profilePic = ? WHERE id = ?', [image, id], (err, result) => {
        if (err) console.log(err)
        res.json({message: 'Profile updated successfully'})
    })
})

// THESE IS FOR NOTES TABLE
app.post('/addNote', (req, res) => {
    const {title, note, uid} = req.body

    db.query('INSERT INTO notes (title, note, createdAt, uid) values (?, ?, current_date(), ?)', [title, note, uid], (err, result) => {
        if (err) console.log(err)
        res.json({message: "Insert succesfully"})
    })
})

app.get('/getNotes/:uid', (req, res) => {
    const {uid} = req.params

    db.query('SELECT * FROM notes WHERE uid = ?', uid, (err, result) => {
        if (err) console.log(err)
        res.json({result: result})
    })
})

app.delete('/delNote/:id', (req, res) => {
    const {id} = req.params

    db.query('DELETE FROM notes WHERE id = ?', id, (err, result) => {
        if (err) console.log(err)
        res.json({message: 'Deleted successfully'})
    })
})

app.put('/updateNote/:id', (req, res) => {
    const {id} = req.params
    const {newTitle, newNote} = req.body
    
    db.query('UPDATE notes SET title = ?, note = ?, createdAt = current_date() WHERE id = ?', [newTitle, newNote, id], (err, result) => {
        if (err) console.log(err)
        res.json({message: 'Updated Succesfully'})
    })
})

app.listen(process.env.PORT, () => console.log(`listening on port ${process.env.PORT}`))