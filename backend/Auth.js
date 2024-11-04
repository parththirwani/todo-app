const express = require("express");
const JWT = require("jsonwebtoken");
const path = require("path");
const app = express();
const JWT_SECRET = "Hello_World";
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "..", "public")));

const users = [];

// Signup Handler
function signupHandler(req, res) {
    const { username, password } = req.body;

    users.push({ username, password });
    res.json({
        message: "You are signed up now"
    });
    console.log("Current users are ", users);
}

// Signin Handler
function signinHandler(req, res) {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        const token = JWT.sign({
            username: username
        }, JWT_SECRET);
        res.json({ token });
    } else {
        res.status(403).json({
            message: "Invalid credentials"
        });
    }
}

// Authentication Middleware
function AuthMiddleware(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: "Token is required" });
    }

    try {
        const decodedInfo = JWT.verify(token, JWT_SECRET);
        const username = decodedInfo.username;
        const foundUser = users.find(user => user.username === username);

        if (foundUser) {
            req.user = foundUser; // Attach the found user to req.user
            next();
        } else {
            res.status(403).json({ message: "Invalid token" });
        }
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }
}

// Route Handlers for Pages

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "signup.html"));
});

app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "signin.html"));
});

app.get("/todo", AuthMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "todo.html"));
});

// API Routes
app.post("/signup", signupHandler);
app.post("/signin", signinHandler);

app.get("/me", AuthMiddleware, (req, res) => {
    const user = req.user;

    res.json({
        username: user.username
    });
});

// Start Server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
