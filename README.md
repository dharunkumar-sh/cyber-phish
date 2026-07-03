<div align="center">
  <h1 style="background: linear-gradient(135deg, #0f2027, #203a43, #2c5364); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Cyber Phish</h1>
  <p style="color: #64b5f6;">Real‑time phishing detection & threat intelligence platform</p>
</div>

![Version](https://img.shields.io/badge/version-0.1.0-blue) &nbsp;![Stars](https://img.shields.io/github/stars/dharunkumar-sh/cyber-phish?style=social) &nbsp;![Forks](https://img.shields.io/github/forks/dharunkumar-sh/cyber-phish?style=social) &nbsp;![License](https://img.shields.io/github/license/dharunkumar-sh/cyber-phish) &nbsp;![Tech Stack](https://img.shields.io/badge/tech-Node.js%20%26%20TypeScript-green)

<details><summary>📖 Interactive Table of Contents</summary>

- [Description](#description)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

</details>

## Description
**Cyber Phish** is a Next.js web application that provides real‑time phishing URL detection, comprehensive threat analysis, and actionable security reports. Leveraging OpenAI for AI‑driven analysis and a serverless Neon database via Drizzle ORM, the platform helps security teams and developers identify, evaluate, and mitigate phishing and other web‑based threats.

## Features
- 🔍 **Phishing URL scanning** – Analyze any URL for malicious content.  
- 🛡️ **Multi‑vector threat intel** – DNS, WHOIS, SSL, and IP reputation checks.  
- 📊 **Interactive dashboard** – Visualize scan history, threat trends, and top statistics.  
- 🤖 **AI‑powered analysis** – OpenAI GPT models generate detailed threat explanations.  
- 📄 **Report generation** – Export scan results as PDF or JSON.  
- 🔗 **RESTful API** – Programmatic access to scanning and reporting endpoints.  
- 🎨 **Modern UI** – Built with React, Tailwind CSS, and Framer Motion for smooth animations.  

## Tech Stack
| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| **UI Components** | Lucide React icons, custom components (Header, Sidebar, Dashboard widgets) |
| **Backend** | API routes (Next.js App Router), Serverless Neon database, Drizzle ORM |
| **AI** | OpenAI GPT‑4 (via OpenAI SDK) |
| **Utilities** | Zod (validation), jspdf (PDF export), loggers, error handlers |
| **DevOps** | npm scripts, ESLint, Prettier, TypeScript, VSCode settings |
| **Deployment** | Vercel (recommended) |

## Getting Started
### Prerequisites
- Node.js ≥ 18.x  
- npm ≥ 9.x (or yarn/pnpm)  
- A **Neon** database connection string (`DATABASE_URL`)  
- An **OpenAI** API key (`OPENAI_API_KEY`)  

### Installation
```bash
# Clone the repository
git clone https://github.com/dharunkumar-sh/cyber-phish.git
cd cyber-phish

# Install dependencies
npm install

# Copy the example environment file and fill in your credentials
cp .env.example .env
# Edit .env with your DATABASE_URL and OPENAI_API_KEY
```

### Development
```bash
npm run dev
# Open http://localhost:3000 in your browser
```

### Production Build
```bash
npm run build
npm start
```

## Usage
### Scanning a URL via API
```bash
curl -X POST http://localhost:3000/api/scans \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example-phishing.com"}'
```

Response:
```json
{
  "scanId": "scan_12345",
  "status": "completed",
  "threatScore": 87,
  "details": {
    "phishing": true,
    "maliciousDomain": true,
    "sslIssues": false,
    "whoisRisk": "high"
  },
  "aiAnalysis": "The URL exhibits typical phishing characteristics..."
}
```

### Generating a PDF Report
```ts
import { generatePdf } from '@/lib/utils/pdfExport';
import { prisma } from '@/lib/db';

async function createReport(scanId: string) {
  const scan = await prisma.scan.findUnique({ where: { id: scanId } });
  await generatePdf(scan, 'report.pdf');
}
```

## Folder Structure
```tree
cyber-phish
├─ app
│  ├─ api
│  │  ├─ analytics
│  │  ├─ analyze
│  │  ├─ health
│  │  ├─ reports
│  │  ├─ scans
│  │  └─ health
│  ├─ dashboard
│  │  ├─ analysis
│  │  ├─ history
│  │  ├─ intelligence
│  │  ├─ page
│  │  ├─ reports
│  │  ├─ settings
│  │  └─ page.tsx
│  ├─ layout.tsx
│  ├─ page.tsx
│  └─ globals.css
├─ components
│  ├─ FAQ.tsx
│  ├─ Features.tsx
│  ├─ Footer.tsx
│  ├─ Header.tsx
│  ├─ Hero.tsx
│  ├─ InputSection.tsx
│  ├─ Layout.tsx
│  ├─ Navbar.tsx
│  ├─ OutputDashboard.tsx
│  ├─ ProcessSection.tsx
│  ├─ Sidebar.tsx
│  ├─ WhySection.tsx
│  ├─ WorkflowSection.tsx
│  └─ dashboard
│     ├─ AIAssistant.tsx
│     ├─ AnalysisResults.tsx
│     ├─ ReportPreview.tsx
│     ├─ ScanHistory.tsx
│     ├─ ScanTimeline.tsx
│     ├─ SecurityRecommendations.tsx
│     ├─ ThreatAnalysisConsole.tsx
│     ├─ ThreatIntelligence.tsx
│     ├─ ThreatOverview.tsx
│     ├─ TopStats.tsx
│  └─ ... (other component folders)
├─ lib
│  ├─ config
│  │  └─ env.ts
│  ├─ db
│  │  ├─ index.ts
│  │  └─ schema.ts
│  ├─ types
│  │  └─ index.ts
│  └─ utils
│     ├─ errors.ts
│     ├─ logger.ts
