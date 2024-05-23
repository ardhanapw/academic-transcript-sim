import { useState, useEffect } from "react";
import axios from "axios"

const InputDataAkademik = () => {
    const [mahasiswa, setMahasiswa] = useState([])
    const [NIM, setNIM] = useState([])
    const [selectedMahasiswa, setSelectedMahasiswa] = useState("")
    const [isDropdownOpen, setIsDropdownOpen] = useState("false")
    const [fetchStatus, setFetchStatus] = useState(true)

    useEffect(()=>{
        if(fetchStatus === true){
            axios.get("http://localhost:8000/select-mahasiswa")
            .then((res) => {
                console.log(res.data)
                setMahasiswa(res.data)
                setNIM(res.data.map(getNIM))
            })
            .catch((error) => {
              console.log(error)
            })
            setFetchStatus(false)
        }
    
    }, [fetchStatus, setFetchStatus])

    /*
    const getMahasiswa = () => {
        axios.get('http://localhost:8000/select')
        .then((res) => {
            console.log(res.data)
            setMahasiswa(res.data)
            setFetchStatus(true)
        })
    }
    */
    const handleDropDown = (event) => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    const handleSelectedMahasiswa = (item) => {
       setSelectedMahasiswa(item)
       setIsDropdownOpen(false)
    }

    function getNIM(item) {
        return [item.id];
    }
    

    return (
        <>
            <div className="container">
            <div>
                <button onClick = {handleDropDown} class = "block h-8 w-8 rounded-full overflow-hidden border-2 border-gray-600 focus:outline-none focus:border-white">
                    <p>{selectedMahasiswa}</p>
                </button>
                {(isDropdownOpen === true) && (
                    <div class="mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
                    {
                    (NIM.map((item) =>
                    <p onClick = {() => handleSelectedMahasiswa(item)} class="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white">{item}</p>
                    ))
                    }
                    </div>
                )
                }

            </div>
                <p>Tabel berisi: [Kode&Nama Matkul, Indeks]</p><br/>
                <p>Tombol kirim</p><br/>
            </div>
        </>
    )
}

export default InputDataAkademik;