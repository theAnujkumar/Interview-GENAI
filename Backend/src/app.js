const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

// create / initate server
const app = express()
app.use(express.json())
app.use(cookieParser())


const allowedOrigins = [
  "http://localhost:5173",            // Local testing ke liye
  process.env.CLIENT_URL    // Vercel live URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Postman ya server-to-server calls ke liye (!origin)
    if (!origin) return callback(null, true);
    
    // Check if origin matches allowed origins or any Vercel domain
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    return callback(new Error('CORS Not Allowed'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Preflight OPTIONS requests handeling
// app.options('*', cors());



// const allowedOrigins = [
//   'http://localhost:5173',                   // Aapka Local Vite Frontend
//   'https://your-frontend.vercel.app'          // Aapka Live Vercel Frontend URL
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     // Postman ya same-origin requests ke liye (!origin)
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS policy by-passed not allowed'));
//     }
//   },
//   credentials: true // Credentials allow karne ke liye ye true hona chahiye
// }));

// app.use(cors({
//     origin: "http://localhost:5173",
//     //origin:"*",
//     credentials: true
// }))

// require all routes here
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")

// using all routes here
app.use("/api/auth" , authRouter)
app.use("/api/interview" , interviewRouter)


module.exports = app