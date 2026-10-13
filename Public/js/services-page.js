
document.addEventListener("DOMContentLoaded", function () {
    const page = document.getElementById("service-detail-page");
    if (!page) return;

    // SERVICE PAGE LINKS
    const serviceLinks = {
        customSoftware: "/custom-software-development",
        erp: "/erp-software",
        hrms: "/hrms-software",
        crm: "/crm-software",
        ai: "/ai-solutions",
        mobile: "/mobile-app-development",
        taskManagement: "/task-management-software",
        cloud: "/cloud-solutions"
    };

    // FLOATING CARD ANIMATIONS
    const floatingCards = document.querySelectorAll(".floating-card");

    floatingCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.4}s`;
    });

    // HERO MOUSE MOVEMENT
    const hero = document.querySelector(".services-hero");

    if (hero) {
        window.addEventListener("mousemove", function (event) {
            const x = event.clientX / window.innerWidth - 0.5;
            const y = event.clientY / window.innerHeight - 0.5;

            hero.style.setProperty("--x", `${x * 20}px`);
            hero.style.setProperty("--y", `${y * 20}px`);
        });
    }

    // SERVICE CONTENT
   
const services = {
    customSoftware: {
        title: "Custom Software Development",
        heading: "Software Built Around Your Business",
        description:
            "Transform your business ideas into practical digital solutions. Brothers Light develops custom software and web applications designed around your workflows, operational requirements, and long-term business goals.",
        intro:
            "Every business has different processes and challenges. Our custom software development services help you organize operations, automate repetitive work, connect existing systems, and build applications that fit the way your business works.",
        image: "/images/custom-software.jpg",
        features: [
            {
                title: "Business Applications",
                text: "Build web-based applications to manage business information, customer requests, internal operations, and everyday workflows through a solution tailored to your requirements.",
                icon: "fa-laptop-code"
            },
            {
                title: "Workflow Automation",
                text: "Reduce repetitive manual activities by digitizing routine processes, organizing approvals, and improving how information moves between teams.",
                icon: "fa-gears"
            },
            {
                title: "System Integration",
                text: "Connect relevant business applications and databases to reduce disconnected information, simplify data handling, and create more consistent workflows.",
                icon: "fa-network-wired"
            }
        ]
    },

    erp: {
        title: "ERP Software Solutions",
        heading: "Manage Your Business in One Place",
        description:
            "Bring important business activities together with ERP software designed for your operational needs. Manage inventory, sales, purchasing, finance-related records, and business reporting through a connected system.",
        intro:
            "When business information is spread across multiple spreadsheets and tools, tracking daily operations becomes difficult. An ERP solution helps centralize records, improve visibility, and support coordination across departments.",
        image: "/images/erp.jpg",
        features: [
            {
                title: "Inventory Management",
                text: "Organize product records, stock movements, purchases, and inventory updates. Improve visibility into available stock and support more structured inventory control.",
                icon: "fa-boxes-stacked"
            },
            {
                title: "Sales & Finance",
                text: "Maintain sales records, quotations, invoices, and relevant financial information in a more organized workflow that supports business administration.",
                icon: "fa-chart-line"
            },
            {
                title: "Business Reporting",
                text: "Bring operational information together into useful reports that help teams review business activity, identify pending work, and make informed decisions.",
                icon: "fa-file-lines"
            }
        ]
    },

    hrms: {
        title: "HRMS Software",
        heading: "Simplify Human Resource Management",
        description:
            "Organize employee information and everyday HR activities with a Human Resource Management System tailored to your organization's workforce and administrative processes.",
        intro:
            "Managing employee records, attendance, leave requests, and payroll-related information manually can consume valuable time. HRMS software helps centralize workforce records and establish more consistent HR workflows.",
        image: "/images/hrms.jpg",
        features: [
            {
                title: "Employee Records",
                text: "Maintain employee profiles, contact details, employment information, and other essential HR records in a structured and accessible system.",
                icon: "fa-users"
            },
            {
                title: "Attendance & Leave",
                text: "Organize attendance information, leave applications, and approval workflows to make employee attendance administration easier to manage.",
                icon: "fa-calendar-check"
            },
            {
                title: "Payroll Workflows",
                text: "Structure salary-related records and payroll administration workflows to help HR teams manage payroll information more consistently.",
                icon: "fa-money-check-dollar"
            }
        ]
    },

    crm: {
        title: "CRM Software Development",
        heading: "Build Better Customer Relationships",
        description:
            "Keep customer information, enquiries, sales opportunities, and follow-up activities organized with CRM software developed around your sales process and customer management requirements.",
        intro:
            "A structured Customer Relationship Management system helps your team maintain customer records, monitor sales progress, coordinate follow-ups, and keep important interactions easier to track.",
        image: "/images/crm.jpg",
        features: [
            {
                title: "Lead Management",
                text: "Record customer enquiries, organize prospective customers, assign leads to team members, and maintain visibility into the progress of sales opportunities.",
                icon: "fa-user-plus"
            },
            {
                title: "Sales Pipeline",
                text: "Track opportunities through different sales stages, review pending activities, and help your team maintain a clearer view of ongoing deals.",
                icon: "fa-chart-simple"
            },
            {
                title: "Customer Follow-ups",
                text: "Keep customer details and interaction records organized while helping your team plan follow-ups and maintain consistent communication.",
                icon: "fa-address-book"
            }
        ]
    },

    ai: {
        title: "AI Solutions for Businesses",
        heading: "Make Business Processes Smarter",
        description:
            "Explore practical artificial intelligence solutions for business applications, information processing, repetitive workflows, and data-driven activities based on your organization's needs.",
        intro:
            "AI can support selected business processes when applied to the right problems. We help identify suitable opportunities for intelligent automation and AI-enabled applications while considering your workflow, data, and operational objectives.",
        image: "/images/ai.jpg",
        features: [
            {
                title: "AI Automation",
                text: "Identify repetitive tasks and explore AI-assisted workflows that can help process information, organize requests, and reduce manual effort where appropriate.",
                icon: "fa-robot"
            },
            {
                title: "Data Analysis",
                text: "Organize and examine business information to help identify patterns, summarize relevant findings, and support better-informed operational decisions.",
                icon: "fa-chart-pie"
            },
            {
                title: "Intelligent Applications",
                text: "Integrate suitable AI capabilities into business applications to support tasks such as information retrieval, text processing, and user assistance.",
                icon: "fa-brain"
            }
        ]
    },

    mobile: {
        title: "Mobile App Development",
        heading: "Your Business on Mobile",
        description:
            "Bring your digital services closer to your customers and employees with mobile applications designed around your business goals, user requirements, and day-to-day activities.",
        intro:
            "Mobile applications can make services and business information more accessible. We develop application experiences based on your intended users, required functionality, and integration needs.",
        image: "/images/mobile.jpg",
        features: [
            {
                title: "Android Applications",
                text: "Develop Android applications for customer services, employee activities, business operations, and other workflows that benefit from mobile access.",
                icon: "fa-mobile-screen"
            },
            {
                title: "iOS Applications",
                text: "Create application experiences for Apple devices with interfaces and functionality aligned with your service requirements and target audience.",
                icon: "fa-tablet-screen-button"
            },
            {
                title: "Business App Integration",
                text: "Connect mobile applications with relevant web applications, APIs, and business systems to support consistent information exchange.",
                icon: "fa-link"
            }
        ]
    },

    taskManagement: {
        title: "Task Management Software",
        heading: "Organize Work. Track Progress.",
        description:
            "Bring tasks, assignments, deadlines, and project updates into one organized workflow. Task management software helps teams coordinate responsibilities and maintain visibility into ongoing work.",
        intro:
            "When tasks are scattered across messages, spreadsheets, and informal conversations, important updates can be missed. A centralized task management solution helps teams organize work, track progress, and coordinate activities.",
        image: "/images/task.jpg",
        features: [
            {
                title: "Task Assignments",
                text: "Create tasks, assign responsibilities, record priorities, and organize work so team members can understand their assignments and next steps.",
                icon: "fa-list-check"
            },
            {
                title: "Deadline Tracking",
                text: "Record due dates, monitor pending activities, and make it easier for teams to review upcoming deadlines and follow up on delayed work.",
                icon: "fa-clock"
            },
            {
                title: "Project Tracking",
                text: "Group related tasks into projects, review progress, and maintain a clearer overview of ongoing activities and outstanding work.",
                icon: "fa-diagram-project"
            }
        ]
    },

    cloud: {
        title: "Cloud Solutions",
        heading: "Reliable Cloud & Deployment Solutions",
        description:
            "Deploy and operate your digital applications with cloud hosting, server configuration, application deployment, and backup planning suited to your technical requirements.",
        intro:
            "A suitable hosting and deployment setup helps applications remain accessible and easier to maintain. We help businesses organize their deployment environment, configure servers, and plan practical backup processes.",
        image: "/images/cloud.jpg",
        features: [
            {
                title: "Cloud Deployment",
                text: "Prepare and deploy web applications to suitable hosting environments, configure application settings, and organize deployment workflows.",
                icon: "fa-cloud-arrow-up"
            },
            {
                title: "Server Configuration",
                text: "Configure server environments, application processes, and relevant web server settings to support the deployment and operation of your applications.",
                icon: "fa-server"
            },
            {
                title: "Backup Planning",
                text: "Establish a backup approach for important application files and data, with retention and recovery considerations suited to your operational needs.",
                icon: "fa-database"
            }
        ]
    }
};

    const serviceKey = page.dataset.serviceKey;
    const service = services[serviceKey];

    if (!service) {
        console.error("Service not found:", serviceKey);
        return;
    }

    // UPDATE PAGE TITLE
    document.title = service.title + " | Brothers Light";

    const titleElement = document.getElementById("service-title");
    const descriptionElement = document.getElementById("service-description");
    const headingElement = document.getElementById("service-heading");
    const introElement = document.getElementById("service-intro");
    const featuresContainer = document.getElementById("service-features");

    if (titleElement) {
        titleElement.textContent = service.title;
    }

    if (descriptionElement) {
        descriptionElement.textContent = service.description;
    }

    if (headingElement) {
        headingElement.textContent = service.heading;
    }

    if (introElement) {
        introElement.textContent = service.intro;
    }

    // UPDATE HERO IMAGE TO MATCH THE SERVICES PAGE CARD
    const heroImage = document.getElementById("service-hero-image");

    if (heroImage && service.image) {
        heroImage.src = service.image;
        heroImage.alt = service.title;
    }

    // RENDER CLICKABLE FEATURE CARDS
    if (featuresContainer) {
        featuresContainer.replaceChildren();

        service.features.forEach(function (feature) {
            const card = document.createElement("a");

            card.className = "service-card show-service";
            card.href = serviceLinks[serviceKey] || "/services";
            card.setAttribute(
                "aria-label",
                `Learn more about ${feature.title}`
            );

            const iconWrapper = document.createElement("div");
            iconWrapper.className = "service-feature-icon";

            const icon = document.createElement("i");
            icon.className = `fas ${feature.icon}`;
            icon.setAttribute("aria-hidden", "true");

            iconWrapper.appendChild(icon);

            const title = document.createElement("h3");
            title.textContent = feature.title;

            const text = document.createElement("p");
            text.textContent = feature.text;

            card.append(iconWrapper, title, text);
            featuresContainer.appendChild(card);
        });
    } else {
        console.error(
            "Missing #service-features element in service-detail.ejs"
        );
    }
});