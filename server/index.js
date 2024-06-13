const express = require("express")
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

//Storage
const multer  = require('multer')
const fs = require('fs')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'transcripts/');
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});
const upload = multer({storage: storage, preservePath: true})


const { jsPDF } = require("jspdf")
require('jspdf-autotable')

const {RC4Encrypt} =require("./utils/RC4")

const {Student, Course, Score, ConvertedScore} = require('./models')
const db = require('./models')

const port = 8000


const konversi = (nilai) => {
    switch(nilai){
        case "A":
            return 4
        case "AB":
            return 3.5
        case "B":
            return 3
        case "BC":
            return 2.5
        case "C":
            return 2
        case "D":
            return 1
        case "E":
            return 0
    }
}

let publicKey = {e: 0, n: 0}
let privateKey = {d: 0, n: 0}
let rc4Key = ""

let listDigitalSign = []

app.get("/select-mahasiswa", (req, res) => {
    Student.findAll().then((students) => {
        res.send(students)
    }).catch((err) => {
        console.log(err)
    })
})

app.post("/add-mahasiswa", (req, res) => {  
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

app.post("/add-matkul", (req, res) => {  
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

app.post("/add-nilai", (req, res) => {
    Score.findAll({where: {nim: req.body.nim, kode_matkul: req.body.kode_matkul}}).then((scores) => {
        if(scores.length === 0){ //nim dan kode matkul belum ada di score
            Score.create({
                nim: req.body.nim,
                kode_matkul: req.body.kode_matkul,
                nilai: req.body.nilai
            }).catch(err => {
                if (err){
                    console.log(err)
                }
            })
            
            ConvertedScore.create({
                nim: req.body.nim,
                kode_matkul: req.body.kode_matkul,
                konversi_nilai: konversi(req.body.nilai)
            }).catch(err => {
                if (err){
                    console.log(err)
                }
            })
            
            res.send(konversi_nilai)

        }else if(scores.length === 1){//nim dan kode matkul sudah ada di score
            Score.update(
                {nilai: req.body.nilai},
                {where: {nim: req.body.nim, kode_matkul: req.body.kode_matkul}}
                ).catch(err => {
                if (err){
                    console.log(err)
                }
            })
            
            ConvertedScore.update(
                {konversi_nilai: konversi(req.body.nilai)},
                {where: {nim: req.body.nim, kode_matkul: req.body.kode_matkul}}
                ).catch(err => {
                if (err){
                    console.log(err)
                }
            })
            
            res.send("Nilai telah di-update")
        }
    }).catch((err) => {
        console.log(err)
    })
})

app.get("/select-all-data-akademik", (req, res) => {
    db.sequelize.query
    ('SELECT scores.nim, nama, scores.kode_matkul, nama_matkul, sks, nilai, ipk FROM scores INNER JOIN students INNER JOIN courses WHERE scores.nim = students.nim AND scores.kode_matkul = courses.kode_matkul')
    .then((item) => {
       res.send(item[0])
})})

app.post("/generate-rsa-key", (req, res) => {
    publicKey = req.body.pubKey
    privateKey = req.body.privKey
    res.send("RSA Key telah di-generate")
})

app.get("/get-rsa-key", (req, res) => {
    res.send([publicKey, privateKey])
})

app.post("/set-rc4-key", (req, res) => {
    rc4Key = req.body.RC4Key
    res.send("RC4 Key telah di-set")
})

app.get("/get-rc4-key", (req, res) => {
    res.send(rc4Key)
})

app.post("/update-ipk", (req, res) => {
    listNIM = req.body.listNIM

    for(let i = 0; i < listNIM.length; i++){
        db.sequelize.query('SELECT ROUND(sum(konversi_nilai*sks)/sum(sks), 2) AS ipk FROM `convertedscores` INNER JOIN `courses` WHERE nim = :nim AND `convertedscores`.kode_matkul = `courses`.kode_matkul', {
            replacements: { nim: listNIM[i] },
        }).then((scores) => {
            Student.update(
                {ipk: scores[0][0]["ipk"]},
                {where: {nim: listNIM[i]}}
                ).catch(err => {
                if (err){
                    console.log(err)
                }
            })
        }).catch((err) => {
            console.log(err)
        })
    }
})

app.post("/update-digital-sign", (req, res) => {
    mhsw = req.body.mahasiswa

    if(!listDigitalSign.map(item => item.nim).includes(req.body.nim)){
        listDigitalSign.push({nim: req.body.nim, digital_sign: req.body.digitalSign})
    }else{
        let selectedNim = listDigitalSign.findIndex(item => item.nim === req.body.nim)
        listDigitalSign[selectedNim].digital_sign = req.body.digitalSign
    }

    Student.update(
        {digital_sign: req.body.digitalSign},
        {where: {nim: req.body.nim}}
        ).catch(err => {
        if (err){
            console.log(err)
        }
    })
})

app.post("/generate-pdf", upload.single('file'), (req, res) => {
    const doc = new jsPDF({orientation: "p", format: 'a4'});
    const mhsw = req.body.mahasiswa
    let dataAkademik = []

    db.sequelize.query
    ('SELECT SUM(sks) as jumlah_sks FROM scores INNER JOIN courses WHERE scores.kode_matkul = courses.kode_matkul AND scores.nim = :nim GROUP BY nim',
        {replacements: {nim: mhsw.nim}}
    )
    .then((item) => {
       let jumlahSKS = 0
       jumlahSKS = item[0][0].jumlah_sks

       db.sequelize.query
       ('SELECT DISTINCT scores.kode_matkul as "Kode mata kuliah", nama_matkul as "Nama mata kuliah", CAST(sks AS CHAR) as "SKS", nilai as "Nilai" FROM scores INNER JOIN students INNER JOIN courses WHERE scores.nim = :nim AND scores.kode_matkul = courses.kode_matkul',
           {replacements: {nim: mhsw.nim}}
       )
       .then((item) => {
            const destinationFilePath = 'transcripts/' + mhsw.nim + ".pdf"

           dataAkademik = item[0]
   
           let indent = 10
   
           let startingPosition = 10
           let lineSpacing = 7
       
           function addNewline(count){
               let i = 0
               while(i < count){
                   startingPosition += lineSpacing
                   i++
               }
           }
       
           doc.setFont("times")
           doc.setFontSize("12")
       
           doc.text("Program Studi Sistem dan Teknologi Informasi", indent, startingPosition);
           addNewline(1)
           doc.text("Sekolah Teknik Elektro dan Informatika", indent, startingPosition);
           addNewline(1)
           doc.text("Institut Teknologi Bandung", indent, startingPosition);
           addNewline(1)
           doc.text("----------------------------------------------------------", indent, startingPosition);
           addNewline(2)
           doc.text("Transkrip Akademik", 105, startingPosition, {align: "center"});
           addNewline(1)
           doc.text("Nama: " + mhsw.nama, 105, startingPosition, {align: "center"});
           addNewline(1)
           doc.text("NIM: " + mhsw.nim, 105, startingPosition, {align: "center"});
           addNewline(1)
           doc.setFont("times")
           doc.setFontSize("11")
           
           let header = ["No", "Kode mata kuliah", "Nama mata kuliah", "SKS", "Nilai"]
           doc.autoTable({
            head: [header],
            body: dataAkademik.map((obj, idx) => [idx + 1, ...header.slice(1).map(key => obj[key])]),
            startY: lineSpacing*10.5,
            headStyles: {
                fillColor: 120,
                textColor: [255, 255, 255],
                font: "times",
                fontStyle: 'bold'
            }
            ,
            styles: {
                font: "times"
            },
            theme: "grid"
            })
           addNewline((20/lineSpacing)*dataAkademik.length)

           doc.text("Total jumlah SKS: " + jumlahSKS, 105, startingPosition, {align: "center"});
           addNewline(1)
           doc.text("IPK: " + mhsw.ipk, 105, startingPosition, {align: "center"});
           addNewline(11)
           doc.text("Ketua Program Studi", indent, startingPosition);
           addNewline(1)
           doc.text("--Begin signature--", indent, startingPosition);
           addNewline(1)
           doc.text(mhsw.digital_sign, indent, startingPosition, {maxWidth: 100, lineHeightFactor: 1.5});
           addNewline(10)
           doc.text("--End signature--", indent, startingPosition);
           addNewline(1)
           doc.text("(Dr. I Gusti Bagus Baskara)", indent, startingPosition);
           
           let fileStream  = atob(doc.output('dataurlstring').split(",")[1])
           fileStream = RC4Encrypt(fileStream, rc4Key, 5, 3, "file")

           fs.writeFile(destinationFilePath, btoa(fileStream.join(",")), 'binary', err => { 
            if (err) {
              console.error(err)
              return
            }
          }) 
       })
    })
})

app.post("/decrypt-pdf", upload.single('file'), (req, res) => {
    const filename = req.body.data[0].split(".")[0]
    const extension = req.body.data[0].split(".")[1]
    let content = req.body.data[1]

    const destinationFilePath = 'transcripts/' + filename + "-decrypted." + extension

    content = content.split(",")

    for(let i = 0; i < content.length; i++){
        content[i] = String.fromCharCode(content[i])
      }
  
      fs.writeFile(destinationFilePath, content.join(""), 'binary', err => {
        if (err) {
          console.error(err)
          return
        }
      })
})

app.get("/get-digital-sign", (req, res) => {
    res.send(listDigitalSign)
})

app.delete("/delete-mahasiswa", (req, res) => {
    ConvertedScore.destroy({where: {nim: req.body.nim}})
    Score.destroy({where: {nim: req.body.nim}})
    Student.destroy({where: {nim: req.body.nim}})
    res.send("Berhasil menghapus mahasiswa")
})

app.delete("/delete-matkul", (req, res) => {
    ConvertedScore.destroy({where: {kode_matkul: req.body.kode_matkul}})
    Score.destroy({where: {kode_matkul: req.body.kode_matkul}})
    Course.destroy({where: {kode_matkul: req.body.kode_matkul}})
    res.send("Berhasil menghapus mata kuliah")
})

db.sequelize.sync().then((req) => {
    app.listen(port, () => {
        console.log("Server menyala")
    })
})


