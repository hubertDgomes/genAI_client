import axios from "axios";

const api = axios.create({
    baseURL: "https://genai-1cxp.onrender.com",
    withCredentials: true
})

const generateInterviewReport = async ({ resume, jobDescription, selfDescription }) => {
    const formData = new FormData()
    formData.append("resume", resume)
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)

    const response = await api.post("/api/interview", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data
}

const getAllUserInterviews = async () => {
    const response = await api.get(`/api/interview/getall`)
    return response.data
}

const getInterviewById = async (id) => {
    const response = await api.get(`/api/interview/get/${id}`)
    return response.data
}


export {
    generateInterviewReport,
    getInterviewById,
    getAllUserInterviews
}