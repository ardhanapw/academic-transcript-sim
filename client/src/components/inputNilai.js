import { useState, useEffect } from "react";
import axios from "axios"

const InputNilai = () => {
    const [listMahasiswa, setListMahasiswa] = useState([])
    const [listMatkul, setListMatkul] = useState([])

    const [selectedMahasiswa, setSelectedMahasiswa] = useState("")//NIM
    const [selectedMatkul, setSelectedMatkul] = useState("")

    const [score, setScore] = useState([{
        nim: 0,
        kode_matkul: "",
        nilai: ""
    }])
    const validScore = ["A", "AB", "B", "BC", "C", "D", "E"]

    const [mahasiswaDropdown, setMahasiswaDropdown] = useState("false")
    const [matkulDropdown, setMatkulDropdown] = useState("false")

    const [fetchStatus, setFetchStatus] = useState(true)

    useEffect(()=>{
        if(fetchStatus === true){
            axios.get("http://localhost:8000/select-mahasiswa")
            .then((res) => {
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
                setListMatkul(res.data)
            })
            .catch((error) => {
              console.log(error)
            })
            setFetchStatus(false)
        }
    
    }, [fetchStatus, setFetchStatus])

    const handleMahasiswaDropdown = (event) => {
        setMahasiswaDropdown(!mahasiswaDropdown)
    }

    const handleMatkulDropdown = (event) => {
        setMatkulDropdown(!matkulDropdown)
    }

    const handleSelectedMahasiswa = (item) => {
       setSelectedMahasiswa(item)
       setMahasiswaDropdown(false)
    }

    const handleSelectedMatkul = (item) => {
        setSelectedMatkul(item)
        setMatkulDropdown(false)
     }


    const handleInputNilai = (event) => { 
        setScore( {...score, nilai : event.target.value} )
    }

    const handleSubmitNilai = (event) => {
        event.preventDefault()

        let nilai = score.nilai
        let nim = selectedMahasiswa
        let kode_matkul = selectedMatkul

        axios.post("http://localhost:8000/add-nilai", {nim, kode_matkul, nilai})
        .then((res) => {
            console.log(res.data)
            setFetchStatus(true)
        })
        .catch((error) => {
          console.log(error)
        })

        setScore({
            nim: 0,
            kode_matkul: "",
            nilai: ""
        })

    }
    

    return (
        <>
            <div className="container">
                <form class="space-y-4 md:space-y-6" onSubmit={handleSubmitNilai}>
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Mahasiswa
                    </h1>
                    <div class="relative inline-block text-left">
                        <div>
                            <button onClick = {handleMahasiswaDropdown} type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                            {selectedMahasiswa}
                            <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                            </svg>
                            </button>
                        </div>
                        {(mahasiswaDropdown === true) && (
                            <div class="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                                <div class="py-1" role="none">
                                {
                                (listMahasiswa.map((item) =>
                                <p onClick = {() => handleSelectedMahasiswa(item.nim)} class="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">{item.nim} {item.nama}</p>
                                ))
                                }
                                </div>
                            </div>
                        )}
                    </div>

                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Mata Kuliah
                    </h1>
                    <div class="relative inline-block text-left">
                        <div>
                            <button onClick = {handleMatkulDropdown} type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50" id="menu-button" aria-expanded="true" aria-haspopup="true">
                            {selectedMatkul}
                            <svg class="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                            </svg>
                            </button>
                        </div>
                        {(matkulDropdown === true) && (
                            <div class="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                                <div class="py-1" role="none">
                                {
                                (listMatkul.map((item) =>
                                <p onClick = {() => handleSelectedMatkul(item.kode_matkul)} class="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">{item.kode_matkul} {item.nama_matkul}</p>
                                ))
                                }
                                </div>
                            </div>
                        )}
                    </div>

                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Nilai
                    </h1>
                    <div>
                        <input type="nim" name="nim" id="nim" onChange={handleInputNilai} value={score.nilai} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-1/4 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Masukkan nilai mahasiswa..." required=""></input>
                        {(!validScore.includes(score.nilai)) && (score.nilai !== "") && (
                            <b>Input yang dapat diterima: "A", "AB", "B", "BC", "C", "D", "E"</b>
                        )}
                    </div>
                    {(validScore.includes(score.nilai)) && (score.nilai !== undefined) && (selectedMahasiswa !== "") && (selectedMatkul !== "") && (
                        <button type="submit" class="w-full text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            Kirim
                        </button>
                    )}
                    {(!validScore.includes(score.nilai) || (score.nilai === undefined) || (selectedMahasiswa === "") || (selectedMatkul === "")) && (
                        <button disabled type="submit" class="w-full text-white bg-blue-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">
                            Kirim
                        </button>
                    )}
                    
                    
                </form>
            </div>
        </>
    )
}

export default InputNilai;