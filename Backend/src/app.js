const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

// create / initate server
const app = express()
app.use(express.json())
app.use(cookieParser())


const allowedOrigins = [
  'http://localhost:5173',               // Local Testing
  'https://your-frontend.vercel.app'        // Aapka Exact Vercel URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Preflight OPTIONS requests ko handle karne ke liye
app.options('*', cors());

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