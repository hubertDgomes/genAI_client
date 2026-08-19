import { generateInterviewReport, getInterviewById, getAllUserInterviews } from "../services/interview.api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context"

const useInterview = () => {
    const context = useContext(InterviewContext)
    if (!context) {
        throw new Error("Interview context is not provided")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context

    const generateReport = async ({ resume, jobDescription, selfDescription }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ resume, jobDescription, selfDescription })
            // console.log(.user)
            setReport(response.interviewReport)
            return response.interviewReport


        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async (id) => {
        setLoading(true)
        try {
            const response = await getInterviewById(id)
            setReport(response.interviewReport)
            return response.interviewReport
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    }

    const getAllInterviews = async () => {
        setLoading(true)
        try {
            const response = await getAllUserInterviews()
            setReports(response.data)
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }

    }
    return {
        loading,
        report,
        reports,    
        generateReport,
        getReportById,
        getAllInterviews
    }

}

export default useInterview
