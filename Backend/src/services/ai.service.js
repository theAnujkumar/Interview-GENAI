//import { GoogleGenAI } from "@google/genai";
// to extract structure data from text using basic json schema like obj
//require("dotenv").config();
const {GoogleGenAI} = require("@google/genai");
const {z} = require("zod")
const {zodToJsonSchema} = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them"),
    
    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be asked in the interview"),
        intention: z.string().describe("The intention of interviewer behind asking this question"),
        answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them"),
    
    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),
    
    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively"),
    title: z.string().describe("The title of the job for which the interview report is generated"),
})

// it will generate the interview report by using ai model like gemini
async function generateInterviewReport({resume , selfDescription , jobDescription})
{
    const prompt = `Generate an interview report for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}
`
// 2.5 flash
    // try{
    //     const response = await ai.models.generateContent({
    //         model: "gemini-2.5-flash",
    //         contents: prompt,
    //         config: {
    //             responseMimeType: "application/json",
    //             responseSchema: zodToJsonSchema(interviewReportSchema),
    //         }
    //         })
    //         console.log("Raw gemini output ",response.text)
    //         return JSON.parse(response.text)
    // }

    try {
        const response = await ai.models.generateContent({
            // Correct official model name
            model: "gemini-3.5-flash", 
            // model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                // Passing Zod directly or clear schema
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        matchScore: { type: "NUMBER" },
                        title: { type: "STRING" },
                        technicalQuestions: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    question: { type: "STRING" },
                                    intention: { type: "STRING" },
                                    answer: { type: "STRING" }
                                }
                            }
                        },
                        behavioralQuestions: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    question: { type: "STRING" },
                                    intention: { type: "STRING" },
                                    answer: { type: "STRING" }
                                }
                            }
                        },
                        skillGaps: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    skill: { type: "STRING" },
                                    severity: { type: "STRING", enum: ["low", "medium", "high"] }
                                }
                            }
                        },
                        preparationPlan: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    day: { type: "NUMBER" },
                                    focus: { type: "STRING" },
                                    tasks: { type: "ARRAY", items: { type: "STRING" } }
                                }
                            }
                        }
                    }
                }
            }
        });

        console.log("Raw Gemini Output:", response.text);
        // this response would send to server or interview controller
        // to this interViewReportByAi
        return JSON.parse(response.text);

    }
    catch (error) {
        console.error("AI Generation Error:", error);
        throw new Error("Failed to generate report from Gemini AI");
    }

}

// async function generatePdfFromHtml(htmlContent)
// {
//     const browser = await puppeteer.launch()
//     const page = await browser.newPage();
//     await page.setContent(htmlContent, { waitUntil: "networkidle0" })

//     const pdfBuffer = await page.pdf({
//         format: "A4", margin: {
//             top: "20mm",
//             bottom: "20mm",
//             left: "15mm",
//             right: "15mm"
//         }
//     })

//     await browser.close()

//     return pdfBuffer
// }

async function generatePdfFromHtml(htmlContent) {
    let browser = null;

    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage" // Low-memory servers par crash rokta hai
            ]
        });

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: "networkidle0" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true, // CSS colors & styling retain karne ke liye
            margin: {
                top: "15mm",
                bottom: "15mm",
                left: "15mm",
                right: "15mm"
            }
        });

        return pdfBuffer;

    } catch (error) {
        console.error("Error generating PDF in Puppeteer:", error);
        throw error;
    } finally {
        // Safe cleanup: Error aaye ya na aaye, browser close zaroor hoga
        if (browser !== null) {
            await browser.close();
        }
    }
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) 
{
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    // we have to request only to server then server go to ai
    // by help of ai generate html
    try{
        const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
        })
        // it is html content
        const jsonContent = JSON.parse(response.text)

        // change into pdf from html
        // Convert HTML to PDF buffer using Puppeteer
        const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
        return pdfBuffer
    }
    catch (error) {
        console.error("Error in generateResumePdf AI service:", error);
        throw error;
    }
    
}

module.exports = {generateInterviewReport , generateResumePdf}


// async function invokeGeminiAi() {
//         const response = await ai.models.generateContent({
//         model: "gemini-3-flash-preview",
//         contents: "Hello gemini ! Explain what is Intterview ? "
//         })

//         console.log(response.text)
//     }

// module.exports = invokeGeminiAi;
// //export default invokeGeminiAi;

// ctrl+space

/*
pdf came with help of multer we can read pdf 
pdf ke data or content read karne ke liye pdf-parse
*/

// we have to request only to server then server go to ai
// by help of ai generate html
// with help of puppeter it will converted into pdf then pdf response send 
// from server to client
// ctrl + to show suggestions

/*
No Sandbox Flag (Server Crash): Server environment (Linux/Docker) par 
puppeteer.launch() bina --no-sandbox args ke process crash kar deta hai.

Missing browser.close() Safety: Agar page.pdf() ya setContent me koi 
error aati hai, toh browser.close() run nahi hoga. Isse background me
 headless Chrome processes accumulate honge aur RAM full ho jayegi.

Print Background Colors: Default PDF export me CSS background colors
 aur styled headers print nahi hote jab tak printBackground: true flag na lagaya jaye.
*/