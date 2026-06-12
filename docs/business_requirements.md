# GoldTubeHouse — 商業需求文檔 (BRD)

> **版本**：v1.0 | **更新日期**：2026-06-13  
> **目的**：讓每一個新 AI session 不需重新理解需求，直接從此文檔出發。

---

## 1. 產品概述

GoldTubeHouse 是一款 **YouTube 影片字幕整理工具**，核心流程為：

1. 輸入 YouTube 影片網址（或手動貼上字幕）
2. 系統自動下載字幕、依章節切分為段落
3. 使用者手動調整分段、合併相鄰章節
4. 呼叫 OpenAI API，批次自動整理每段字幕為 Markdown 筆記 + 專業術語對照表

---

## 2. 使用者操作流程

```
[首頁] 輸入 YT URL
  → [Loading] 後端下載字幕
  → [App 主畫面]
      ├── 左側：字幕分段區塊（Edit Tab）
      │     ├── 閱讀 / 編輯每個段落文字
      │     ├── 在段落間點擊「⊕ 合併此章節」（逐一合併）
      │     └── Enter 鍵手動切分段落
      ├── 右側 Sidebar
      │     ├── VideoCard：影片資訊
      │     ├── OpenAISettings：填入 API Key / 選擇模型
      │     ├── ChaptersInput：貼上 YouTube 章節清單
      │     ├── 🔗 AI 整合範圍合併（批次合併工具）
      │     ├── SettingsParameters：調整段落時長參數
      │     └── CostEstimation：預估費用 → 確認送出 AI
      ├── [AI 筆記 Tab] 顯示整理後的 Markdown 筆記
      └── [術語 Tab] 顯示專業術語中英對照
```

---

## 3. 核心功能模組

### 3.1 字幕擷取（後端）

- **主要路由**：`POST /api/process-video`（接收 `{ url: string }`）
- 下載策略（依序嘗試）：
  1. YouTube Data API
  2. yt-dlp
  3. downsub
- 回傳格式：`{ status, video_id, title, duration, thumbnail, subtitles[] }`
- 字幕格式支援：`.vtt`、`.srt`
- 字幕重疊處理：`resolveSubtitleOverlaps()` 在前端載入時自動執行

### 3.2 手動匯入

- 入口：首頁「手動匯入」按鈕，開啟 Modal
- 接受格式：純文字字幕（VTT / SRT 格式）
- 解析後建立假 videoData（`video_id = 'manual_' + Date.now()`）

### 3.3 段落生成邏輯（`generateSegments`）

位置：`frontend/src/utils.ts`

**輸入參數**：
| 參數 | 說明 |
|------|------|
| `subtitles[]` | 原始字幕陣列 |
| `duration` | 影片總長（秒） |
| `chapterSplits[]` | 從 ChaptersInput 解析的章節時間點 |
| `customSplits[]` | 使用者手動 Enter 切分的時間點 |
| `settingsInterval` | 無章節時，每段預設時長（秒），預設 20 分 |
| `settingsNoSegment` | 無字幕區塊最大時長（秒），預設 30 分 |
| `settingsSubSegment` | 子段落最大時長（秒），預設 30 分 |

**生成邏輯**：
- 有章節時：以章節時間點切割，每章節為一個頂層 Segment
- 無章節時：以 `settingsInterval` 等長切割
- 章節內部若字幕過長，自動切分為 subSegments（子段落）
- 子段落標題格式：`HH:MM:SS ~ HH:MM:SS`

**Segment 資料結構**：
```ts
interface Segment {
  id: string;              // 唯一識別碼
  chapterTitle: string;    // 章節標題
  subTitle?: string;       // 子段落時間範圍文字（僅子段落有）
  start: number;           // 開始秒數
  end: number;             // 結束秒數
  subtitles: Subtitle[];   // 屬於此段的字幕
  isGroup?: boolean;       // 是否為含子段落的章節群組
  isSubSegment?: boolean;  // 是否為子段落
  subSegments?: Segment[]; // 子段落陣列（isGroup 時）
}
```

**flatActiveSegments**：
- 從 `currentSegments` 展平得到，將 isGroup 的子段落全部攤平為一維陣列
- 這是 AI 整合計費、範圍合併的基準清單

---

### 3.4 🔗 AI 整合範圍合併

這是最複雜的功能，需完整紀錄。

#### 核心概念

「合併」不是真正合併資料結構，而是在 `removedBoundaryTimes: number[]` 陣列中記錄「被移除的邊界時間點」。

```
flatActiveSegments = [A, B, C, D, E]
若 B.start 在 removedBoundaryTimes 中 → A 和 B 被視為同一個 AI 群組
若 C.start 也在 removedBoundaryTimes 中 → A + B + C 同一群組
```

#### 合併方式 1：逐一合併（Edit Tab 中）

- 每個段落之間有「⊕ 合併此章節 (AI 整合)」按鈕
- 點擊 → 呼叫 `handleMergeWithNext(nextSegment.start)`
- 若已合併 → 按鈕變成「⊖ 取消 AI 整合」，再點擊取消合併

#### 合併方式 2：批次範圍合併（Sidebar 右側卡片）

卡片標題：**🔗 AI 整合範圍合併**

**UI 元素**：
1. **🧠 已合併的 AI 整合區間**（清單，顯示所有目前已合併的連續群組）
   - 每一列：`{分鐘數}分 ⏱️ {startTime} ~ {endTime} ({n} 區塊)` + 「拆分 🔓」按鈕
2. **起始區塊** 下拉選單（`batchStartIdx`）
3. **結束區塊** 下拉選單（`batchEndIdx`）
4. **🔗 範圍合併** 按鈕 → `handleBatchMerge()`
5. **🔓 範圍拆分** 按鈕 → `handleBatchSplit()`

#### 下拉選單的顯示規則（重要業務規則）

**每個下拉選項的 label 格式**：
```
{startTime} ~ {endTime} ({duration}分{秒}秒) - {chapterTitle} [(細分區間)]
```
時間格式使用 `formatTime()`（與章節時間欄位一致），例如：`16:38`、`1:13:20`

**起始區塊下拉選單過濾規則**：
- 若段落「已屬於某個合併群組的任一部分」→ **隱藏**（不顯示在選單中）
- 判斷邏輯（`isMerged` 條件，任一為 true 即隱藏）：
  - `opt.index > 0 && removedBoundaryTimes.includes(opt.time)` → 此段的 start 是被移除的邊界（內部/結尾段）
  - `removedBoundaryTimes.includes(flatActiveSegments[opt.index + 1]?.start)` → 下一段的 start 是被移除的邊界（開頭段）

> ⚠️ **禁止使用 `maxMergedEndIdx` 過濾**：  
> 之前曾使用「隱藏所有 index <= 最大合併 endIdx 的選項」，但此邏輯錯誤——  
> 若有多個不連續的合併群組（如合併了 0-2 和 6-7），`maxMergedEndIdx=7` 會誤殺 index 3、4、5 這些未合併的段落。  
> **正確做法：只依 `isMerged` 判斷，不使用 `maxMergedEndIdx` 過濾。**

**結束區塊下拉選單過濾規則**：
- 同 `isMerged` 隱藏已合併的段落
- 額外規則：`opt.index < batchStartIdx` 時隱藏（結束不可早於起始）

#### 合併/拆分的 Handler

```ts
handleBatchMerge():
  // 將 flatActiveSegments[start+1] ~ flatActiveSegments[end] 的 start time 加入 removedBoundaryTimes
  for i in [batchStartIdx+1, batchEndIdx]:
    removedBoundaryTimes.push(flatActiveSegments[i].start)

handleBatchSplit():
  // 將範圍內的 boundary times 從 removedBoundaryTimes 移除
  remove flatActiveSegments[start+1..end].start from removedBoundaryTimes

handleSplitSpecificRange(startIdx, endIdx):
  // 與 handleBatchSplit 邏輯相同，用於已合併清單的「拆分🔓」按鈕
```

#### mergedRanges 計算邏輯

用於顯示「🧠 已合併的 AI 整合區間」清單，遍歷 `flatActiveSegments`：

```
for each segment[i]:
  if i > 0 && seg.start in removedBoundaryTimes:
    → 延伸目前的 currentRange（或新建以 i-1 開頭）
  else:
    → 若有 currentRange，push 到 ranges 並重設
```

**顯示格式**：`{formatTime(start)} ~ {formatTime(end)}`

#### 選取索引自動修正（useEffect）

當 `removedBoundaryTimes` 或 `flatActiveSegments` 變動時，自動修正 `batchStartIdx` / `batchEndIdx`：
- 若目前選中的 index 落在已合併的段落中 → 往後找到下一個未合併的 index

> ⚠️ **此 useEffect 不應依賴 `maxMergedEndIdx`** 作為下限，原因同上。

---

### 3.5 Enter 鍵手動切分段落

- 在 Edit Tab 的任意段落卡片內容中，游標定位後按 Enter
- 系統計算游標位置對應的字幕時間點
- 若游標在字幕條目中間（非頭尾）：依比例切分該字幕條目為兩個
- 建立新的 `ChapterSplit`（`title = ''`），加入 `userCustomSplits`
- 觸發重新計算 `currentSegments`

---

### 3.6 費用預估（CostEstimation）

**計算基準**：`aiGroups`（依 `removedBoundaryTimes` 合併後的最終 AI 群組清單）

| 項目 | 計算方式 |
|------|----------|
| 總輸入 Token | 所有群組文字字數 × 1.2 |
| 輸入費率 | $1.25 / 1M tokens（gpt-5.1） |
| 筆記輸出 | 每個 AI 群組 × 500 tokens |
| 術語輸出 | 每 60 分鐘一批 × 800 tokens |
| 輸出費率 | $10.00 / 1M tokens |
| 匯率 | 1 USD = 32.5 TWD |

---

### 3.7 AI 筆記生成（runAIGeneration）

**流程**：
1. 前端依 `aiGroups` 每個群組各呼叫一次 `POST /api/generate-block-note`
2. 並行呼叫（concurrent fetch），每個群組獨立回傳，逐一更新顯示
3. 同時依 `aiTermsGroups`（每 60 分鐘一批）呼叫 `POST /api/generate-block-terms`

**Prompt（筆記）規則**（位置：`prompts/prompt_note.txt`）：
- 段落用 Markdown `#` / `##` 標題
- 只允許單層無序清單（`-`），**絕對不能有第二層縮排清單**
- 若有分類標題（例如「常見 HTTP 方法：」），分類標題寫成純段落文字，不加 `-`，再用單層清單列子項目
- 清單項目間不留空行
- 不需總結、不需圖示
- 專業術語附英文：`中文（English）`
- 以繁體中文回答
- 注入變數：`{full_chapters}`（完整章節清單）、`{current_title}`（目前章節）、`{text}`（字幕文字）

---

### 3.8 本地狀態持久化（localStorage）

所有主要狀態皆存入 localStorage，頁面重整後自動復原：

| Key | 說明 |
|-----|------|
| `gth_screen` | 目前畫面（`home` / `loading` / `app`） |
| `gth_ytUrl_v2` | 上次輸入的 YT URL |
| `gth_videoData_v2` | 影片資料（含字幕） |
| `gth_chaptersInput_v2` | 貼上的章節文字 |
| `gth_chaptersVideoId_v2` | 對應章節的 video_id（換影片時自動清除） |
| `gth_userCustomSplits` | 手動切分點 |
| `gth_removedBoundaryTimes` | AI 整合合併的邊界時間清單 |
| `gth_editedSegmentTexts` | 使用者手動編輯的段落文字 |
| `gth_collapsedChapters` | 折疊的章節群組 key |
| `gth_collapsedAIGroups` | 折疊的 AI 整合群組 key |
| `gth_settingsInterval` | 預設段落時長（分鐘） |
| `gth_settingsNoSegment` | 無段落最大時長（分鐘） |
| `gth_settingsSubSegment` | 子段落最大時長（分鐘） |
| `gth_openaiKey` | OpenAI API Key |
| `gth_activeTab` | 目前 Tab（`edit` / `notes` / `term`） |
| `gth_aiNotesResult` | AI 筆記結果 |
| `gth_aiTermsResult` | AI 術語結果 |
| `gth_showCostEstimation` | 是否顯示費用估算框 |

---

## 4. 技術架構

### 前端

| 項目 | 技術 |
|------|------|
| 框架 | React + TypeScript（Vite） |
| 樣式 | Vanilla CSS（`index.css`），深色主題，使用 CSS 變數 |
| 狀態管理 | React useState + useMemo + useEffect（無 Redux） |
| 路由 | 無，以 `screen` state 切換畫面 |

**主要元件結構**：
```
App.tsx（主狀態 / 所有 handlers）
├── HomeScreen.tsx       首頁
├── LoadingScreen.tsx    載入畫面
├── ManualImportModal.tsx 手動匯入 Modal
├── Sidebar.tsx          右側設定欄（layout shell）
│   ├── VideoCard.tsx
│   ├── OpenAISettings.tsx
│   ├── ChaptersInput.tsx
│   ├── RangeMerging.tsx   ← 🔗 AI 整合範圍合併
│   ├── SettingsParameters.tsx
│   └── CostEstimation.tsx
├── EditSegmentsTab.tsx  左側 Edit Tab
│   └── SegmentCard.tsx  單一段落卡片
├── AINotesTab.tsx       AI 筆記 Tab
└── AITermsTab.tsx       術語對照 Tab
```

### 後端

| 項目 | 技術 |
|------|------|
| 框架 | Python FastAPI（`server.py`） |
| 字幕工具 | `subtitle_utils.py`、`subtitle_extractor.py` |

**主要 API 端點**：

| 路由 | 方法 | 說明 |
|------|------|------|
| `/api/process-video` | POST | 輸入 YT URL，回傳字幕 + 影片資訊 |
| `/api/generate-block-note` | POST | 呼叫 OpenAI 整理筆記（單一群組） |
| `/api/generate-block-terms` | POST | 呼叫 OpenAI 整理術語（單一批次） |
| `/api/save-segments` | POST | 儲存分段資料（用於後端驗證） |
| `/api/check-env` | GET | 檢查伺服器是否有 `OPENAI_API_KEY` 環境變數 |
| `/api/get-env-key` | POST | 將伺服器環境變數的 API Key 回傳前端 |

---

## 5. 時間格式規範

**統一使用 `formatTime(seconds: number)`**（位置：`utils.ts`）：
- 不足 1 小時：`MM:SS`（例如 `16:38`）
- 超過 1 小時：`H:MM:SS`（例如 `1:13:20`）

> ⚠️ 過去曾有 `formatToMinutes`（顯示純分鐘數）的實作，現已廢棄。  
> 所有時間顯示（下拉選單、已合併清單、段落時間欄）均應使用 `formatTime`。

---

## 6. 已知問題紀錄（Bug Log）

### Bug #1：`maxMergedEndIdx` 誤殺未合併選項（已確認，待修復）

**症狀**：在「起始區塊」下拉選單中，非連續合併群組之間的未合併章節也被隱藏  
**根因**：`maxMergedEndIdx = Math.max(...mergedRanges.map(r => r.endIdx))` 取的是全局最大值，並用 `opt.index <= maxMergedEndIdx` 過濾所有選項  
**場景**：
```
合併 A[0-2] 和 B[6-7]
maxMergedEndIdx = 7
→ index 3、4、5（未合併）也被隱藏 ❌
```
**修法**：移除 `maxMergedEndIdx` 的過濾邏輯，只保留 `isMerged` 判斷  
**影響範圍**：`RangeMerging.tsx` 的起始區塊 `<select>`、`App.tsx` 的 `useEffect` 索引修正邏輯

---

## 7. 開發注意事項

1. **不要加第二層清單**：AI prompt 明確禁止，code review 時需特別注意
2. **不要加 `maxMergedEndIdx` 過濾**：見 Bug #1
3. **LocalStorage key 有版本號**：`_v2` 後綴，修改資料結構時記得升版（避免舊資料格式衝突）
4. **新影片會清除章節**：`gth_chaptersVideoId_v2` 不同時，自動清除 `chaptersInput`
5. **`removedBoundaryTimes` 存的是時間秒數**（number），不是 index，確保跨重整後仍正確對應

---

## 8. 開發環境啟動

```bash
# 後端
cd /Users/linchengyi/PycharmProjects/GoldTubeHouse
source .venv/bin/activate
uvicorn server:app --reload

# 前端
cd frontend
npm run dev
```

前端預設連接 `localhost:8000`（後端），由 Vite proxy 設定轉發。

---

*文檔由 Antigravity AI 自動生成，請在每次重大需求變更後同步更新。*
