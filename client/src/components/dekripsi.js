import { useState } from "react";
import axios from "axios";
import { RC4Decrypt } from "../utils/RC4";

const Dekripsi = () => {
    const [enteredKey, setEnteredKey] = useState("")
    const [isKeyValid, setIsKeyValid] = useState("")

    const [file, setFile] = useState()
    const [fetchStatus, setFetchStatus] = useState(true)

    const handleFile = (event) => {
        setFile(event.target.files[0])
    }

    const decryptFile = () => {
        let reader = new FileReader()
        reader.readAsText(file)

        reader.onload = function() {
            let content = reader.result

            content = atob(content)
            content = RC4Decrypt(content, enteredKey, 5, 3, "file")
            const fileSignature = [37, 80, 68, 70, 45] //%PDF-
            
            if(content.slice(0,5).every((value, idx) => value === fileSignature[idx])){
                setIsKeyValid("valid")
                const formData = new FormData()
                formData.append('data', file.name)
                formData.append('data', content)
    
                axios.post('http://localhost:8000/decrypt-pdf', formData)
                .then((res) => {
                    console.log(res)
                    setFetchStatus(true)
                })
            }else{
                setIsKeyValid("invalid")
            }

        };

        reader.onerror = function() {
            console.log(reader.error)
        };


    }

    return (
        <div className="container">
            <h1>
            <b>File</b>
            </h1>
            <input type = "file" name = "file" onChange = {(e) => handleFile(e)}/>
            <div class = "my-2">
                <h1>
                <b>Key</b>
                </h1>
                <textarea class="w-1/2 border border-gray-300" value = {enteredKey} onChange={(e) => setEnteredKey(e.target.value)} maxLength="256" rows = "2" placeholder="Your key here.."/>
            </div>
            <button type = "button" class = "bg-blue-500 text-white font-bold my-2 py-2 px-2" onClick={decryptFile}>
                    Submit
            </button>
            {(isKeyValid === "valid") && (
                <p class = "text-green-500">
                    Kunci valid!
                </p>
            )}
            {(isKeyValid === "invalid") && (
                <p class = "text-red-500">
                    Kunci tidak valid!
                </p>
            )}
        </div>
    )
}

export default Dekripsi;