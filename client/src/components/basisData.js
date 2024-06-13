import { useState, useEffect } from "react";
import axios from "axios"

const BasisData = () => {
    const [listMahasiswa, setListMahasiswa] = useState([])
    const [listMatkul, setListMatkul] = useState([])
    const listNIM = listMahasiswa.map((item) => (item.nim))

    const [mahasiswa, setMahasiswa] = useState({
        nim: 0,
        nama: "",
    })
    const [matkul, setMatkul] = useState({
        kode_matkul: "",
        nama_matkul: "",
        sks: 0
    })

    const [fetchStatus, setFetchStatus] = useState(true)

    const handleDeleteMahasiswa = (mahasiswa) => {
        axios.delete("http://localhost:8000/delete-mahasiswa", {data: {nim: mahasiswa.nim}})
            .then((res) => {
                console.log(res.data)
                setFetchStatus(true)
            })
            .catch((error) => {
              console.log(error)
            })
    }

    const handleDeleteMatkul = (matkul) => {
        axios.delete("http://localhost:8000/delete-matkul", {data: {kode_matkul: matkul.kode_matkul}})
            .then((res) => {
                console.log(res.data)
                setFetchStatus(true)
            })
            .catch((error) => {
              console.log(error)
        })
        
    }

    const handleSubmitMahasiswa = (event) => {
        event.preventDefault()

        if(!listNIM.includes(parseInt(mahasiswa.nim))){
            let {nama, nim} = mahasiswa

            axios.post("http://localhost:8000/add-mahasiswa", {nama, nim})
            .then((res) => {
                console.log(res.data)
                setFetchStatus(true)
            })
            .catch((error) => {
              console.log(error)
            })
    
            setMahasiswa({
                nim: 0,
                nama: ""
            })
        }
    }

    const handleSubmitMatkul = (event) => {
        event.preventDefault()

        let {nama_matkul, kode_matkul, sks} = matkul

        axios.post("http://localhost:8000/add-matkul", {nama_matkul, kode_matkul, sks})
        .then((res) => {
            console.log(res.data)
            setFetchStatus(true)
        })
        .catch((error) => {
          console.log(error)
        })

        setMatkul({
            kode_matkul: "",
            nama_matkul: "",
            sks: 0
        })

    }

    const handleInputMahasiswa = (event) => {
        let name = event.target.name
        let value = event.target.value

        if(name === "nama"){
            setMahasiswa( {...mahasiswa, nama : value} )
        }else if(name === "nim"){
            setMahasiswa( {...mahasiswa, nim : value} )
        }
    }

    const handleInputMatkul = (event) => {
        let name = event.target.name
        let value = event.target.value

        if(name === "nama_matkul"){
            setMatkul( {...matkul, nama_matkul : value} )
        }else if(name === "kode_matkul"){
            setMatkul( {...matkul, kode_matkul : value} )
        }else if(name === "sks"){
            setMatkul( {...matkul, sks : value} )
        }
    }

    useEffect(()=>{
        if(fetchStatus === true){
            axios.get("http://localhost:8000/select-mahasiswa")
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
            axios.get("http://localhost:8000/select-matkul")
            .then((res) => {
                console.log(res.data)
                setListMatkul(res.data)
            })
            .catch((error) => {
              console.log(error)
            })
            setFetchStatus(false)
        }
    
    }, [fetchStatus, setFetchStatus])

    return (
        <>
            <div className="container">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Tambahkan Mahasiswa
                    </h1>
                    <form class="space-y-4 md:space-y-6" onSubmit={handleSubmitMahasiswa}>
                        <div>
                            <label for="nama" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama</label>
                            <input type="nama" name="nama" id="nama" onChange={handleInputMahasiswa} value={mahasiswa.nama} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Masukkan nama mahasiswa.." required=""></input>
                        </div>
                        <div>
                            <label for="nim" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">NIM</label>
                            <input type="nim" name="nim" id="nim" onChange={handleInputMahasiswa} value={mahasiswa.nim} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Masukkan NIM mahasiswa.." required=""></input>
                        </div>
                        {(listNIM.includes(parseInt(mahasiswa.nim)) ? 
                        <p class = "text-red-500">NIM sudah digunakan!</p>
                        :
                        <></>
                        )}
                        <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Tambahkan Mahasiswa</button>
                    </form>
                </div>
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Tambahkan Mata Kuliah
                    </h1>
                    <form class="space-y-4 md:space-y-6" onSubmit={handleSubmitMatkul}>
                        <div>
                            <label for="nama_matkul" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nama Mata Kuliah</label>
                            <input type="nama_matkul" name="nama_matkul" id="nama_matkul" onChange={handleInputMatkul} value={matkul.nama_matkul} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Masukkan nama mata kuliah.." required=""></input>
                        </div>
                        <div>
                            <label for="kode_matkul" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Kode Mata Kuliah</label>
                            <input type="kode_matkul" name="kode_matkul" id="kode_matkul" onChange={handleInputMatkul} value={matkul.kode_matkul} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Masukkan kode mata kuliah.." required=""></input>
                        </div>
                        <div>
                            <label for="sks" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">SKS Mata Kuliah</label>
                            <input type="sks" name="sks" id="sks" onChange={handleInputMatkul} value={matkul.sks} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Masukkan SKS.." required=""></input>
                        </div>
                        <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Tambahkan Mata Kuliah</button>
                    </form>
                </div>

                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Tabel Mahasiswa
                    </h1>
                    <table class="w-1/2 bg-white border border-gray-500 rounded-lg overflow-x-auto">
                        <thead class="bg-gray-300">
                            <tr>
                            <th class="px-3 py-3">NIM</th>
                            <th class="px-3 py-3">Nama</th>
                            <th class="px-3 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            (listMahasiswa.map((item) =>
                            <tr class="border-t border-gray-500 hover:bg-blue-100">
                            <td class="px-3 py-3">{item.nim}</td>
                            <td class="px-3 py-3">{item.nama}</td>
                            <td class="px-3 py-3">
                                <button onClick={() => handleDeleteMahasiswa(item)} class="px-2 py-2 rounded-lg w-full text-white bg-red-600 hover:bg-red-800">
                                    <b>Hapus</b>
                                </button>
                            </td>
                            </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>

                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Tabel Mata Kuliah
                    </h1>
                    <table class="w-2/3 bg-white border border-gray-500 rounded-lg overflow-x-auto">
                        <thead class="bg-gray-300">
                            <tr>
                            <th class="px-3 py-3">Kode Mata Kuliah</th>
                            <th class="px-3 py-3">Nama Mata Kuliah</th>
                            <th class="px-3 py-3">SKS</th>
                            <th class="px-3 py-3">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            (listMatkul.map((item) =>
                            <tr class="border-t border-gray-500 hover:bg-blue-100">
                            <td class="px-3 py-3">{item.kode_matkul}</td>
                            <td class="px-3 py-3">{item.nama_matkul}</td>
                            <td class="px-3 py-3">{item.sks}</td>
                            <td class="px-3 py-3">
                                <button onClick={() => handleDeleteMatkul(item)} class="px-2 py-2 rounded-lg w-full text-white bg-red-600 hover:bg-red-800">
                                    <b>Hapus</b>
                                </button>
                            </td>
                            </tr>
                            ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default BasisData;