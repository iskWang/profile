---
schema: resume
lang: en
name: Josh Wang
title: Software Developer
---

# Josh Wang — Resume

## Summary
- 10+ years of full-stack development experience (primarily front-end), spanning SaaS, cybersecurity, cross-border internal systems, and React Native.
- Led frontend architecture and delivery for 7+ web systems and 2 mobile apps using TypeScript, CI/CD, monorepo, and AWS.
- Focused on scalable frontend systems, AI-assisted development workflows, and legacy system modernization.

## Experience
### Full-Stack Engineer — Independent
Jun 2023 – Present
#### CI/CD Architecture & Security | Data Analytics SaaS Startup
- Led CI/CD workflow restructuring, consolidating 5 fragmented branches into 2 and optimizing the monorepo structure to reduce operational overhead
- Introduced Claude + Playwright MCP for automated Gherkin script generation, reducing regression risk and improving release stability
- Performed critical security patching under time pressure, resolving CVE-2025-29927 and strengthening system security posture
#### Map System Development & Technical Debt Cleanup | Major Real Estate Group
- Served as technical lead to fill development gaps, delivering complex map POI filtering features on tight deadlines
- Rolled out a Claude Code + MCP-assisted development workflow on the existing codebase, cutting feature POC validation time from weeks to 1.5 days
- Led systematic module decomposition and refactoring to resolve legacy architectural debt at the root
#### Real-Time Trading Feature Development | Vue 3 + Nuxt.js
- Took over an existing Vue 3 + Nuxt 3 + Pinia project, extending real-time trading features within its established architecture conventions
- Integrated TradingView Widget and ECharts for real-time price feeds, order book visualization, and data analytics

### Front-End Developer (Platform & Architecture) — TeamT5 (Cybersecurity)
Oct 2021 – Jun 2023
#### ThreatSonar Product — Frontend Architecture Planning
- Led frontend architecture planning for the frontend/backend separation, producing technical specs and architecture design docs as the implementation foundation
#### Official Website & Event Pages (CYBERSEC 2022/2023, InterOp23)
- Led cloud architecture migration from Firebase/Cloudinary to AWS S3/CloudFront + Next.js, reducing cloud costs by 90% and improving reliability
- Refactored 50%+ of the legacy codebase and implemented an AWS SDK/TypeScript/Pica.js file-upload system with auto-thumbnail generation
- Built CYBERSEC 2022/2023 and InterOp23 event pages with Preact.js + Tailwind CSS, deployed via AWS S3 + CloudFront
- Identified plaintext password transmission and auth design flaws in an external vendor system; escalated and drove remediation

### Front-End Lead — OEC Group
May 2019 – Oct 2021
#### B2B/B2C Back-office System
- Led frontend rebuild using React Hooks and Context API with real-time WebSocket messaging, covering internal systems across 50+ countries
- Designed 100-field single-page forms using Formik / Yup / React.memo with strict validation and performance control
- Proposed and adopted GitHub Actions CI/CD pipeline as an early adopter upon its launch in Aug 2019
#### Website Redesign / Internal Training
- Took over external vendor's HTML/CSS and completed Next.js + i18n architecture (13 languages) within one month
- Led Pull Request Code Review culture to improve code quality and ensure requirement alignment

### Web Developer — Startups (Fullinn, CatFi, myTreat, Ecowork)
Jul 2014 – Apr 2019
#### Full-stack Architecture & API Design | Fullinn, myTreat, Ecowork
- Led frontend architecture with Next.js SSR to build an SEO-optimized hotel booking website builder; first client ranked on Google's first page within one week of launch
- Built OTA platform and order system with React.js / GraphQL, and led initial REST API design conventions to streamline backend development
- Delivered full-stack features and a standalone customer service back-office using Rails and Angular.js
#### Mobile & Cross-platform Development | Fullinn, CatFi
- Built cross-platform mobile apps with React Native, Redux, and Redux-saga for state and side effect management
- Integrated Firebase Push Notification and Code Push to reduce deploy costs and streamline push services
- Adopted Fabric and OneSignal for crash reporting and push; integrated WebRTC / RTMP streaming
#### Testing & Dev Workflow | Ecowork
- Implemented Cucumber and RSpec to fulfill client test report requirements; assisted DevOps in building automated test environments
- Introduced Vagrant-based deployment workflow to unify dev environments for faster onboarding

## Projects
### PickleScout — LLM-Driven E2E Test Generation Agent
- Completed full POC in one week using AI-assisted workflow; open-sourced with browser agent, LLM pipeline, self-healing, and full-stack architecture
- Designed two-pass LLM pipeline: Stagehand browser agent explores target app and records ActionLog, converted to Gherkin feature files and Playwright step definitions
- Implemented self-healing mechanism: on test failure, LLM auto-patches selectors and timeouts and retries, improving generated test usability
- Backend job queue (Fastify + BullMQ/Redis) decouples long-running LLM generation from requests, with failure retry and status tracking; generated output includes a GitHub Actions workflow with zero LLM dependency at runtime

## Education
Wenzao Ursuline University of Languages — B.A. Digital Content Application and Management (Sep 2009 – Jun 2013)

## Skills
- **Frontend:** React / Next.js / TypeScript / Redux / Tailwind CSS / Vue 3 / Nuxt.js
- **Backend:** Node.js / Fastify / Rails / Koa / RESTful API / GraphQL / Redis / BullMQ
- **Architecture & Infra:** Monorepo / CI/CD / GitHub Actions / GitLab Runner / Docker / AWS
- **AI Workflow:** Claude Code / MCP / Windsurf
- **Testing:** Playwright / Jest / Cucumber / RSpec
- **Mobile:** React Native / TestFlight

## Resume Data

```json
{
  "name": "Josh Wang",
  "title": "Software Developer",
  "subtitle": "Full-stack engineer specializing in React / Next.js front-end architecture, with Node.js backend and AI-assisted development workflow integration experience",
  "location": "Taipei, Taiwan",
  "email": "spjay1@gmail.com",
  "site": "joshwang.dev",
  "siteHref": "https://joshwang.dev",
  "sectionLabels": {
    "summary": "Summary",
    "achievements": "Key Achievements",
    "experience": "Experience",
    "projects": "Projects",
    "education": "Education",
    "skills": "Skills"
  },
  "summaryLines": [
    "10+ years of full-stack development experience (primarily front-end), spanning SaaS, cybersecurity, cross-border internal systems, and React Native.",
    "Led frontend architecture and delivery for 7+ web systems and 2 mobile apps using TypeScript, CI/CD, monorepo, and AWS.",
    "Focused on scalable frontend systems, AI-assisted development workflows, and legacy system modernization."
  ],
  "achievements": [
    [
      "Reduced cloud infrastructure costs by 90%",
      "Supported internal systems across 50+ countries"
    ],
    [
      "AI-assisted POC validation: weeks to 1.5 days",
      "Designed a job-queue-driven LLM pipeline with self-healing retry logic"
    ]
  ],
  "jobs": [
    {
      "title": "Full-Stack Engineer",
      "company": "Independent",
      "period": "Jun 2023 – Present",
      "groups": [
        {
          "subhead": "CI/CD Architecture & Security | Data Analytics SaaS Startup",
          "bullets": [
            "Led CI/CD workflow restructuring, consolidating 5 fragmented branches into 2 and optimizing the monorepo structure to reduce operational overhead",
            "Introduced Claude + Playwright MCP for automated Gherkin script generation, reducing regression risk and improving release stability",
            "Performed critical security patching under time pressure, resolving CVE-2025-29927 and strengthening system security posture"
          ]
        },
        {
          "subhead": "Map System Development & Technical Debt Cleanup | Major Real Estate Group",
          "bullets": [
            "Served as technical lead to fill development gaps, delivering complex map POI filtering features on tight deadlines",
            "Rolled out a Claude Code + MCP-assisted development workflow on the existing codebase, cutting feature POC validation time from weeks to 1.5 days",
            "Led systematic module decomposition and refactoring to resolve legacy architectural debt at the root"
          ]
        },
        {
          "subhead": "Real-Time Trading Feature Development | Vue 3 + Nuxt.js",
          "bullets": [
            "Took over an existing Vue 3 + Nuxt 3 + Pinia project, extending real-time trading features within its established architecture conventions",
            "Integrated TradingView Widget and ECharts for real-time price feeds, order book visualization, and data analytics"
          ]
        }
      ]
    },
    {
      "title": "Front-End Developer (Platform & Architecture)",
      "company": "TeamT5 (Cybersecurity)",
      "period": "Oct 2021 – Jun 2023",
      "borderBottom": false,
      "groups": [
        {
          "subhead": "ThreatSonar Product — Frontend Architecture Planning",
          "bullets": [
            "Led frontend architecture planning for the frontend/backend separation, producing technical specs and architecture design docs as the implementation foundation"
          ]
        },
        {
          "subhead": "Official Website & Event Pages (CYBERSEC 2022/2023, InterOp23)",
          "bullets": [
            "Led cloud architecture migration from Firebase/Cloudinary to AWS S3/CloudFront + Next.js, reducing cloud costs by 90% and improving reliability",
            "Refactored 50%+ of the legacy codebase and implemented an AWS SDK/TypeScript/Pica.js file-upload system with auto-thumbnail generation",
            "Built CYBERSEC 2022/2023 and InterOp23 event pages with Preact.js + Tailwind CSS, deployed via AWS S3 + CloudFront",
            "Identified plaintext password transmission and auth design flaws in an external vendor system; escalated and drove remediation"
          ]
        }
      ]
    },
    {
      "title": "Front-End Lead",
      "company": "OEC Group",
      "period": "May 2019 – Oct 2021",
      "groups": [
        {
          "subhead": "B2B/B2C Back-office System",
          "bullets": [
            "Led frontend rebuild using React Hooks and Context API with real-time WebSocket messaging, covering internal systems across 50+ countries",
            "Designed 100-field single-page forms using Formik / Yup / React.memo with strict validation and performance control",
            "Proposed and adopted GitHub Actions CI/CD pipeline as an early adopter upon its launch in Aug 2019"
          ]
        },
        {
          "subhead": "Website Redesign / Internal Training",
          "bullets": [
            "Took over external vendor's HTML/CSS and completed Next.js + i18n architecture (13 languages) within one month",
            "Led Pull Request Code Review culture to improve code quality and ensure requirement alignment"
          ]
        }
      ]
    },
    {
      "title": "Web Developer",
      "company": "Startups (Fullinn, CatFi, myTreat, Ecowork)",
      "period": "Jul 2014 – Apr 2019",
      "borderBottom": false,
      "groups": [
        {
          "subhead": "Full-stack Architecture & API Design | Fullinn, myTreat, Ecowork",
          "bullets": [
            "Led frontend architecture with Next.js SSR to build an SEO-optimized hotel booking website builder; first client ranked on Google's first page within one week of launch",
            "Built OTA platform and order system with React.js / GraphQL, and led initial REST API design conventions to streamline backend development",
            "Delivered full-stack features and a standalone customer service back-office using Rails and Angular.js"
          ]
        },
        {
          "subhead": "Mobile & Cross-platform Development | Fullinn, CatFi",
          "bullets": [
            "Built cross-platform mobile apps with React Native, Redux, and Redux-saga for state and side effect management",
            "Integrated Firebase Push Notification and Code Push to reduce deploy costs and streamline push services",
            "Adopted Fabric and OneSignal for crash reporting and push; integrated WebRTC / RTMP streaming"
          ]
        },
        {
          "subhead": "Testing & Dev Workflow | Ecowork",
          "bullets": [
            "Implemented Cucumber and RSpec to fulfill client test report requirements; assisted DevOps in building automated test environments",
            "Introduced Vagrant-based deployment workflow to unify dev environments for faster onboarding"
          ]
        }
      ]
    }
  ],
  "project": {
    "title": "PickleScout — LLM-Driven E2E Test Generation Agent",
    "period": "May 2026",
    "subtitle": "Open Source Side Project",
    "href": "https://github.com/iskWang/PickleScout",
    "bullets": [
      "Completed full POC in one week using AI-assisted workflow; open-sourced with browser agent, LLM pipeline, self-healing, and full-stack architecture",
      "Designed two-pass LLM pipeline: Stagehand browser agent explores target app and records ActionLog, converted to Gherkin feature files and Playwright step definitions",
      "Implemented self-healing mechanism: on test failure, LLM auto-patches selectors and timeouts and retries, improving generated test usability",
      "Backend job queue (Fastify + BullMQ/Redis) decouples long-running LLM generation from requests, with failure retry and status tracking; generated output includes a GitHub Actions workflow with zero LLM dependency at runtime"
    ]
  },
  "education": {
    "school": "Wenzao Ursuline University of Languages",
    "period": "Sep 2009 – Jun 2013",
    "degree": "B.A. Digital Content Application and Management"
  },
  "skills": [
    {
      "cat": "Frontend",
      "val": "React / Next.js / TypeScript / Redux / Tailwind CSS / Vue 3 / Nuxt.js"
    },
    {
      "cat": "Backend",
      "val": "Node.js / Fastify / Rails / Koa / RESTful API / GraphQL / Redis / BullMQ"
    },
    {
      "cat": "Architecture & Infra",
      "val": "Monorepo / CI/CD / GitHub Actions / GitLab Runner / Docker / AWS"
    },
    {
      "cat": "AI Workflow",
      "val": "Claude Code / MCP / Windsurf"
    },
    {
      "cat": "Testing",
      "val": "Playwright / Jest / Cucumber / RSpec"
    },
    {
      "cat": "Mobile",
      "val": "React Native / TestFlight"
    }
  ]
}
```
