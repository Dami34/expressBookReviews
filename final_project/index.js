const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the session contains a valid access token
    const token = req.session.token;  // Assuming the token is saved in session

    if (!token) {
        return res.status(401).json({ message: "Unauthorized access: No token provided" });
    }

    // Verify the token using jwt
    jwt.verify(token, "your_secret_key", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized access: Invalid token" });
        }

        // Store the decoded user info for future use
        req.user = decoded;
        next();
    });
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
