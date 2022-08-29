import { baseUrl as axios } from "./axios"

export const uploadFile = async (file) => {
    console.log("uploading")
    const formData = new FormData()

    if (file.type.includes("image")) {
        formData.append("image", file)
    }

    if (file.type.includes("video")) {
        formData.append("video", file)
    }

    if (file.type.includes("audio")) {
        formData.append("audio", file)
    }

    try {
        const { data } = await axios.post("/api/uploads", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        console.log(data)
        return data
    } catch (err) {
        console.log(err)
        return err
    }
}

export const addNewCollection = async (data) => {
    console.log("adding collection")
    try {
        const { data: res } = await axios.post("/collections", data)

        console.log("success collection")

        return res
    } catch (err) {
        console.log(err)
        return err
    }
}

export const handlePostRequest = async (url = "", data = {}, options = {}) => {
    try {
        const { data: res } = await axios.post(url, data, options)

        return res
    } catch (err) {
        console.log(err)
    }
}

export const handlePutRequest = async (url = "", data = {}, options = {}) => {
    try {
        const { data: res } = await axios.put(url, data, options)

        return res
    } catch (err) {
        console.log(err)
    }
}

export const handleGetRequest = async (url = "", options = {}) => {
    try {
        const { data } = await axios.get(url, options)

        return data
    } catch (err) {
        console.log(err)
    }
}
