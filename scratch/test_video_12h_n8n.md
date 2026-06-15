# 測試用：12 小時 n8n 課程影片

## 影片資訊
- **URL**: https://www.youtube.com/watch?v=7_PeuTsx7UM
- **總長度**: 約 12 小時
- **用途**: 長影片術語分批測試（預期術語批次 ≥ 12 次）

## 章節時間戳記（貼入「章節分割」欄位）

```
00:00 - Intro
02:09 - Module 1
29:06 - Module 2
2:26:48 - Module 3
3:08:35 - Module 4
4:23:52 - Module 5
9:09:02 - Module 6
12:02:51 - Outro
```

## 完整 Module 說明

### ✅ Module 1 — Getting Started with n8n (Foundations)
- What automation really means and how it applies to everyday tasks
- Understanding the n8n dashboard, pricing, and workflow executions
- Building your first workflow step-by-step
- Understanding triggers, nodes, variables, and expressions
- Workflow best practices and debugging

### ⚙️ Module 2 — Core n8n Foundations (Automation Logic & APIs)
- How APIs and Webhooks actually work
- Making your first HTTP request inside n8n
- Understanding requests, responses, headers, and API keys
- Error handling, evaluations, and testing automations safely

### 🧩 Module 3 — AI Agent Fundamentals
- Understand what are AI Agents
- How they differ from normal workflows
- How they operate in n8n
- Build Your First AI Agent

### 🤖 Module 4 — Building Smarter AI Systems (Frameworks & Prompts)
- How to combine AI with automation to build intelligent systems
- Understanding how to structure prompts and chain reasoning
- Architecture for building scalable AI systems

### 🧠 Module 5 — Real-World AI Agent Projects
- RAG AI Agent
- Customer Support AI Agent
- Invoice Processing AI Agent
- Sales Team AI Agent (Human-in-the-Loop)
- Self-Learning AI Agent
- Resume Screening AI Agent
- Inbox Automation AI Agent
- Blog Writing AI System
- Research AI Agent (with Perplexity AI)
- Voice AI Agent (using ElevenLabs)
- Stock Analyst AI Agent
- Personal AI Assistant

### 🚀 Module 6 — Real-World Workflow Projects
- Instagram Content AI System
- Viral Content Writing AI System
- Viral Content Finder AI System
- Client Onboarding Automation (Notion + n8n)
- LinkedIn Outreach Automation AI System
- Sales Call Analysis AI System
- Lead Scraper AI System

## 預期測試結果
- `isShortVideo` = `false`（因為有章節 + 超過 35 分鐘上限）
- 筆記批次 (p1Calls) = 約 8 個（依段落切分）
- 術語批次 (p2Calls) = 約 12 次（每 60 分鐘一次）
- SRT 複製按鈕可於各 Chapter 群組展開後使用
