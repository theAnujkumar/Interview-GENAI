// const pdfParse = require("pdf-parse")
//const pdfParse = require("pdf-parse-fork");
//const PDFParser = require("pdf2json");
const { extractText } = require("unpdf");
const {generateInterviewReport , generateResumePdf} = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")


/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
    
async function generateInterViewReportController(req, res) {
    try {
        if (!req.file || !req.file.buffer) {
            return res.status(400).json({
                success: false,
                message: "File buffer not found. Please attach a valid PDF file."
            });
        }

        // 1. Extract Text using unpdf (Handles XRef & Stream Corruptions smoothly)
        const { text } = await extractText(new Uint8Array(req.file.buffer));
        
        // Agar array array format me mile toh join kar lein
        const resumeText = Array.isArray(text) ? text.join("\n") : text;

        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Could not extract text from PDF. File might be image-only/scanned."
            });
        }

        const { selfDescription, jobDescription } = req.body;

        console.log("PDF Text Extracted Successfully! Length:", resumeText.length);

        // 2. Call AI Service then take response from AI into server
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        // 3. Save to MongoDB
        const interviewReport = await interviewReportModel.create({
            user: req.user?._id || req.user?.id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        // 4. Return Success Response
        return res.status(201).json({
            success: true,
            message: "Interview report generated successfully.",
            interviewReport
        });
        // after that this response/interviewReport send to UI/frontend part

    } catch (error) {
        console.error("Error in generateInterViewReportController:", error);
        return res.status(500).json({
            success: false,
            message: "Unable to generate Interview report. Please try again.",
            error: error.message
        });
    }
}
// async function generateInterViewReportController(req,res)  {
//     try{

//         console.log("Req File:", req.file); // Buffer details dikhegi
//         console.log("Req Body:", req.body); // jobDescription, selfDescription dikhega

//         // 1. File Check
//         if (!req.file || !req.file.buffer) {
//             return res.status(400).json({
//                 success: false,
//                 message: "File buffer not found. Please attach a valid PDF file."
//             });
//         }
    
//     //const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
//     const parsedPdf = await pdfParse(req.file.buffer);
//     const resumeText = parsedPdf.text; // Extracted text yahan milta hai
//     const {selfDescription , jobDescription} = req.body

//     //console.log("resumeContent is " , resumeContent)
//     console.log("Extracted Resume Text:", resumeText.substring(0, 100) + "..."); // Print first 100 chars
//     console.log("jobDescription is " , jobDescription)
//     console.log("selfDescription is " , selfDescription)

//     const interViewReportByAi = await generateInterviewReport({
//         //resume : resumeContent.text,
//         resume : resumeText,
//         selfDescription,
//         jobDescription
//     })

//     const interviewReport = await interviewReportModel.create({
//         user: req.user?._id || req.user?.id, // Handles both _id and id safely
//         resume : resumeText,
//         //resume : resumeContent.text,
//         selfDescription,
//         jobDescription,
//         ...interViewReportByAi
//     })
    
//     res.status(201).json({
//         message: "Interview report generated successfully.",
//         interviewReport
//     })
    
//     }
//     catch(error)
//     {
//         console.error("Error in generateInterViewReportController:", error);
//         return res.status(500).json({
//             success:false,
//             message: "Unable to generate Interview report . please try again",
//             error : error.message
//         })
//     }
//     // try {
//     //     // Aapka AI / Gemini call logic
//     //     const report = await callGeminiApi(req.body); 

//     //     return res.status(200).json({ 
//     //         success: true, 
//     //         interviewReport: report 
//     //     });
//     // } catch (error) {
//     //     console.error("Backend Error Detail:", error.message);
        
//     //     // Always send structured error JSON instead of crashing
//     //     return res.status(500).json({ 
//     //         success: false, 
//     //         message: error.message || "Failed to generate interview report",
//     //         interviewReport: null // Explicitly pass null so client won't throw unexpected parsing errors
//     //     });
//     // }
// }


/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req,res) {

    try{
        const {interviewId} = req.params

        const interviewReport = await interviewReportModel.findOne({_id:interviewId , user: req.user.id})

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            })
        }

        res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        })
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({
            success:false,
            message: "Unable to generate Interview report by Id. please try again",
        })
    }
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */ 
async function getAllInterviewReportsController(req,res) {
    try{
        const interviewReports = await interviewReportModel.find({user: req.user.id}).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        })
    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({
            success:false,
            message: "Unable to get all Interview report of logged in user. please try again",
        })
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req,res) {

    try{
        const {interviewReportId} = req.params
        const interviewReport = await interviewReportModel.findById(interviewReportId)

        if(!interviewReport)
        {
            return res.status(404).json({
            message: "Interview report not found."
            })
        }

        const {resume , selfDescription , jobDescription} = interviewReport

        const pdfBuffer = await generateResumePdf({resume , selfDescription , jobDescription})

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        })

        res.send(pdfBuffer)
    }

    catch(err)
    {
        console.log(err);
        return res.status(500).json({
            success:false,
            message: "Unable to generate resume pdf. please try again",
        })
    }

}

module.exports = {generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
}