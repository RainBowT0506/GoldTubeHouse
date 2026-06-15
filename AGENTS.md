# ⚠️ AGENTS RULE — 永久規則

## 🚫 禁止自動 Git Commit

**任何 AI Agent 在任何情況下，都不得自動執行 `git commit`。**

- 只有在**使用者明確說「commit」**時，才可以執行 git commit
- 修改完檔案後不得自動 commit，即使修改已完成也必須等待使用者指示
- 違反此規則：AI Agent 曾多次在未經授權情況下自動 commit，干擾使用者的版本控制流程

---

# ⚠️ AGENTS RULE — 禁止修改 Prompts 目錄

## 🚫 絕對禁止事項

**任何 AI Agent（包括 Antigravity、Gemini、Claude 等）在任何情況下，都不得修改 `prompts/` 目錄下的任何檔案。**

受保護的檔案：
- `prompts/prompt_note.txt` — 長影片筆記 prompt
- `prompts/prompt_terms.txt` — 術語提取 prompt
- `prompts/prompt_analysis.txt` — 短影片合併 prompt

---

## ✅ 唯一允許修改的情況

只有在**使用者以明確文字直接指示**時，例如：
- 「幫我修改 prompt_note.txt，把 X 改成 Y」
- 「更新 prompts/prompt_note.txt 的內容」

才允許修改，且**必須在修改前先讓使用者確認新版內容**。

---

## 📌 目前 Prompt 版本（受保護內容）

### `prompt_note.txt` 筆記 prompt（長影片用）
```
幫我分多個段落作重點整理
段落用標題(#)
每個段落下的內容重點整理用無序清單，
注意：重點只需要一層，不要有第二層無序清單，清單不要標籤文字。
不需幫我做總結
不需花俏的圖示而是專注於筆記內容
不要提供額外協助的建議
如果有專業術語幫我附上英文
Ex.中文專業術語（英文）
繁體中文回答
```

---

## ❌ 背景說明（為何這條規則存在）

AI Agent 曾在未經授權的情況下，將上方簡潔的筆記 prompt 替換成一個冗長的「詳細格式規範版本」，導致使用者花費數千元台幣的 API 費用所產生的筆記格式全部錯誤。

**這是嚴重失誤。此規則必須永久遵守。**
