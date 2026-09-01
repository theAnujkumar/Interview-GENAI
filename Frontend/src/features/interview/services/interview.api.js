import axios from "axios"

const api = axios.create({
    baseURL : "http://localhost:3000",
    withCredentials: true,
})

/**
 * @description Service to generate interview report based on user self description, resume and job description.
 */

export const generateInterviewReport = async({ jobDescription, selfDescription, resumeFile }) => {
    // console.log("resume is " , resumeFile)
    // console.log("jobDescription is " , jobDescription)
    // console.log("selfDescription is " , selfDescription)
    const formData = new FormData()
    // left part backend and right frontend
    // backend me frontend data chala jayenga
    formData.append("jobDescription", jobDescription || "")
    formData.append("selfDescription", selfDescription || "")
    //formData.append("resume", resumeFile)

    //  Append file only if exists
    if (resumeFile) {
        formData.append("resume", resumeFile);
    }
    
    //console.log("formData is " , formData)
    // this will call to backend for receiving data/response

    //  Corrected API URL endpoint with leading slash
    const response = await api.post("/api/interview", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });

    console.log("response of generateInterviewReport of frontend " , response.data)
    // then backend give response of reports
    return response.data
}


/**
 * @description Service to get interview report by interviewId.
 */

// export const getInterviewReportById = async(interviewId) => {

//     console.log("interview id is " ,interviewId)
//     const response = await api.get(`/api/interview/report/${interviewId}`)

//     return response.data
// }
export const getInterviewReportById = async (interviewId) => {
    if (!interviewId) {
        return {
            success: false, 
            message: "Interview ID is missing" 
        };
    }

    try {
        //console.log("Fetching report for interview ID:", interviewId);
        const response = await api.get(`/api/interview/report/${interviewId}`);
        
        // return {
        //     success: true,
        //     data: response.data
        // };
        return response.data
    }
    catch (error) {
        console.error("Error in getInterviewReportById:", error.response?.data?.message || error.message);
        
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch interview report by Id",
            status: error.response?.status || 500
        };
    }
};

/**
 * @description Service to get all interview reports of logged in user.
 */
export const getAllInterviewReports = async () => {
    try{
        const response = await api.get("/api/interview/")

        return response.data
    }
    catch (error) {
        console.error("Error in getAllInterviewReports:", error.response?.data?.message || error.message);
        
        return {
            success: false,
            message: error.response?.data?.message || "Failed to fetch all interview report",
            status: error.response?.status || 500
        };
    }
}

/**
 * @description Service to generate resume pdf based on user self description, resume content and job description.
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    if (!interviewReportId) {
        return {
            success: false, 
            message: "interviewReport ID is missing" 
        };
    }
    try{
        const response = await api.post(`/api/interview/resume/pdf/${interviewReportId}`, null, {
        responseType: "blob"
        })

        return response.data
    }
    catch (error) {
        console.error("Error in generateResumePdf", error.response?.data?.message || error.message);
        
        return {
            success: false,
            message: error.response?.data?.message || "Failed to generate Resume Pdf",
            status: error.response?.status || 500
        };
    }
    
}

// these all api used to interact with backend