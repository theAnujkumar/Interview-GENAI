require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")
//const invokeGeminiAi = require("./src/services/ai.service")
//import invokeGeminiAi from "./src/services/ai.service.js"

connectToDB()
//invokeGeminiAi()

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})