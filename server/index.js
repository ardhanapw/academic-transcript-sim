const express = require("express")
//const mysql = require("mysql")

const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

/*
const db = mysql.createConnection({
    host: "localhost",
    database: "academic_transcript",
    user: "root",
    password: ""
})
*/

const {Student, Course} = require('./models')

const db = require('./models')

const port = 8000

app.get("/select-mahasiswa", (req, res) => {
    Student.findAll().then((students) => {
        res.send(students)
    }).catch((err) => {
        console.log(err)
    })
})

app.post("/insert-mahasiswa", (req, res) => {  
    Student.create({
        nim: req.body.nim,
        nama: req.body.nama
    }).catch(err => {
        if (err){
            console.log(err)
        }
    })
    res.send("Mahasiswa telah ditambahkan")
})

app.get("/select-matkul", (req, res) => {
    Course.findAll().then((courses) => {
        res.send(courses)
    }).catch((err) => {
        console.log(err)
    })
})

app.post("/insert-matkul", (req, res) => {  
    Course.create({
        kode_matkul: req.body.kode_matkul,
        nama_matkul: req.body.nama_matkul,
        sks: req.body.sks
    }).catch(err => {
        if (err){
            console.log(err)
        }
    })
    res.send("Mata kuliah telah ditambahkan")
})

app.post("/test-insert", (req, res) => {
    console.log(req.body.nim, req.body.nama)
    res.send("Inserted")
})

app.post("/insert-course", (req, res) => {
    Course.create({
        kode_matkul: II101,
        nama_matkul: "Rusdi",
        SKS: 3
    }).catch(err => {
        if (err){
            console.log(err)
        }
    })
    res.send("Inserted")
})

app.delete("/delete", (req, res) => {
    Student.destroy({where: {id: 2}})
    res.send("Deleted")
})

/*
db.connect((err) => {
    if(err){
        throw err
    }

    console.log("Database terhubung")

    db.query("select * from mahasiswa", (err, result) => {
        console.log(result)
    })

    app.get("/", (req, res) => {
        res.send("GET result")
    })
})
*/

db.sequelize.sync().then((req) => {
    app.listen(port, () => {
        console.log("Server menyala")
    })
})


