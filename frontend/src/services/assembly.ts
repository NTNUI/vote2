import axios from "axios"


export const createAssembly = async (group: string) => {
    return axios.post("/assembly/",
    {
        group: group,
    },
    {withCredentials: true});
}

export const activateAssembly = async (group: string, isActive: boolean) => {
    return axios.put("/assembly/activation",
    {
        group: group,
        isActive: isActive,
    },
    {withCredentials: true});
}

export const deleteAssembly = async (group: string) => {
    return axios.delete("/assembly/",
    {
        data:{
            group: group,
        }
    });
}