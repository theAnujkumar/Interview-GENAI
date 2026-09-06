require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")
//const invokeGeminiAi = require("./src/services/ai.service")
//import invokeGeminiAi from "./src/services/ai.service.js"


const PORT = process.env.PORT || 3000;

connectToDB()
//invokeGeminiAi()

app.get('/',(req,res) => {
    return res.json({
        success : true,
        message:'Your server is up and running....'
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// app.listen(PORT, () => {
//     console.log("Server is running on port 3000")
// })

