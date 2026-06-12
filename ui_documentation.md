# GoldTubeHouse 前端 UI 元件與系統架構文檔

本文件為 **GoldTubeHouse** 系統的前端 UI 元件架構說明書。旨在讓開發人員與 AI 助手快速理解整個系統介面結構、各元件的職責、關鍵屬性（Props）、狀態流動以及與後端 API 的整合邏輯。

---

## 1. 系統佈局與架構 (System Layout & Architecture)

系統採用**三欄式/區塊化設計**，主頁面分為：
1. **主操作面板 (Main Dashboard)**: 包含首頁 (Home)、加載中 (Loading) 與主要功能分頁 (Edit/Notes/Terms)。
2. **側邊欄 (Sidebar)**: 固定顯示於右側，用以控制資料匯入、金鑰、章節標記、範圍合併、分段參數以及費用預估。

### 頁面狀態機 (Screen State Machine)
`screen` 狀態（`home` | `loading` | `app`）儲存於 `localStorage` 的 `gth_screen`，其流轉規則如下：
* **`home`**: 初始登入狀態。使用者可在此貼上 YouTube 網址或手動匯入字幕。
* **`loading`**: 處理中狀態。顯示旋轉的 Loading 動畫，向後端下載與剖析字幕。
* **`app`**: 主編輯工作區。展示分段字幕與側邊控制欄。

---

## 2. 元件目錄與職責速查表 (Component Directory)

| 元件名稱 | 檔案路徑 | 職責說明 |
|---|---|---|
| **HomeScreen** | `components/HomeScreen.tsx` | 歡迎入口頁，包含 URL 輸入框、快捷測試案例、手動匯入按鈕與系統特色簡介。 |
| **LoadingScreen** | `components/LoadingScreen.tsx` | 後端抓取字幕或調用 AI 生成時的過渡動畫載入頁。 |
| **Sidebar** | `components/Sidebar.tsx` | 側邊欄的主控容器，組合了多個側邊控制小元件與費用預估按鈕。 |
| **VideoCard** | `components/VideoCard.tsx` | 側邊欄最上方的影片卡片，展示標題、縮圖與長度，並連結至 YouTube。 |
| **OpenAISettings** | `components/OpenAISettings.tsx` | API 金鑰配置器，固定採用 `gpt-5.1`，支援自動偵測本地環境變數金鑰。 |
| **ChaptersInput** | `components/ChaptersInput.tsx` | 用於粘貼或清除影片章節 (YouTube Chapters) 字幕切分錨點。 |
| **RangeMerging** | `components/RangeMerging.tsx` | 用於批次/範圍合併相鄰字幕卡片的進階控制器，並提供可取消拆分的區間列表。 |
| **SettingsParameters** | `components/SettingsParameters.tsx` | 用於調整切分區間（分鐘）、直接顯示門檻與超長章節二次拆分門檻。 |
| **CostEstimation** | `components/CostEstimation.tsx` | 「鎖定變更」與「呼叫 AI」的動作面板，顯示基於 `gpt-5.1` 輸入/輸出費率的即時成本估算。 |
| **EditSegmentsTab** | `components/EditSegmentsTab.tsx` | 主編輯區的「字幕分段區塊」面板，將字幕按章節或合併組歸類顯示。 |
| **SegmentCard** | `components/SegmentCard.tsx` | 單一字幕分段卡片。支持雙擊編輯字幕內容與點擊複製（僅字幕/連同標題）。 |
| **ManualImportModal** | `components/ManualImportModal.tsx` | 支援將 SRT/VTT/JSON/純文字直接手動貼上匯入的彈出視窗。 |
| **AINotesTab** | `components/AINotesTab.tsx` | 展示 AI 依據各段落字幕所整理出的重點 Markdown 筆記，支援一鍵複製與重新生成。 |
| **AITermsTab** | `components/AITermsTab.tsx` | 展示 AI 整理出的專業名詞中英文對照與釋義表。 |

---

## 3. UI 元件詳解與 Prop 介面

### 3.1 `HomeScreen` (首頁/入口)
* **用途**: 用戶首個接觸的視窗，負責接收 YouTube URL。
* **主要事件**:
  * `handleUrlSubmit`: 呼叫後端 `/api/process-video` 開始獲取字幕。
  * `useExample`: 自動填入測試影片（如 6小時 n8n 課程）的 URL 與章節。
  * `setShowImportModal(true)`: 開啟手動貼上字幕視窗。

### 3.2 `LoadingScreen` (載入過渡)
* **用途**: 單純的 UI 展示，顯示 `loadingText` 傳遞目前處理進度。
* **視覺元素**: 內嵌發光的電視機 Emoji（📺）與 CSS Spinner 動畫。

### 3.3 `OpenAISettings` (API 設定)
* **邏輯**:
  * 若後端 `/api/check-env` 回傳 `has_key: true`，則會在輸入框下方呈現一個 `[點此引入]` 的提示。點擊將觸發 `loadEnvKey` 自行加載金鑰，提升本地開發的便利性。
  * 系統模型鎖定為 `gpt-5.1`，不可手動修改。

### 3.4 `ChaptersInput` (章節文字解析)
* **時間軸解析規律**:
  * 點選「套用章節」後，前端會按正則 `(\d{1,2}:\d{2}(?::\d{2})?)` 解析輸入的每行文字，轉化為 `ChapterSplit` 物件（包含 `time` 秒數與 `title` 標題），再交由底層的 `generateSegments` 演算法重新分割字幕卡片。

### 3.5 `RangeMerging` (範圍合併)
* **商業需求與合併機制**:
  * 合併是把相鄰分段的邊界時間（秒數）加入 `removedBoundaryTimes`。
  * 選擇器只會顯示「尚未被合併」的區塊，並排除已被合併的段落；「結束區塊」自動限制不可小於「起始區塊」。
  * 上方列表會同步顯示已被合併的區間，並提供「拆分 🔓」按鈕可將其從 `removedBoundaryTimes` 中剔除以恢復獨立分段。

### 3.6 `CostEstimation` (費用預估與鎖定)
* **計費公式 (gpt-5.1)**:
  * **Input**: `(總筆記字數 + 總術語字數) * 1.2` 估算為輸入 Tokens，以每百萬 $1.25 美元計費。
  * **Output**: `筆記次數 (段落數) * 500` + `術語次數 (每小時1次) * 800` 估算為輸出 Tokens，以每百萬 $10.00 美元計費。
  * 匯率固定以 `32.5` 換算為新台幣。
* **流程控制**: 必須先點選「🔒 鎖定分段並預估 API 費用」（觸發 `lockAndEstimateCost`）並確認費用後，才會顯現「🚀 確認呼叫 AI 開始整理」按鈕。

### 3.7 `EditSegmentsTab` (主編輯面板)
* **合併區間 UI**:
  * 會依據 `removedBoundaryTimes` 的狀態，將相鄰的數個 `SegmentCard` 合併入一個 `ai-merged-group-container` 元件中，外框顯示黃金色的「🧠 AI 整合區間」頭部。
  * 章節折疊功能：每一大章可以點擊 `toggleChapterCollapse` 進行摺疊，狀態暫存於 `collapsedChapters` Set 中。
* **分段邊界合併按鈕**:
  * 非折疊狀態下，相鄰卡片之間會顯示 `⊕ 合併此章節 (AI 整合)`，點擊即可一鍵加入 `removedBoundaryTimes`。

### 3.8 `SegmentCard` (單一字幕卡片)
* **核心互動**:
  * 字幕內文包裹在 `EditableSegmentText` 中，具有 `contentEditable` 屬性。失焦 (`onBlur`) 時會觸發 `handleSegmentTextChange` 保存變更。
  * **鍵盤 Enter 分割**: 點擊字幕的文字，按下鍵盤的 `Enter` 鍵時會觸發 `handleSegmentKeydown`。系統會判斷游標所在的字串位置，執行「句內單字邊界精準切分」，將後半段時間與文字自動拆分到下一張卡片。

### 3.9 `AINotesTab` & `AITermsTab` (AI 結果展示)
* **操作**:
  * 每個 AI 區塊卡片右上角都提供獨立的 `📋 複製此段` 按鈕。
  * 頭部面板提供 `展開全部`、`收合全部` 與 `複製全部` 快速鈕，提升用戶導出筆記的效率。

---

## 4. 全域狀態管理與持久化機制 (LocalStorage Rules)

為防止頁面重整 (Reload) 或瀏覽器當機造成用戶辛苦編輯的字幕與參數丟失，前端在 `App.tsx` 中透過多個 `useEffect` 實現了即時的 `localStorage` 持久化備份：

| LocalStorage Key | 元件對應狀態 | 用途與說明 |
|---|---|---|
| `gth_screen` | `screen` | 保存當前所處的頁面 (home/loading/app)。 |
| `gth_ytUrl_v2` | `ytUrl` | 備份當前輸入的 YouTube 網址。 |
| `gth_videoData_v2` | `videoData` | 緩存當前影片的詳細詮釋資料與所有原始字幕 Entry。 |
| `gth_chaptersInput_v2` | `chaptersInput` | 備份用戶在右側貼上的章節列表文字。 |
| `gth_userCustomSplits` | `userCustomSplits` | 保存用戶透過 Enter 手動切分出的所有自訂時間錨點。 |
| `gth_removedBoundaryTimes` | `removedBoundaryTimes` | 備份被用戶刪除的段落邊界時間，決定哪些章節應被合併。 |
| `gth_collapsedChapters` | `collapsedChapters` | 記憶視覺上折疊/隱藏的章節 ID。 |
| `gth_editedSegmentTexts` | `editedSegmentTexts` | 記錄用戶對特定分段字幕做過的所有手動文字修改。 |
| `gth_aiNotesResult` | `aiNotesResult` | 快取 AI 已生成完畢的重點整理筆記，避免重複調用 API 付費。 |
| `gth_aiTermsResult` | `aiTermsResult` | 快取 AI 已生成完畢的名詞對照表。 |

---

## 5. 常見 UI 整合問題與 AI 修改準則

每次修改前端 UI 元件時，請遵循以下原則：
1. **防污染機制優先**: `App.tsx` 內設有偵測 `gth_chaptersVideoId_v2` 是否與當前影片相符的邏輯，若載入新影片，會自動將 `chaptersInput` 清空，在修改 Chapters 相關元件時不可破壞此防護。
2. **手動分段防誤觸**: 當觸發 Enter 切分時，會先驗證前半段長度是否高於 5 分鐘。在 `SegmentCard` 或 `EditSegmentsTab` 中調整事件處理器時，須確保錯誤 Toast 能正常在畫面中央浮現。
3. **Vanilla CSS 規範**: 本專案使用 Vanilla CSS（路徑於 `frontend/src/index.css`），請避免在 TSX 元件中直接寫入過多 Ad-hoc 的 Inline Styles。若需新樣式，應將樣式類別（Class Name）追加至 `index.css`。

