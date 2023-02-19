import axios from "axios"


export const createAssembly = async () => {
    return axios.post("/assembly/")
}

export const activateAssembly = async () => {
    return axios.put("/assembly/activation")
}

export const deleteAssembly = async () => {
    return axios.delete("/assembly/")
}