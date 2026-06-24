# ShortlistD

A full-stack placement management platform built to automate campus recruitment workflows, eligibility verification, application tracking, and placement administration.

**Live Demo:** https://shortlist-d.vercel.app

---

## Overview

ShortlistD is a centralized placement management platform designed for Training & Placement Cells and students.

The platform automates eligibility verification, application management, placement drive administration, and student profile tracking while reducing manual shortlisting effort.

---

## Live Deployment

### Frontend

https://shortlist-d.vercel.app


### Authentication

* Google OAuth 2.0
* Institute email verification
* JWT-based session management
* Role-based access control

---

# System Architecture

```text
┌──────────────────────────────────────┐
│            React Frontend            │
│                                      │
│  Student Portal                      │
│  Admin Dashboard                     │
│  Company Management                  │
│  Application Tracking                │
└────────────────┬─────────────────────┘
                 │
                 │ REST APIs
                 ▼
┌──────────────────────────────────────┐
│           Express Backend            │
│                                      │
│  Authentication Service              │
│  Eligibility Engine                  │
│  Application Service                 │
│  Company Service                     │
│  Reporting Service                   │
└────────────────┬─────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────┐
│            MongoDB Atlas             │
│                                      │
│  Users                               │
│  Companies                           │
│  Applications                        │
│  Announcements                       │
└──────────────────────────────────────┘
```

---

# Authentication Flow

```text
Student/Admin
      │
      ▼
Google OAuth Login
      │
      ▼
Google Token Verification
      │
      ▼
User Lookup / Creation
      │
      ▼
JWT Token Generation
      │
      ▼
HTTP-Only Cookie
      │
      ▼
Protected Routes
```

---

# Student Application Workflow

```text
Admin Creates Company
          │
          ▼
Eligibility Rules Configured
(CGPA, Branch, Year, Backlogs)
          │
          ▼
Student Views Company
          │
          ▼
Eligibility Engine Validation
          │
          ├───────────────┐
          │               │
          ▼               ▼
      Eligible       Not Eligible
          │               │
          ▼               ▼
 Profile Validation   Blocked
          │
          ▼
Application Submitted
          │
          ▼
Database Storage
```

---

# Recruitment Lifecycle

```text
APPLICATIONS_OPEN
         │
         ▼
ONLINE_ASSESSMENT
         │
         ▼
TECHNICAL_INTERVIEW
         │
         ▼
HR_INTERVIEW
         │
         ▼
RESULTS_DECLARED
```

---

# Core Features

## Student Portal

* Google OAuth login
* Profile completion workflow
* Resume link management
* Skills management
* Academic profile tracking
* Company browsing
* Eligibility verification
* Placement application system
* Application status tracking
* Announcement access

---

## Admin Portal

* Placement drive creation
* Company management
* Eligibility criteria configuration
* Applicant monitoring
* Student management
* Announcement publishing
* Excel report exports
* Eligible student exports
* Recruitment phase tracking

---

# Eligibility Engine

The platform automatically evaluates students using:

* Branch eligibility
* Minimum CGPA
* Maximum allowed backlogs
* Graduation year
* Placement status
* Company-specific requirements
* Placement policy constraints

### Example

```text
Company Requirements

CGPA >= 8.0
Branch = CSE, ECE
Backlogs <= 0
Graduation Year = 2027

↓

Student Profile

CGPA = 8.45
Branch = CSE
Backlogs = 0
Year = 2027

↓

Eligible
```

---

# Company-Specific Profile Validation

Administrators can define required profile sections for individual companies.

Example:

```text
Google

Required Fields:
• Resume
• GitHub
• LinkedIn
• Skills

↓

Student Missing GitHub

↓

Application Blocked
```

This ensures only students with complete profiles can apply.

---

# Database Design

## User

```text
User
├── Google Account
├── Scholar ID
├── Branch
├── CGPA
├── Graduation Year
├── Resume Link
├── Skills
├── Projects
├── Experience
├── Achievements
├── Social Profiles
└── Placement Status
```

---

## Company

```text
Company
├── Company Name
├── Role
├── Package
├── Offer Type
├── Location
├── Eligibility Rules
├── Required Profile Fields
├── Application Deadline
├── Recruitment Phase
└── Status
```

---

## Application

```text
Application
├── Student
├── Company
├── Status
├── Remarks
└── Timestamps
```

---

# Technology Stack

## Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router

## Backend

* Node.js
* Express.js
* JWT Authentication
* Google OAuth

## Database

* MongoDB Atlas
* Mongoose ODM

## Deployment

* Vercel
* Render

---

# Backend Modules

```text
Authentication
│
├── Google Login
├── Current User
└── Logout

User Management
│
├── Complete Profile
├── Update Profile
└── Student Management

Company Management
│
├── Create Company
├── Update Company
├── Eligibility Reports
└── Excel Export

Applications
│
├── Apply
├── Status Tracking
├── Applicant Management
└── Applicant Export

Announcements
│
├── Create
├── View
└── Delete
```

---

# Security Features

* Google OAuth authentication
* JWT authorization
* HTTP-only cookies
* Role-based access control
* Protected API routes
* Express rate limiting
* Helmet security middleware
* Backend eligibility enforcement
* Company-specific profile validation

---

# Deployment Architecture

```text
                 Internet
                     │
                     ▼

        ┌──────────────────────┐
        │       Vercel         │
        │   React Frontend     │
        └──────────┬───────────┘
                   │
                   ▼

        ┌──────────────────────┐
        │       Render         │
        │   Express Backend    │
        └──────────┬───────────┘
                   │
                   ▼

        ┌──────────────────────┐
        │    MongoDB Atlas     │
        │      Database        │
        └──────────────────────┘
```

---

# Local Setup

## Clone Repository

```bash
git clone https://github.com/SekaiKerai/ShortlistD.git
cd ShortlistD
```

## Backend

```bash
cd server
npm install
npm run dev
```

## Frontend

```bash
cd client
npm install
npm run dev
```

---

# Future Enhancements

* Resume parsing
* Resume scoring
* Automated shortlisting
* Email notifications
* Placement analytics dashboard
* OA experience repository
* Interview preparation resources
* Recruitment insights and reporting

---

# Author

**Bornil Gogoi**

B.Tech, Computer Science and Engineering
National Institute of Technology Silchar

