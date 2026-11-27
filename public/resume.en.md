---
schema: resume
lang: en
name: Josh Wang
title: Software Developer
---

# Josh Wang — Resume

## Summary
- 10+ years of software development experience, rolling up my sleeves across full-stack web systems, Rails / Node.js / Go backends, and AWS / Cloudflare infrastructure
- Led architecture for 7+ web systems and 2 mobile apps, hired and led 3–4 person teams, and often step in to untangle legacy debt, monorepos, and CI/CD pipelines
- Lately focused on developer tooling, test automation, and AI workflows — mostly because tasks that can reliably retry in a queue shouldn't wake humans up after hours

## Experience
### Full-Stack Engineer — Independent
Jun 2023 – Present
#### Release Workflow Optimization & Security Patching | Data Analytics SaaS Startup
- Simplified team development and release workflows by consolidating 5 fragmented branches into 2, cutting operational overhead and establishing automated acceptance checks for more reliable releases
- Restructured the Monorepo and CI/CD pipeline, urgently patched the critical CVE-2025-29927 vulnerability, and introduced Claude with Playwright MCP to auto-generate Gherkin acceptance tests
#### Core Property Search System Evolution | Major Real Estate Group
- Stepped in as a key technical contributor on a high-traffic property search platform, delivering complex map POI filtering on schedule and shortening new-feature prototype validation to 1.5 days
- Rolled out a Claude Code and MCP-assisted workflow on the existing codebase for rapid requirement integration and API prototyping while decomposing legacy modules to clean up long-standing technical debt
#### Real-Time Market Data Module | Financial Trading Platform
- Took over an existing trading platform codebase to extend real-time stock quote and order book features while strengthening user permissions and data access security
- Built with Vue 3, Nuxt 3, and Pinia, integrating TradingView Widget and ECharts for live market charts and optimizing data access logic within the existing framework

### Front-End Developer (Platform & Architecture) — TeamT5 (Cybersecurity)
Oct 2021 – Jun 2023
#### ThreatSonar Product Architecture Planning
- Acted as a technical strategy advisor handling early feasibility validation and system planning, delivering technical specifications to guide a 4-person engineering team
- Leveraged prior Rails backend experience to advise on frontend/backend separation architecture and run technical selection experiments as the foundation for implementation
#### Website Cloud Migration & Event Platforms (CYBERSEC 2022/2023, InterOp23)
- Led the official website cloud migration and rebuild, cutting cloud costs by 90%, reducing page load time from 2.47s to 1.6s, and shrinking bundle size from 13.7MB to 8.4MB
- Replaced Firebase and Cloudinary with AWS S3, CloudFront, and Next.js, refactored 50%+ of legacy code, audited DNS records with MIS to eliminate redundant queries, built an auto-thumbnail file upload system with TypeScript and AWS SDK, and reused the same static deployment pipeline for major event sites
- Proactively identified plaintext password transmission and auth flaws in an external vendor system, escalating to leadership to drive remediation

### Front-End Lead — OEC Group
May 2019 – Oct 2021
#### Global Back-Office Platform & Team Leadership
- Hired 2 mid-level engineers and led a 3–4 person team, owning sprint planning, code reviews, and cross-department alignment while participating in regional server separation planning for internal users across 50+ countries
- Rebuilt the back-office architecture with React and WebSocket real-time notifications, advised on China and overseas server separation, engineered validated forms with nearly 100 fields for performance, and pioneered GitHub Actions CI/CD adoption in Aug 2019
#### Multilingual Official Website Rebuild
- Took over static HTML/CSS from an external vendor and launched a 13-language official website architecture within one month
- Implemented with Next.js and i18n routing to balance page load performance with ongoing content maintainability

### Web / Rails Developer — Startups (Fullinn, CatFi, myTreat, Ecowork)
Jul 2014 – Apr 2019
#### Full-Stack Products & Cloud Dev Workflow | Fullinn, myTreat, Ecowork (AWS Partner)
- Started in backend development at an AWS partner (Ecowork), independently building a customer service back-office and automated test reporting, and later led hotel website builder architecture and contributed to booking platform delivery at startups where the first client ranked on Google's first page within one week
- Worked across Ruby on Rails, Next.js, React, and GraphQL, helped DevOps set up automated testing and unified deployment workflows (Cucumber / RSpec), and defined REST API conventions to streamline team collaboration
#### Cross-Platform Mobile Apps | Fullinn, CatFi
- Built cross-platform mobile applications with push notifications, over-the-air updates, and live video streaming to lower release and operational costs
- Engineered with React Native, Redux, and Redux-saga, integrating Firebase Push Notification, Code Push, and WebRTC / RTMP streaming

## Projects
### TaiwanHaul — Taiwan Shopping & Price Guide for Southeast Asian Travelers
- Built a Taiwan must-buy product guide for Southeast Asian travelers (actively iterating), running daily price collection and guiding users to check in-store when reliable pricing is unavailable
- Designed full-stack architecture with a React frontend and Go search API deployed on Cloudflare Workers and D1 for low edge latency and minimal operating cost

### PickleScout — AI-Driven E2E Website Test Generator
- Built and open-sourced a test generation tool in one week where an AI agent explores a site to produce test suites, while exported daily CI runs require zero AI model calls
- Engineered a Fastify, BullMQ, and Redis job queue for retries and status tracking, pairing a browser agent with self-healing logic to export Gherkin specs, Playwright tests, and GitHub Actions workflows

## Selected Writing
- [Connecting local agent memory to Claude and ChatGPT on the web with an MCP gateway](https://joshwang.dev/en/blog/agent-memory-remote-mcp-gateway)
- [SSR or control: how I pick a React framework and a TypeScript backend](https://joshwang.dev/en/blog/react-ssr-backend-tradeoffs)

## Education
Wenzao Ursuline University of Languages — B.A. Digital Content Application and Management (Sep 2009 – Jun 2013)

## Skills
- **Backend & Database:** Node.js / Fastify / Go / Ruby on Rails / RESTful API / GraphQL / SQL / PostgreSQL / SQLite / Cloudflare D1 / Redis / BullMQ
- **Frontend:** TypeScript / React / Next.js / Vue 3 / Nuxt.js / Redux / Tailwind CSS
- **Architecture & Infra:** Monorepo / CI/CD / GitHub Actions / GitLab Runner / Docker / AWS / Cloudflare (Workers / Access)
- **AI Workflow:** Claude Code / MCP / Playwright MCP / Agent Workflow
- **Testing:** Playwright / Jest / Cucumber / RSpec
- **Mobile:** React Native / TestFlight

## Resume Data

```json
{
  "name": "Josh Wang",
  "title": "Software Developer",
  "subtitle": "Software developer working across full-stack architecture, cloud operations, and automated developer tooling",
  "heroDescription": "10+ years of software development experience across full-stack architecture, Rails / Node.js / Go backends, and developer tooling — because tasks that can reliably retry in a queue shouldn't wake humans up after hours",
  "location": "Taipei, Taiwan",
  "email": "spjay1@gmail.com",
  "site": "joshwang.dev",
  "siteHref": "https://joshwang.dev",
  "sectionLabels": {
    "summary": "Summary",
    "achievements": "Key Achievements",
    "experience": "Experience",
    "projects": "Projects",
    "writing": "Selected Writing",
    "education": "Education",
    "skills": "Skills"
  },
  "summaryLines": [
    "10+ years of software development experience, rolling up my sleeves across full-stack web systems, Rails / Node.js / Go backends, and AWS / Cloudflare infrastructure",
    "Led architecture for 7+ web systems and 2 mobile apps, hired and led 3–4 person teams, and often step in to untangle legacy debt, monorepos, and CI/CD pipelines",
    "Lately focused on developer tooling, test automation, and AI workflows — mostly because tasks that can reliably retry in a queue shouldn't wake humans up after hours"
  ],
  "achievements": [
    [
      "Cut cloud costs by 90% and page load time to 1.6s",
      "Supported systems across 50+ countries while hiring and leading teams"
    ],
    [
      "Cut AI-assisted feature prototype validation to 1.5 days",
      "Built full-stack products and AI-assisted developer tooling independently"
    ]
  ],
  "jobs": [
    {
      "title": "Full-Stack Engineer",
      "company": "Independent",
      "period": "Jun 2023 – Present",
      "groups": [
        {
          "subhead": "Release Workflow Optimization & Security Patching | Data Analytics SaaS Startup",
          "bullets": [
            "Simplified team development and release workflows by consolidating 5 fragmented branches into 2, cutting operational overhead and establishing automated acceptance checks for more reliable releases",
            "Restructured the Monorepo and CI/CD pipeline, urgently patched the critical CVE-2025-29927 vulnerability, and introduced Claude with Playwright MCP to auto-generate Gherkin acceptance tests"
          ]
        },
        {
          "subhead": "Core Property Search System Evolution | Major Real Estate Group",
          "bullets": [
            "Stepped in as a key technical contributor on a high-traffic property search platform, delivering complex map POI filtering on schedule and shortening new-feature prototype validation to 1.5 days",
            "Rolled out a Claude Code and MCP-assisted workflow on the existing codebase for rapid requirement integration and API prototyping while decomposing legacy modules to clean up long-standing technical debt"
          ]
        },
        {
          "subhead": "Real-Time Market Data Module | Financial Trading Platform",
          "bullets": [
            "Took over an existing trading platform codebase to extend real-time stock quote and order book features while strengthening user permissions and data access security",
            "Built with Vue 3, Nuxt 3, and Pinia, integrating TradingView Widget and ECharts for live market charts and optimizing data access logic within the existing framework"
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
          "subhead": "ThreatSonar Product Architecture Planning",
          "bullets": [
            "Acted as a technical strategy advisor handling early feasibility validation and system planning, delivering technical specifications to guide a 4-person engineering team",
            "Leveraged prior Rails backend experience to advise on frontend/backend separation architecture and run technical selection experiments as the foundation for implementation"
          ]
        },
        {
          "subhead": "Website Cloud Migration & Event Platforms (CYBERSEC 2022/2023, InterOp23)",
          "bullets": [
            "Led the official website cloud migration and rebuild, cutting cloud costs by 90%, reducing page load time from 2.47s to 1.6s, and shrinking bundle size from 13.7MB to 8.4MB",
            "Replaced Firebase and Cloudinary with AWS S3, CloudFront, and Next.js, refactored 50%+ of legacy code, audited DNS records with MIS to eliminate redundant queries, built an auto-thumbnail file upload system with TypeScript and AWS SDK, and reused the same static deployment pipeline for major event sites",
            "Proactively identified plaintext password transmission and auth flaws in an external vendor system, escalating to leadership to drive remediation"
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
          "subhead": "Global Back-Office Platform & Team Leadership",
          "bullets": [
            "Hired 2 mid-level engineers and led a 3–4 person team, owning sprint planning, code reviews, and cross-department alignment while participating in regional server separation planning for internal users across 50+ countries",
            "Rebuilt the back-office architecture with React and WebSocket real-time notifications, advised on China and overseas server separation, engineered validated forms with nearly 100 fields for performance, and pioneered GitHub Actions CI/CD adoption in Aug 2019"
          ]
        },
        {
          "subhead": "Multilingual Official Website Rebuild",
          "bullets": [
            "Took over static HTML/CSS from an external vendor and launched a 13-language official website architecture within one month",
            "Implemented with Next.js and i18n routing to balance page load performance with ongoing content maintainability"
          ]
        }
      ]
    },
    {
      "title": "Web / Rails Developer",
      "company": "Startups (Fullinn, CatFi, myTreat, Ecowork)",
      "period": "Jul 2014 – Apr 2019",
      "borderBottom": false,
      "groups": [
        {
          "subhead": "Full-Stack Products & Cloud Dev Workflow | Fullinn, myTreat, Ecowork (AWS Partner)",
          "bullets": [
            "Started in backend development at an AWS partner (Ecowork), independently building a customer service back-office and automated test reporting, and later led hotel website builder architecture and contributed to booking platform delivery at startups where the first client ranked on Google's first page within one week",
            "Worked across Ruby on Rails, Next.js, React, and GraphQL, helped DevOps set up automated testing and unified deployment workflows (Cucumber / RSpec), and defined REST API conventions to streamline team collaboration"
          ]
        },
        {
          "subhead": "Cross-Platform Mobile Apps | Fullinn, CatFi",
          "bullets": [
            "Built cross-platform mobile applications with push notifications, over-the-air updates, and live video streaming to lower release and operational costs",
            "Engineered with React Native, Redux, and Redux-saga, integrating Firebase Push Notification, Code Push, and WebRTC / RTMP streaming"
          ]
        }
      ]
    }
  ],
  "project": {
    "title": "PickleScout — AI-Driven E2E Website Test Generator",
    "period": "May 2026",
    "subtitle": "Open Source Side Project",
    "href": "https://github.com/iskWang/PickleScout",
    "bullets": [
      "Built and open-sourced a test generation tool in one week where an AI agent explores a site to produce test suites, while exported daily CI runs require zero AI model calls",
      "Engineered a Fastify, BullMQ, and Redis job queue for retries and status tracking, pairing a browser agent with self-healing logic to export Gherkin specs, Playwright tests, and GitHub Actions workflows"
    ]
  },
  "projects": [
    {
      "title": "TaiwanHaul — Taiwan Shopping & Price Guide for Southeast Asian Travelers",
      "period": "2026",
      "subtitle": "Independent Product (WIP)",
      "href": "https://taiwanhaul.com/",
      "bullets": [
        "Built a Taiwan must-buy product guide for Southeast Asian travelers (actively iterating), running daily price collection and guiding users to check in-store when reliable pricing is unavailable",
        "Designed full-stack architecture with a React frontend and Go search API deployed on Cloudflare Workers and D1 for low edge latency and minimal operating cost"
      ]
    },
    {
      "title": "PickleScout — AI-Driven E2E Website Test Generator",
      "period": "May 2026",
      "subtitle": "Open Source Side Project",
      "href": "https://github.com/iskWang/PickleScout",
      "bullets": [
        "Built and open-sourced a test generation tool in one week where an AI agent explores a site to produce test suites, while exported daily CI runs require zero AI model calls",
        "Engineered a Fastify, BullMQ, and Redis job queue for retries and status tracking, pairing a browser agent with self-healing logic to export Gherkin specs, Playwright tests, and GitHub Actions workflows"
      ]
    }
  ],
  "writing": [
    {
      "title": "Connecting local agent memory to Claude and ChatGPT on the web with an MCP gateway",
      "href": "https://joshwang.dev/en/blog/agent-memory-remote-mcp-gateway"
    },
    {
      "title": "SSR or control: how I pick a React framework and a TypeScript backend",
      "href": "https://joshwang.dev/en/blog/react-ssr-backend-tradeoffs"
    }
  ],
  "education": {
    "school": "Wenzao Ursuline University of Languages",
    "period": "Sep 2009 – Jun 2013",
    "degree": "B.A. Digital Content Application and Management"
  },
  "skills": [
    {
      "cat": "Backend & Database",
      "val": "Node.js / Fastify / Go / Ruby on Rails / RESTful API / GraphQL / SQL / PostgreSQL / SQLite / Cloudflare D1 / Redis / BullMQ"
    },
    {
      "cat": "Frontend",
      "val": "TypeScript / React / Next.js / Vue 3 / Nuxt.js / Redux / Tailwind CSS"
    },
    {
      "cat": "Architecture & Infra",
      "val": "Monorepo / CI/CD / GitHub Actions / GitLab Runner / Docker / AWS / Cloudflare (Workers / Access)"
    },
    {
      "cat": "AI Workflow",
      "val": "Claude Code / MCP / Playwright MCP / Agent Workflow"
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
