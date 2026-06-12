# GoldTubeHouse 商業需求文檔 (Business Requirements Document)

> **文檔用途**：本文件記錄 GoldTubeHouse 前端操作中，與「章節章節的合併 (Merge) 與隱藏 (Hide/Collapse)」相關的完整商業邏輯，以及背後的狀態機設計。每次新對話開始前，AI 助手應優先閱讀此文件，避免重複提問造成時間與 Token 浪費。

---

## 1. 問題背景與使用情境

使用者將一個長影片的 YouTube 章節清單（如下方範例）貼入右側邊欄的「章節標記」輸入框：

```
00:00 - Intro
00:43 - Automations vs Agents
16:38 - n8n Foundations
53:07 - Nodes in n8n
01:13:20 - Automation 1
01:18:08 - Automation 1 Indepth
01:55:56 - JSON in n8n
02:27:32 - API Walkthrough
02:40:41 - Automation 2
03:31:37 - AI Automation and Agents
04:27:29 - Gmail Reply Agent
05:01:32 - Telegram Personal Assistant
05:13:08 - Telegram Single Agent
06:03:19 - Multi Agent System
06:35:19 - AI to Application
07:04:03 - Automation Outro
07:05:17 - Hosting n8n Locally + Cloud
07:18:15 - Hosting on Cloud
07:28:08 - Hosting Outro
07:29:48 - Thanks you and Subscribe
```

系統根據章節時間軸將字幕分成多張 **Subtitle Card（字幕卡片）**，每個章節對應一張卡片。

---

## 2. 核心操作：合併 (Merge)

### 2.1 什麼是合併？

合併是指：**將相鄰兩張（或多張）字幕卡片的邊界移除，使它們在送 AI 時作為同一個區塊處理**。

合併後的卡片在 UI 上視覺效果：
- **保持各自獨立的 UI 卡片（不消失）**，仍然在「編輯與分割區塊」分頁中顯示。
- 卡片之間的分割線/按鈕會更改為「已合併」狀態（例如按鈕變成可「取消合併」的樣式）。
- 在 AI 計費預估與 AI 送出時，被合併的卡片**合併成一個 Group**，作為單一請求送出。

### 2.2 合併的底層狀態

合併的核心狀態變數是 `removedBoundaryTimes: number[]`（存於 `localStorage` 的 `gth_removedBoundaryTimes`）。

- 這個陣列**記錄的是「哪些分段的起始時間（秒）被移除了邊界」**。
- 例如，若 `00:43 - Automations vs Agents`（起始秒數 43）的邊界被移除，則 43 被加入 `removedBoundaryTimes`，代表「這張卡片與前一張卡片合併」。
- 一個 Group 可以包含兩張以上的卡片，只要它們之間所有的邊界時間都在 `removedBoundaryTimes` 中。

### 2.3 已完成的合併情形（使用者說明）

使用者已對下列章節進行了合併，且**確認為商業上正確的狀態**：

#### ✅ 合併組 A（已完成）
| 章節 | 起始時間 |
|------|---------|
| `00:00 - Intro` | 00:00 |
| `00:43 - Automations vs Agents` | 00:43 |
| `16:38 - n8n Foundations` | 16:38 |

→ 前三個章節合併為一組，AI 一次處理。

#### ✅ 合併組 B（已完成）
| 章節 | 起始時間 |
|------|---------|
| `01:55:56 - JSON in n8n` | 01:55:56 |
| `02:27:32 - API Walkthrough` | 02:27:32 |

→ 這兩個章節合併為一組，AI 一次處理。

#### ⚠️ 誤操作：Automation 1 被錯誤合併
- `01:13:20 - Automation 1` 被不小心與其他章節合併（使用者描述為「不小心與其他合併」）。
- 使用者的意圖：**讓 Automation 1 這張卡片「隱藏」**，而不是與其他章節進行語意上的合併。
- **根本原因**：`Automation 1`（01:13:20）與 `Automation 1 Indepth`（01:18:08）僅相差 5 分鐘不到，幾乎等同於重複/冗餘的章節標記，使用者不希望 AI 對這個極短的區塊進行處理，因此選擇「隱藏」。

---

## 3. 核心操作：隱藏 (Hide / Collapse)

### 3.1 什麼是隱藏？

隱藏（或折疊，Collapse）是指：**將某張字幕卡片從 AI 處理佇列中排除，且在 UI 上摺疊縮小**，使使用者在瀏覽時不需要看到它。

隱藏≠合併：
| 操作 | 卡片 UI 是否存在？ | AI 是否處理？ | 字幕文字是否合入相鄰卡片？ |
|------|------------------|--------------|--------------------------|
| **合併** | 保留，標記為「已合併」 | ✅ 合入同組一起處理 | ✅ 是 |
| **隱藏** | 摺疊縮小，視覺上收起 | ❌ 排除，不單獨處理 | ❌ 否 |

### 3.2 隱藏的底層狀態

隱藏的核心狀態變數是 `collapsedChapters: Set<string>`（存於 `localStorage` 的 `gth_collapsedChapters`）。

- 這個 Set 記錄**已被折疊（隱藏）的章節標識符（通常是章節標題或索引 key）**。
- 被折疊的章節在「編輯與分割區塊」分頁中縮小顯示，但不送入 AI。

### 3.3 使用者對「Automation 1」的意圖

> **使用者想要的行為**：對 `01:13:20 - Automation 1` 這個章節進行**隱藏（Collapse）**，而非合併（Merge）。

原因：
- `Automation 1`（01:13:20 ~ 01:18:08）總共約 **5 分鐘**，本身是 `Automation 1 Indepth` 的「引言/預告」，語意上高度重疊。
- 使用者認為這 5 分鐘的字幕不需要單獨送 AI 整理，且視覺上也不希望它佔用顯示空間。
- 正確做法：對這張卡片執行**Collapse（隱藏）**操作，使其從 AI 計費與 AI 送出中排除。

---

## 4. 兩種操作的觸發邏輯（前端 UI）

### 4.1 合併（Merge）的觸發方式
1. 在「編輯與分割區塊」分頁中，每兩張相鄰卡片之間有一個「合併」按鈕（或稱「移除邊界」按鈕）。
2. 點擊後：相鄰卡片的邊界時間（後一張的 `seg.start`）被加入 `removedBoundaryTimes`。
3. 也可在右側邊欄的「**範圍合併 (Range Merging)**」功能（`RangeMerging.tsx` 元件）中，選擇起始與結束的卡片索引進行批次合併。
4. 可點擊「取消合併」撤回，將該時間從 `removedBoundaryTimes` 中移除。

### 4.2 隱藏（Collapse）的觸發方式
1. 每張章節的 Header（章節標題行）有一個**折疊/展開箭頭按鈕**。
2. 點擊後：該章節的 `groupKey`（章節標識符）被加入/移除 `collapsedChapters` Set。
3. 折疊後在 UI 上只顯示章節標題列，隱藏內容文字。
4. **折疊後的卡片不會被計入 AI 費用預估，也不會被納入 AI 送出的請求**。

---

## 5. 商業需求彙整（AI 工作清單）

每次接到與「章節合併/隱藏」相關的需求時，AI 應核對以下清單：

### ✅ 正確理解的狀態（勿再詢問）
- [ ] 合併組 A（Intro + Automations vs Agents + n8n Foundations）：**已完成，維持現狀**。
- [ ] 合併組 B（JSON in n8n + API Walkthrough）：**已完成，維持現狀**。
- [ ] `Automation 1`（01:13:20）需要**隱藏（Collapse）**，不是合併（Merge）。

### 🔧 待確認/實作的需求
- [ ] 確認前端 `collapsedChapters` 折疊狀態是否影響 AI 費用預估（`totalTokens` 計算邏輯應排除折疊卡片的文字）。
- [ ] 確認前端 `collapsedChapters` 折疊狀態是否影響 AI 送出（送出時應跳過折疊卡片）。
- [ ] 如果目前折疊功能**只做 UI 視覺折疊，而未排除 AI 計費/送出**，則需要補充此邏輯。

### 5.1 專業術語提取的分批限制 (Professional Terms Batch Limit)

* **商業限制**：為節省 API 呼叫次數，對於專業術語（Terms）的提取，**最多只允許 7 次 AI 請求（即最多分成 7 個批次）**。
* **技術解決方案**：
  * 當影片總時長（或有效時長）過長時，系統會動態調整每個批次的目標長度：
    `targetDuration = Math.max(3600, Math.ceil(totalDuration / 7))`。
  * 剩餘尾部合併門檻：`minRemaining = Math.max(1800, Math.ceil(targetDuration / 2))`。
  * 這能確保較短的影片依然按標準 1 小時 (3600秒) 切分，而超長影片則會動態拉長每批的容量，確保**總批次數永遠不會超過 7 批**。
* **已寫入單元測試**：於 [test_frontend_segmentation.ts](file:///Users/linchengyi/PycharmProjects/GoldTubeHouse/tests/test_frontend_segmentation.ts) 的 `Case 10` 中對此動態上限機制進行了邊界測試驗證。

### 5.2 AI 標題結構對照機制 (AI Header Structuring Alignment)

* **商業需求**：當相鄰多個小章節（如五分鐘的引言 `Automation 1`）與主章節（如 `Automation 1 Indepth`）合併送給 AI 整理時，產出的重點筆記必須保留該章節的結構歸屬，不能混淆。
* **技術解決方案**：
  * 前端會將該批次所含的所有章節時間點與名稱（如 `* [01:13:20] Automation 1`）整理成 `current_title` 參數發送。
  * **提示詞優化 (Prompt Optimization)**：已修改 [prompt_note.txt](file:///Users/linchengyi/PycharmProjects/GoldTubeHouse/prompts/prompt_note.txt) 與 [server.py](file:///Users/linchengyi/PycharmProjects/GoldTubeHouse/server.py) 中的 Prompt 第一條，明確指令 AI：「*段落請用 Markdown 標題（#）標註。段落標題必須是具體的內容子主題（例如「# Webhook 觸發器設定」），而非直接使用章節時間。請確保所有整理出的子主題與內容皆符合【目前正在整理的章節】（例如 Automation 1 或 Automation 1 Indepth）的語意範圍與主題。*」
  * 這樣即使內容被打包合併或被切細分，AI 也會像原先一樣輸出具體的內容子主題標題（例如 `# Webhook 觸發器設定`、`# HTTP 請求節點配置`），但會被明確約束在目前處理的章節語意範圍內，避免失焦。

---

## 6. 狀態持久化（LocalStorage Keys 速查表）

| Key 名稱 | 對應狀態 | 儲存格式 | 用途說明 |
|---------|---------|---------|---------|
| `gth_removedBoundaryTimes` | `removedBoundaryTimes` | `number[]`（JSON） | 被移除邊界的分段起始時間（秒），用於合併 |
| `gth_collapsedChapters` | `collapsedChapters` | `string[]`（JSON） | 被折疊的章節 key 列表，用於隱藏 |
| `gth_chaptersInput_v2` | `chaptersInput` | `string` | 使用者貼入的原始章節標記文字 |
| `gth_chaptersVideoId_v2` | — | `string` | 記錄最後一次載入的影片 ID，用於防污染清除 |

---

## 7. 關鍵元件與程式碼位置速查

| 功能 | 元件/檔案 | 主要 Props/State |
|------|---------|----------------|
| 章節解析 | `App.tsx` 的 `parsedChapters` useMemo | `chaptersInput` |
| 合併狀態管理 | `App.tsx` 的 `removedBoundaryTimes` state | `gth_removedBoundaryTimes` |
| 隱藏狀態管理 | `App.tsx` 的 `collapsedChapters` state | `gth_collapsedChapters` |
| 合併 UI 操作 | `EditSegmentsTab.tsx` | `removedBoundaryTimes`, `collapsedChapters` |
| 範圍批次合併 | `RangeMerging.tsx` | `removedBoundaryTimes`, `flatActiveSegments` |
| AI 整合群組 | `App.tsx` 的 `aiGroups` useMemo（約 Line 500） | `flatActiveSegments`, `removedBoundaryTimes` |
| AI 費用預估群組 | `App.tsx` 的 `costGroups` useMemo（約 Line 590） | `currentSegments`, `removedBoundaryTimes` |

---

## 8. 邊界條件與防呆設計

1. **影片切換防污染**：當使用者載入新影片時，`chaptersInput` 會被自動清空（以 `gth_chaptersVideoId_v2` 比對是否同一影片），避免舊章節資料干擾新影片的分段。
2. **合併邊界鎖定**：`maxMergedEndIdx` 確保範圍合併選擇器的起始 index 不能小於或等於最後一個已合併段落的 index，防止在已處理/已合併區塊中選取。
3. **隱藏章節（Collapsed）不影響底層分段演算法**：`collapsedChapters` 僅影響 UI 顯示與 AI 送出，底層的 `flatActiveSegments` 仍包含所有分段資料，不會因折疊而改變時間軸計算。

---

## 9. 本文件更新規則

> 每次使用者提出新的商業需求（例如「這個章節要隱藏」、「這幾個章節要合併」），AI 應：
> 1. 先閱讀本文件，核對現有的已知狀態。
> 2. 執行對應的程式碼修改。
> 3. **更新本文件（`business_requirements.md`）的對應章節**，將新需求追加至「已完成」或「待確認」清單，保持文件永遠是最新狀態。

