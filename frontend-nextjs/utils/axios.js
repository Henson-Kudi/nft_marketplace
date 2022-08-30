import axios from "axios"

const baseURL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api"
// above method should be used if deploying to thesame server

// const baseURL = "http://localhost:5000/api"

export const baseUrl = axios.create({
    baseURL: baseURL,
    headers: {
        accept: "*/*",
        "Content-Type": "application/json",
    },
})
