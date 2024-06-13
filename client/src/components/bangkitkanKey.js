import { useEffect, useState} from "react"
import axios from "axios"
import { pubKey, privKey } from "../utils/rsaKey"

const BangkitkanKey = () => {
    const [fetchStatus, setFetchStatus] = useState(true)

    const [RC4Key, setRC4Key] = useState("")
    const [storedRC4Key, setStoredRC4Key] = useState("")
    
    const [publicKey, setPublicKey] = useState({
        e: 0,
        n: 0
    })
    const [privateKey, setPrivateKey] = useState({
        d: 0,
        n: 0
    })

    const generateRSAKey = () => {
        axios.post("http://localhost:8000/generate-rsa-key", {pubKey, privKey})
        .then((res) => {
            console.log(res.data)
            setFetchStatus(true)
        })
        .catch((error) => {
          console.log(error)
        })

    }

    const handleSubmitRC4Key = (event) => {
        event.preventDefault()

        axios.post("http://localhost:8000/set-rc4-key", {RC4Key})
        .then((res) => {
            console.log(res.data)
            setFetchStatus(true)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const handleInputRC4Key = (event) => {
        setRC4Key(event.target.value)
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
            axios.get("http://localhost:8000/get-rc4-key")
            .then((res) => {
                console.log(res.data)
                setStoredRC4Key(res.data)
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
                        Kunci RSA
                    </h1>
                    <div class = "flex flex-col">
                        <p class="block mb-2 font-medium text-gray-900 dark:text-white">Kunci Privat anda: {privateKey.d} {privateKey.n}</p>
                        <p class="block mb-2 font-medium text-gray-900 dark:text-white">Kunci Publik anda: {publicKey.e} {publicKey.n}</p>
                        <button class = "w-1/2 text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" onClick={generateRSAKey}>Bangkitkan Kunci</button>
                    </div>

                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Kunci RC4 dan AES
                    </h1>
                    <div>
                        <p class="block mb-2 font-medium text-gray-900 dark:text-white">Key: {storedRC4Key}</p>
                        <form class="space-y-4 md:space-y-6" onSubmit={handleSubmitRC4Key}>
                            <input type="key" name="key" id="key" onChange={handleInputRC4Key} class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Masukkan kunci..." required=""></input>
                            <button class = "w-1/2 text-white bg-blue-600 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Kirim Key</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BangkitkanKey;