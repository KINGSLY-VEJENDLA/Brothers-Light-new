require("dotenv").config();
const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();

app.use(express.urlencoded({ extended: true }));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Files
app.use(express.static(path.join(__dirname, "Public")));



// Routes
app.get("/", (req, res) => {
    res.render("pages/index");
});

app.get("/about", (req, res) => {
    res.render("pages/about");
});

app.get("/services", (req, res) => {
    res.render("pages/services");
});



// Contact
app.get("/contact", (req, res) => {
    res.render("pages/contact");
});


const transporter = nodemailer.createTransport({

    host: "smtpout.secureserver.net",

    port: 587,

    secure: false,

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

app.post("/send-enquiry", async (req, res) => {

    console.log("========== NEW ENQUIRY ==========");
    console.log(req.body);

    try {

        const {
            name,
            phone,
            email,
            requirement,
            message
        } = req.body;

        const requirements = Array.isArray(requirement)
            ? requirement.join(", ")
            : requirement || "Not specified";


        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: "info@brotherslight.in",

            replyTo: email,

            subject: `New Enquiry from ${name}`,

            html: `
                <div style="font-family:Arial,sans-serif">

                    <h2>New Website Enquiry</h2>

                    <hr>

                    <p>
                        <strong>Name:</strong>
                        ${name}
                    </p>

                    <p>
                        <strong>Phone:</strong>
                        ${phone}
                    </p>

                    <p>
                        <strong>Email:</strong>
                        ${email}
                    </p>

                    <p>
                        <strong>Requirements:</strong>
                        ${requirements}
                    </p>

                    <p>
                        <strong>Message:</strong>
                        ${message || "No message provided"}
                    </p>

                </div>
            `
        });


        console.log("✅ EMAIL SENT SUCCESSFULLY");

        res.redirect("/contact?success=true");


    } catch (error) {

        console.error("❌ EMAIL ERROR:");
        console.error(error);

        res.status(500).send(`
            <h2>Unable to send enquiry</h2>
            <p>Please try again.</p>
        `);

    }

});
transporter.verify((error, success) => {

    if (error) {

        console.error("❌ SMTP CONNECTION FAILED");
        console.error(error);

    } else {

        console.log("✅ SMTP SERVER READY");

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(` Server Running`);
    console.log(` http://localhost:${PORT}`);
});