import { useEffect, useState} from "react"
import axios from "axios"
import { encrypt, decrypt } from "../utils/rsa";
import { RC4Encrypt } from "../utils/RC4";
import {keccak256} from 'js-sha3'

const TampilkanDataAkademik = () => {
    const [fetchStatus, setFetchStatus] = useState(true)
    const [mode, setMode] = useState("decrypted")

    const [listMahasiswa, setListMahasiswa] = useState([])
    const [listDataAkademik, setListDataAkademik] = useState([])
    const [listDigitalSign, setListDigitalSign] = useState([])
    const listNIM = listMahasiswa.map((item) => (item.nim))

    const [publicKey, setPublicKey] = useState({
        e: 0,
        n: 0
    })
    const [privateKey, setPrivateKey] = useState({
        d: 0,
        n: 0
    })
    const [RC4Key, setRC4Key] = useState("")
    const [isVerified, setIsVerified] = useState([])

    const allField = {}

    const handleMode = (event) => {
        if(event.target.checked === true){
            setMode("encrypted")
        }else{
            setMode("decrypted")
        }
    }

    const createAllField = (key) => {
        allField[key] = []
    }

    const handleAllField = (key, value) => {
        allField[key].push(value)
    }

    const handleDigitalSign = (nim) => {
        let hash = keccak256(allField[nim].join("").split(",").join(""))
        let digitalSign = encrypt(hash, publicKey.e, publicKey.n)

        axios.post("http://localhost:8000/update-digital-sign", {digitalSign, nim})
        .then((res) => {
            console.log(res.data)
            setFetchStatus(true)
        })
        .catch((error) => {
          console.log(error)
        })

    }

    const verifyDigitalSign = (mahasiswa) => {
        

        if(listDigitalSign.map(item => item.nim).includes(mahasiswa.nim)){
            let selectedNim = listDigitalSign.findIndex(item => item.nim === mahasiswa.nim)

            let hash = keccak256(allField[mahasiswa.nim].join("").split(",").join(""))
            let decrypted = decrypt(listDigitalSign[selectedNim].digital_sign, privateKey.d, privateKey.n)
            
            if(!isVerified.map(item => item.nim).includes(mahasiswa.nim)){
                setIsVerified([...isVerified, {nim: mahasiswa.nim, verified: (hash === decrypted)}])
            }else{
                let selectedNim = isVerified.findIndex(item => item.nim === mahasiswa.nim)
                isVerified[selectedNim].verified = (hash === decrypted)
            }
        }
    }

    const generatePDF = (mahasiswa) => {
        axios.post("http://localhost:8000/generate-pdf", {mahasiswa})
        .then((res) => {
            console.log(res.data)
            setFetchStatus(true)
        })
        .catch((error) => {
            console.log(error)
        })
    }

    const checkIsVerified = (mahasiswa) => {
        if(isVerified.map((item) => (item.nim)).includes(mahasiswa.nim)){
            return isVerified[isVerified.findIndex(item => item.nim === mahasiswa.nim)].verified
        }
    }

    useEffect(()=>{
        if(fetchStatus === true){
            axios.get("http://localhost:8000/get-rsa-key")
            .then((res) => {
                console.log(res.data)
                setPublicKey(res.data[0])
                setPrivateKey(res.data[1])
            })
            .catch((error) => {
              console.log(error)
            })
            setFetchStatus(false)
        }
    
    }, [fetchStatus, setFetchStatus])

    useEffect(()=>{
        if(fetchStatus === true){
            axios.get("http://localhost:8000/get-digital-sign")
            .then((res) => {
                console.log(res.data)
                setListDigitalSign(res.data)
            })
            .catch((error) => {
              console.log(error)
            })
            setFetchStatus(false)
        }
    
    }, [fetchStatus, setFetchStatus])

    useEffect(()=>{
        if(fetchStatus === true){
            axios.get("http://localhost:8000/pilih-mahasiswa")
            .then((res) => {
                console.log(res.data)
                setListMahasiswa(res.data)
            })
            .catch((error) => {
              console.log(error)
            })
            setFetchStatus(false)
        }
    
    }, [fetchStatus, setFetchStatus])

    useEffect(()=>{
        if(fetchStatus === true){
            axios.get("http://localhost:8000/semua-data-akademik")
            .then((res) => {
                console.log(res.data)
                setListDataAkademik(res.data)
            })
            .catch((error) => {
              console.log(error)
            })
            setFetchStatus(false)
        }
    
    }, [fetchStatus, setFetchStatus])

    useEffect(()=>{
        if(fetchStatus === false){
            axios.post("http://localhost:8000/tambah-ipk", {listNIM})
            .then((res) => {
                console.log(res.data)
            })
            .catch((error) => {
              console.log(error)
            })
        }
    }, [fetchStatus, setFetchStatus, listNIM])

    useEffect(()=>{
        if(fetchStatus === true){
            axios.get("http://localhost:8000/get-rc4-key")
            .then((res) => {
                console.log(res.data)
                setRC4Key(res.data)
            })
            .catch((error) => {
              console.log(error)
            })
            setFetchStatus(false)
        }
    
    }, [fetchStatus, setFetchStatus])

    useEffect(() => {
        console.log(isVerified)
    }, [isVerified])


    return (
        <>
            <div className="container">
                <label>
                    <input class="mx-2 my-2" type="checkbox" onClick={handleMode}></input>
                    Encrypt
                </label>

                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    {
                        (listMahasiswa.map((mahasiswa) =>
                        <div>
                            {createAllField(mahasiswa.nim)}
                            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                    {mahasiswa.nim} - {mahasiswa.nama}
                            </h1>
                            <table class="my-6 min-w-full bg-white border border-gray-500 rounded-lg overflow-x-auto">
                                <thead class="bg-gray-300">
                                    <tr>
                                    <th class = "py-3">Kode Mata Kuliah</th>
                                    <th class = "py-3">Nama Mata Kuliah</th>
                                    <th class = "py-3">SKS</th>
                                    <th class = "py-3">Nilai</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(mode === "decrypted") &&
                                    (listDataAkademik.filter(item => item.nim === mahasiswa.nim).map((item) =>
                                        <tr class="border-t border-gray-500 hover:bg-blue-100">
                                            <td class="px-4 py-4">{item.kode_matkul}</td>
                                            <td class="px-4 py-4">{item.nama_matkul}</td>
                                            <td class="px-4">{item.sks}</td>
                                            <td class="px-4">{item.nilai}</td>
                                            {handleAllField(mahasiswa.nim, [item.kode_matkul, item.nama_matkul, item.sks, item.nilai])}
                                        </tr>
                                    ))
                                    }
                                    {(mode === "encrypted") &&
                                    (listDataAkademik.filter(item => item.nim === mahasiswa.nim).map((item) =>
                                        <tr class="border-t border-gray-500 hover:bg-blue-100">
                                            <td class="px-4 py-4">{RC4Encrypt(item.kode_matkul, RC4Key, 5, 3, "text")}</td>
                                            <td class="px-4 py-4">{RC4Encrypt(item.nama_matkul, RC4Key, 5, 3, "text")}</td>
                                            <td class="px-4 py-4">{RC4Encrypt(item.sks.toString(), RC4Key, 5, 3, "text")}</td>
                                            <td class="px-4 py-4">{RC4Encrypt(item.nilai, RC4Key, 5, 3, "text")}</td>
                                            {handleAllField(mahasiswa.nim, [item.kode_matkul, item.nama_matkul, item.sks, item.nilai])}

                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                            <div class="break-words">
                                <b>Digital sign: {encrypt(keccak256(allField[mahasiswa.nim].join("").split(",").join("")), publicKey.e, publicKey.n)}</b>
                            </div>

                            <div class = "flex py-4">
                                <button onClick = {() => handleDigitalSign(mahasiswa.nim)} class="w-1/2 text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign</button>
                                {(listDigitalSign.map((item) => (item.nim)).includes(mahasiswa.nim)) && (
                                    <button onClick = {() => verifyDigitalSign(mahasiswa)} class="w-1/2 text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Verifikasi</button>
                                )}
                                {(!listDigitalSign.map((item) => (item.nim)).includes(mahasiswa.nim)) && (
                                    <button disabled class="w-1/2 text-white bg-blue-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Verifikasi</button>
                                )}
                                {(checkIsVerified(mahasiswa)) && (
                                    <button onClick = {() => generatePDF(mahasiswa)} class="w-1/2 text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Unduh</button>
                                )}
                                {(!checkIsVerified(mahasiswa)) && (
                                <button disabled class="w-1/2 text-white bg-blue-100 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 mx-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Unduh</button>
                                )}
                                
                            </div>
                            {(checkIsVerified(mahasiswa)) && (
                                <div class="px-2 py-2">
                                    <b class="text-green-500">Verifikasi data {mahasiswa.nim} berhasil!</b>
                                </div>
                            )}
                        </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default TampilkanDataAkademik;