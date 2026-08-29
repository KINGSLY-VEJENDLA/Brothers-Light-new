require("dotenv").config();

const express = require("express");
const path = require("path");
const { Resend } = require("resend");

const app = express();


// ===============================
// Middleware
// ===============================

app.use(express.urlencoded({ extended: true }));

// ===============================
// View Engine
// ===============================

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ===============================
// Static Files
// ===============================

app.use(express.static(path.join(__dirname, "Public")));

// ===============================
// Resend Configuration
// ===============================

const resend = new Resend(process.env.RESEND_API_KEY);

// ===============================
// Routes
// ===============================

// Home
app.get("/", (req, res) => {
    res.render("pages/index");
});

// About
app.get("/about", (req, res) => {
    res.render("pages/about");
});

// Services
app.get("/services", (req, res) => {
    res.render("pages/services");
});

// Contact
app.get("/contact", (req, res) => {
    res.render("pages/contact");
});


app.get("/success", (req, res) => {
    res.render("pages/success");
});

app.get("/projects", (req, res) => {
    res.render("pages/projects");
});

// ===============================
// Send Enquiry
// ===============================

app.post("/send-enquiry", async (req, res) => {

    console.log("=================================");
    console.log("       NEW WEBSITE ENQUIRY");
    console.log("=================================");

    console.log(req.body);

    try {

        // ===============================
        // Get Form Data
        // ===============================

        const {
            name,
            phone,
            email,
            requirement,
            message
        } = req.body;

        // ===============================
        // Handle Requirements
        // ===============================

        const requirements = Array.isArray(requirement)
            ? requirement.join(", ")
            : requirement || "Not specified";

        // ===============================
        // Validate Required Fields
        // ===============================

        if (!name || !email) {

            console.log("❌ Missing required fields");

            return res.status(400).send(`
                <h2>Missing Information</h2>
                <p>Name and email are required.</p>
                <a href="/contact">Go Back</a>
            `);
        }

        // =====================================================
        // EMAIL 1
        // SEND FULL ENQUIRY TO BROTHERS LIGHT
        // =====================================================

        const { data: enquiryData, error: enquiryError } =
            await resend.emails.send({

                from: "Brothers Light <info@brotherslight.in>",

                to: ["info@brotherslight.in"],

                // When you click Reply, it replies to the client
                replyTo: email,

                subject: `New Enquiry from ${name}`,

                html: `
                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 650px;
                        margin: auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 10px;
                    ">

                        <h2 style="margin-bottom: 20px;">
                            New Website Enquiry
                        </h2>

                        <hr>

                        <p>
                            <strong>Name:</strong><br>
                            ${name}
                        </p>

                        <p>
                            <strong>Phone:</strong><br>
                            ${phone || "Not provided"}
                        </p>

                        <p>
                            <strong>Email:</strong><br>
                            ${email}
                        </p>

                        <p>
                            <strong>Requirements:</strong><br>
                            ${requirements}
                        </p>

                        <p>
                            <strong>Message:</strong><br>
                            ${message || "No message provided"}
                        </p>

                        <hr>

                        <p style="font-size: 12px; color: #777;">
                            This enquiry was submitted through the
                            Brothers Light website.
                        </p>

                    </div>
                `
            });

        // ===============================
        // Check Enquiry Email
        // ===============================

        if (enquiryError) {

            console.error("❌ ERROR SENDING ENQUIRY EMAIL");
            console.error(enquiryError);

            return res.status(500).send(`
                <h2>Unable to send enquiry</h2>
                <p>Please try again later.</p>
                <a href="/contact">Go Back</a>
            `);
        }

        console.log("✅ Enquiry email sent");
        console.log("Enquiry Email ID:", enquiryData.id);


        // =====================================================
        // EMAIL 2
        // SEND CONFIRMATION TO CLIENT
        // =====================================================

        const { data: confirmationData, error: confirmationError } =
            await resend.emails.send({

                from: "Brothers Light <info@brotherslight.in>",

                to: [email],

                subject: "Thank You for Contacting Brothers Light",

                html: `
                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 650px;
                        margin: auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 10px;
                    ">

                        <h2 style="margin-bottom: 20px;">
                            Thank You, ${name}!
                        </h2>

                        <p>
                            Thank you for contacting
                            <strong>Brothers Light</strong>.
                        </p>

                        <p>
                            We have successfully received your enquiry.
                            Our team will review your requirements and
                            contact you shortly.
                        </p>

                        <hr>

                        <h3>Your Enquiry Details</h3>

                        <p>
                            <strong>Name:</strong><br>
                            ${name}
                        </p>

                        <p>
                            <strong>Phone:</strong><br>
                            ${phone || "Not provided"}
                        </p>

                        <p>
                            <strong>Requirements:</strong><br>
                            ${requirements}
                        </p>

                        <p>
                            <strong>Message:</strong><br>
                            ${message || "No message provided"}
                        </p>

                        <hr>

                        <p>
                            Regards,<br>
                            <strong>Brothers Light</strong>
                        </p>

                        <p style="font-size: 12px; color: #777;">
                            This is an automated confirmation email.
                            Please do not reply to this message.
                        </p>

                    </div>
                `
            });


        // ===============================
        // Check Confirmation Email
        // ===============================

        if (confirmationError) {

            console.error("⚠️ Confirmation email failed");
            console.error(confirmationError);

            // Important:
            // The enquiry to Brothers Light was already successful.
            // Therefore we don't show a complete failure.

            return res.redirect("/success");
        }

        console.log("✅ Confirmation email sent");
        console.log(
            "Confirmation Email ID:",
            confirmationData.id
        );


        // ===============================
        // SUCCESS
        // ===============================

        console.log("=================================");
        console.log("       EMAIL PROCESS COMPLETE");
        console.log("=================================");

        res.redirect("/success");

    } catch (error) {

        console.error("=================================");
        console.error("❌ UNEXPECTED EMAIL ERROR");
        console.error("=================================");

        console.error(error);
        res.redirect("/contact?success=false");


        res.status(500).send(`
            <h2>Unable to send enquiry</h2>

            <p>
                Something went wrong while sending your enquiry.
                Please try again.
            </p>

            <a href="/contact">
                Go Back
            </a>
        `);
    }
});


// ===============================
// Server
// ===============================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("=================================");
    console.log("      BROTHERS LIGHT SERVER");
    console.log("=================================");

    console.log(`Server Running`);
    console.log(`http://localhost:${PORT}`);

});