function KSA(key){
    let larik = []
    let K = []
    let j = 0

    for(let i = 0; i < 256; i++){
        larik[i] = i
    }
    
    for(let i = 0; i < key.length; i++){
        K[i] = key.charCodeAt(i)
    }

    for(let i = 0; i < 256; i++){
        j = (j + larik[i] + K[i%K.length]) % 256
        //swap
        let temp = larik[j]
        larik[j] = larik[i]
        larik[i] = temp
    }

    //extended vigenere
    for(let i = 0; i < 256; i++){
        larik[i] = (larik[i] + K[i%K.length])
    }
    
    return larik
}

function PRGA(plaintext, larik){
    let i = 0
    let j = 0
    let u = []
    let t

    for(let idx = 0; idx < plaintext.length; idx++){
        i = (i+1)%256
        j = (j+larik[i])%256

        //swap
        let temp = larik[j]
        larik[j] = larik[i]
        larik[i] = temp

        t = (larik[i] + larik[j]) % 256
        u[idx] = larik[t]
    }

    return u
}

function RC4Encrypt(plaintext, key, slope, intercept, inputType){
    let c = []
    let keystream

    keystream = PRGA(plaintext, KSA(key))

    if(inputType === "file"){
        for(let i = 0; i < plaintext.length; i++){
            c[i] = keystream[i] ^ plaintext.charCodeAt(i)

            //affine
            c[i] = (slope * c[i] + intercept)
        }
    }
    else if(inputType === "text"){
        for(let i = 0; i < plaintext.length; i++){
            c[i] = keystream[i] ^ plaintext.charCodeAt(i)

            //affine
            c[i] = (slope * c[i] + intercept)
            c[i] = String.fromCharCode(c[i])
        } 
    }
    return c
}

function RC4Decrypt(ciphertext, key, slope, intercept, inputType){
    let p = []
    let c = []
    let keystream

    keystream = PRGA(ciphertext, KSA(key))

    if(inputType === "file"){
        c = ciphertext.split(",")    
        for(let i = 0; i < c.length; i++){
            //reversing the affine
            p[i] = (c[i]-intercept)/slope
            p[i] = p[i] ^ keystream[i]
        }
    } else if(inputType === "text"){
        for(let i = 0; i < ciphertext.length; i++){
            c[i] = ciphertext.charCodeAt(i)

            //reversing the affine
            p[i] = (c[i]-intercept)/slope
            p[i] = p[i] ^ keystream[i]
            p[i] = String.fromCharCode(p[i])
        }
    }
    return p
}

export {RC4Encrypt, RC4Decrypt}