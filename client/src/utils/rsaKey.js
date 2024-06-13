import { getKey } from "../utils/rsa"

const pubKey = {e: getKey().public, n: getKey().n}
const privKey = {d: getKey().private, n: getKey().n}

export {pubKey, privKey}