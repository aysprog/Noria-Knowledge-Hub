# Noria — Customer Support Knowledge Hub

A modern, responsive self-service knowledge platform designed to make customer support information easier to discover, understand, and manage.

Noria provides a structured knowledge library for visitors alongside a dedicated staff workspace for managing articles, reviewing customer feedback, monitoring support enquiries, and exploring content activity.

**Live Demo:** [Explore Noria](https://aysprog.github.io/Noria-Knowledge-Hub/)

---

## Overview

Noria is a front-end customer support knowledge hub built to demonstrate how an organized self-service support experience can reduce information friction and help users find relevant answers independently.

The platform combines a searchable public-facing article library with a separate content management workspace, creating two distinct experiences within one application.

## Key Features

### Public Knowledge Hub
- Searchable knowledge library with live article suggestions.
- Five organized support categories.
- Featured articles and curated content.
- Individual article reading experience.
- Category-based filtering and alphabetical sorting.
- Article usefulness feedback.
- Customer support enquiry submission.
- Responsive navigation and mobile-friendly layouts.

### Staff Management Workspace
- Dedicated staff sign-in interface.
- Article creation and editing.
- Publish and unpublish article controls.
- Article deletion and content management.
- Featured article management.
- Overview of published and total articles.
- Article views and search activity tracking.
- Customer feedback monitoring.
- Support enquiry overview.
- Content performance insights, including popular articles and recent search terms.

### User Experience & Design
- Editorial-inspired visual design.
- Distinctive typography using Manrope and DM Serif Display.
- Responsive layouts for different screen sizes.
- Form validation and interactive feedback messages.
- Accessible navigation elements and semantic HTML.
- Reduced-motion considerations.

## Support Categories

Noria organizes its knowledge library into five collections:

| Category | Coverage |
|---|---|
| Account & Profile | Sign-in, profile details and account recovery |
| Payments & Billing | Payment methods, invoices and refunds |
| Privacy & Security | Privacy controls and account safety |
| Orders & Delivery | Order progress and delivery issues |
| Troubleshooting | Common technical problems |

## Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Semantic page structure |
| CSS3 | Responsive styling and visual design |
| JavaScript (Vanilla) | Search, filtering, forms and interactive functionality |
| LocalStorage | Browser-based content and activity persistence |
| SessionStorage | Demo staff session handling |
| Google Fonts | Typography |
| GitHub Pages | Deployment and hosting |

## Project Structure

```text
Noria-Knowledge-Hub/
│
├── index.html       # Public knowledge hub
├── styles.css       # Public website styling
├── data.js          # Initial knowledge base content
├── app.js           # Public website functionality
│
├── admin.html       # Staff login and management workspace
├── admin.css        # Admin dashboard styling
├── admin.js         # Article management and reporting
│
└── README.md
```

## Getting Started

To run Noria locally:

1. Clone the repository:

   ```bash
   git clone https://github.com/aysprog/Noria-Knowledge-Hub.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Noria-Knowledge-Hub
   ```

3. Open the project in VS Code.

4. Run `index.html` using the Live Server extension or open it directly in your browser.

5. Access the staff workspace through the **Staff Portal** link.

## Demo Staff Access

The project includes a demonstration staff account for exploring the management workspace.

| Credential | Value |
|---|---|
| Email | staff@noria.help |
| Password | NoriaDemo26! |

**Note:** These are demonstration credentials, not production account credentials.

## Data & Security Limitations

Noria is currently a front-end demonstration project.

- Articles, feedback, support enquiries, and analytics are stored in browser LocalStorage.
- Data is browser-specific and is not synchronized between users or devices.
- Staff authentication is a client-side demonstration and does not provide production-level security.
- SessionStorage is used for the demonstration staff session.

For production deployment, the application would require a backend database, secure server-side authentication and authorization, and server-side data validation.

## Learning Outcomes

This project demonstrates practical experience with:

- Building multi-page front-end applications.
- Designing responsive interfaces using HTML and CSS.
- Implementing dynamic content rendering with JavaScript.
- Working with browser storage APIs.
- Developing search, filtering, and sorting functionality.
- Managing application state and user interactions.
- Creating dashboard-style management interfaces.
- Handling forms and client-side validation.
- Organizing a project into maintainable files.

## Author

**Ayesha Athar**

Front-End Developer | BS Computer Science Student

---

*Built as a front-end development project to explore modern customer support experiences, knowledge management, and interactive web interfaces.*