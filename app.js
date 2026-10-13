require("dotenv").config();

const express = require("express");
const path = require("path");
const { Resend } = require("resend");
const blogRoutes = require("./routes/blogs");

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

const siteUrl = (process.env.SITE_URL || "https://brotherslight.in").replace(/\/$/, "");
const seoPages = {
    home: {
        title: "Brothers Light | Custom Software Development by Kingsly Vejendla",
        description: "Brothers Light is a software development brand by Kingsly Vejendla, offering custom software, web development, mobile apps, ERP, HRMS, and scalable digital solutions for businesses.",
        canonical: `${siteUrl}/`,
        schemaType: "WebPage"
    },
    about: {
        title: "About Kingsly Vejendla | Freelance Software Developer | Brothers Light",
        description: "Learn about Kingsly Vejendla, founder of Brothers Light, and the practical, scalable software solutions he builds for businesses.",
        canonical: `${siteUrl}/about`,
        schemaType: "WebPage"
    },
    services: {
        title: "Software Development Services | Custom Software, ERP & HRMS | Brothers Light",
        description: "Explore Brothers Light software development services, including custom software, web development, mobile apps, ERP, HRMS, task management, and business automation.",
        canonical: `${siteUrl}/services`,
        schemaType: "WebPage"
    },
    projects: {
        title: "Software Development Projects | Brothers Light",
        description: "Explore software and web development projects by Brothers Light, including Telugu Samskruthi and Cure Health 24.",
        canonical: `${siteUrl}/projects`,
        schemaType: "CollectionPage"
    },
    contact: {
        title: "Contact Brothers Light | Software Development Enquiries",
        description: "Contact Brothers Light about custom software, websites, mobile applications, ERP, HRMS, and business software solutions.",
        canonical: `${siteUrl}/contact`,
        schemaType: "WebPage"
    }
};

// ===============================
// Static Files
// ===============================

app.use((req, res, next) => {
    if (
        req.hostname.toLowerCase() === "www.brotherslight.in" &&
        ["GET", "HEAD"].includes(req.method)
    ) {
        return res.redirect(301, `${siteUrl}${req.originalUrl}`);
    }

    next();
});

app.use(blogRoutes);

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
    res.render("pages/index", { seo: seoPages.home });
});

// About
app.get("/about", (req, res) => {
    res.render("pages/about", { seo: seoPages.about });
});

// Services
app.get("/services", (req, res) => {
    res.render("pages/services", { seo: seoPages.services });
});

// Contact
app.get("/contact", (req, res) => {
    res.render("pages/contact", { seo: seoPages.contact });
});


app.get("/success", (req, res) => {
    res.render("pages/success");
});

app.get("/projects", (req, res) => {
    res.render("pages/projects", { seo: seoPages.projects });
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


// =========================================
// BROTHERS LIGHT - SOFTWARE SERVICE PAGES
// =========================================

const softwareServicePages = [
    {
        path: "/custom-software-development",
        key: "customSoftware",
        title: "Custom Software Development | Brothers Light",
        description: "Custom software development, business applications, and workflow automation solutions by Brothers Light."
    },
    {
        path: "/erp-software",
        key: "erp",
        title: "ERP Software Solutions | Brothers Light",
        description: "ERP software for inventory, sales, finance, and business operations by Brothers Light."
    },
    {
        path: "/hrms-software",
        key: "hrms",
        title: "HRMS Software Solutions | Brothers Light",
        description: "HRMS software for employee records, attendance, leave management, and HR administration."
    },
    {
        path: "/crm-software",
        key: "crm",
        title: "CRM Software Development | Brothers Light",
        description: "Customer Relationship Management software for leads, customer records, sales pipelines, and follow-ups."
    },
    {
        path: "/ai-solutions",
        key: "ai",
        title: "AI Solutions for Businesses | Brothers Light",
        description: "Business-focused AI solutions and intelligent workflow automation from Brothers Light."
    },
    {
        path: "/mobile-app-development",
        key: "mobile",
        title: "Mobile App Development | Brothers Light",
        description: "Android and iOS mobile application development for businesses by Brothers Light."
    },
    {
        path: "/task-management-software",
        key: "taskManagement",
        title: "Task Management Software | Brothers Light",
        description: "Task and project management software for assignments, deadlines, progress tracking, and collaboration."
    },
    {
        path: "/cloud-solutions",
        key: "cloud",
        title: "Cloud Solutions and Deployment | Brothers Light",
        description: "Cloud hosting, application deployment, server configuration, and infrastructure support by Brothers Light."
    }
];

// Register each service page
softwareServicePages.forEach((service) => {
    app.get(service.path, (req, res) => {
        const canonical = `${siteUrl}${service.path}`;

        res.render("pages/service-detail", {
            serviceKey: service.key,

            // Used by the SEO partial
            seo: {
                title: service.title,
                description: service.description,
                canonical: canonical,
                schemaType: "WebPage"
            },

            // Also available to the EJS template
            title: service.title,
            description: service.description,
            canonical: canonical
        });
    });
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
