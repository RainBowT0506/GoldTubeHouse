# GoldTubeHouse 字幕分段整理系統規格書 (System Specification)

## 1. 系統概述 (Overview)
GoldTubeHouse 是一個專為 YouTube 字幕自動化下載、分段整理及 AI 筆記生成設計的工具箱。其核心的「字幕分段整理與 AI 筆記系統」旨在提供清晰、符合語意且便於閱讀的影片字幕分段，並可一鍵提交給大語言模型（如 gpt-5.1）進行結構化重點彙整與專業術語提煉。

為了優化分段的語意連貫性與實用性，系統提供了自訂的分段與顯示門檻規則。

---

## 2. 核心分段規則與門檻設計 (Segmentation Rules & Thresholds)
系統採用時間軸與語意對齊（智慧標點符號偵測）相結合的混合分段策略。當解析完影片的所有字幕條目（Subtitle Entry）後，會依據以下參數設定進行分段：

### 2.1 關鍵控制參數 (Control Parameters)
*   **自訂分段區間 (Default: 20 分鐘 / 1200 秒)**
    *   這是分割後每個子區塊的基準目標長度。
*   **直接顯示門檻 (Default: 30 分鐘 / 1800 秒)**
    *   影片總長度若低於此門檻，系統將**不進行任何自動分段**，直接顯示為一個完整區塊（「只需一次即可」）。
*   **超長章節細分門檻 (Default: 30 分鐘 / 1800 秒)**
    *   如果影片包含 YouTube 章節（Chapters），當單一章節長度超過此門檻時，系統會對該章節內容以「自訂分段區間」進行二次細分。

### 2.2 長度驅動的分段邏輯
依據影片的總長度與上述參數，系統的自動分段行為如下：

1.  **低於 30 分鐘 (< 1800 秒) 的影片**：
    *   直接判定為單一完整段落，不拆分。
    *   產生單一的 Subtitle Card，使用者點擊「確認呼叫 AI 開始整理」時，僅會發送 1 次 AI 請求。
2.  **達到 40 分鐘或更長 (>= 2400 秒) 的影片**：
    *   系統判定超過「直接顯示門檻」，將以 20 分鐘（1200 秒）為間隔自動切分。
    *   例如，一個 40 分鐘的影片會被精準切分為兩個 20 分鐘的區間（20m + 20m 兩次）。
    *   若為 50 分鐘的影片，則切分為三個區間（20m + 20m + 10m），以此類推。
3.  **介於 30 分鐘與 40 分鐘之間的影片**：
    *   同樣判定超過直接顯示門檻，會以 20 分鐘為基準切分為兩個區段（例如 35 分鐘的影片會被切分為 20m + 15m 兩個區段）。

### 2.3 尾部自動合併機制 (Trailing Segment Merging)
為了避免分段最後產生過短的碎片區塊（如最後一個區塊僅有 5 分鐘）：
- 系統在計算自動分段（Scenario 1 與 Scenario 2）時，會檢查**分割後剩餘的影片長度**。
- 若「剩餘長度」低於 **`Math.min(360, interval * 0.5)`**（以預設 20 分鐘區間為例，即為 6 分鐘 / 360 秒）：
  - 系統將不進行該次分割，並將剩餘內容與字幕直接併入當前的段落，使其一併延伸至結尾。
  - 例如：長度 59.1 分鐘（3546秒）的影片，若在 13:30 處進行手動切分後，剩餘的 45.6 分鐘將以 20 分鐘為區間再次分段，最後剩餘的 5.6 分鐘（< 6分鐘門檻）會自動合併，最終僅產生兩個子區段（20 分鐘 與 25.6 分鐘），而不會產生 5.6 分鐘的極短區塊。

---

## 3. 智慧句尾對齊演算法 (Sentence-End Alignment Algorithm)
為了避免字幕在單字或半句話中間被生硬地截斷，系統引入了 `findBestSplitIndex` 演算法：
*   **搜尋半徑 (Max Offset)**：預設為目標切分點的前後各 120 秒（共 240 秒的搜尋視窗）。
*   **標點符號匹配**：搜尋最接近目標時間點且以句尾標點符號（包括繁體中文 `。`、`！`、`？` 以及英文 `.`, `!`, `?`）結尾的字幕條目。
*   **降級處理**：若搜尋視窗內找不到任何以句尾標點結尾的條目，則在目標時間點直接進行切分，以避免無窮迴圈或過大的區塊偏差。

---

## 4. 有章節標記 (Chapters) 時的分段邏輯
若使用者在右側邊欄中貼上或引入了影片的章節標記（例如 `00:00 Intro`）：
1.  **章節小於「超長章節細分門檻」(30 分鐘)**：
    *   直接以該章節的起始與結束時間作為分段界限，不做額外拆分。
2.  **章節大於等於「超長章節細分門檻」(30 分鐘)**：
    *   將該超長章節視為獨立區段，並以「自訂分段區間」（預設 20 分鐘）再次進行子段落（Sub-segments）切分。
    *   子段落間同樣適用智慧句尾對齊，並適用 **2.3 節的尾部自動合併機制**。

---

## 5. 手動調整分段規則 (Manual Splitting)
*   使用者可在前台任意字幕卡片（Subtitle Card）點選編輯文字，在任意句點後按下 **Enter 鍵**。
*   **安全邊界**：為避免分割出極短的無意義段落，手動分割出的前半段長度必須大於 5 分鐘（300 秒），否則系統將彈出警告（`分割出的前半段需大於 5 分鐘，已自動合併`）並不予分割。
*   **句內單字邊界精準切分 (Subtitle Entry Splitting)**：優化了時間戳記與字幕內容的切割邏輯。若使用者按下 Enter 的游標位置正好落在單一字幕條目（Subtitle Entry）的文字內部（而非條目交界處），系統會自動將該條目拆分為兩個子條目，並按游標前/後字數長度比例重新分配時間長度與時間起點（`start2`），將拆分點定在後半段字句的起點。這能保證不論字幕條目的物理邊界如何，切分處前方的內容必定留在前一卡片，後方內容（如 `So the next`）必定開始於新卡片，徹底解決了原先句內交界文字被錯誤帶入下一卡片的問題。

---

## 6. 系統架構 (System Architecture)

系統採用前後端分離架構，提供流暢的單頁應用程式（SPA）互動體驗：
- **前端 (Frontend)**: 基於 React 18, TypeScript, Vite 及 Vanilla CSS 建構。前端負責時間軸運算、使用者編輯卡片、章節比對、費用預估，並透過 `localStorage` 實現頁面重新載入後的設定與狀態持久化（Persistence）。
- **後端 (Backend)**: 使用 Python + FastAPI 提供高效能 API，負責調用 `youtube-transcript-api` 與 `yt-dlp` 下載字幕，並代理與安全處理對 OpenAI API 的呼叫，同時負責將用戶的分段結果持久化存檔。
- **提示詞管理 (Prompts Management)**: 系統所有與 AI 互動的提示詞範本（重點整理、術語提取、合併分析）均統一儲存於 `prompts/` 目錄下的 `.txt` 檔案中，作為唯一的提示詞事實來源。後端一律動態載入這些檔案。若發生檔案遺失或讀取失敗，後端會主動拋出 500 錯誤（`HTTPException`），不再採用硬編碼的備份字串，避免程式碼內部的提示詞版本與實體檔案不同步。

---

## 7. 後端 API 端點規格說明 (API Endpoints Specification)

### 7.1 `POST /api/process-video`
- **功能**: 解析 YouTube 網址，優先透過 `youtube-transcript-api` 下載字幕。若下載失敗（如限制區域或無官方字幕），則自動容錯降級使用 `yt-dlp` 下載自動生成字幕，解析成統一的時間戳記格式回傳給前端。
- **請求參數**:
  ```json
  { "url": "string" }
  ```
- **回應格式**:
  ```json
  {
    "status": "success",
    "video_id": "string",
    "title": "string",
    "duration": 1234,
    "thumbnail": "string",
    "subtitles": [
      { "text": "string", "start": 0.0, "duration": 0.0 }
    ]
  }
  ```

### 7.2 `GET /api/check-env`
- **功能**: 檢查後端伺服器的環境變數中是否設定了 `OPENAI_API_KEY`，用以決定前端是否顯示「偵測到本地環境中有 API Key」的快速引入按鈕。
- **回應格式**:
  ```json
  { "status": "success", "has_key": true }
  ```

### 7.3 `POST /api/get-env-key`
- **功能**: 獲取本地伺服器環境中的 `OPENAI_API_KEY` 以供前端網頁引入。
- **回應格式**:
  ```json
  { "status": "success", "api_key": "string" }
  ```

### 7.4 `POST /api/generate-block-note`
- **功能**: 呼叫 OpenAI 針對特定分段內容生成 Markdown 重點整理筆記。
- **特殊處理**:
  - **清單扁平化處理 (`flatten_markdown_lists`)**: 後端會解析 OpenAI 回傳內容中的 Markdown 清單，自動將多層級（Nested）縮排列表扁平化為單一層級無序清單，確保最終筆記呈現格式精準無雜亂。
- **請求參數**:
  ```json
  {
    "api_key": "string",
    "model": "string",
    "title": "string",
    "text": "string"
  }
  ```
- **回應格式**:
  ```json
  {
    "status": "success",
    "title": "string",
    "content": "string"
  }
  ```

### 7.5 `POST /api/generate-block-terms`
- **功能**: 呼叫 OpenAI 針對特定內容提取 50 個專業學術術語與對應的中英文解釋。
- **請求參數**:
  ```json
  {
    "api_key": "string",
    "model": "string",
    "text": "string"
  }
  ```
- **回應格式**:
  ```json
  {
    "status": "success",
    "content": "string"
  }
  ```

### 7.6 `POST /api/save-segments`
- **功能**: 用戶鎖定分段或點選費用預估時，前端會自動同步當前所有的分段狀態，持久化寫入伺服器本地檔案。
- **儲存路徑**: 專案根目錄下 `scratch/user_segments.json`。
- **請求參數**:
  ```json
  {
    "video_id": "string",
    "segments": [
      {
        "title": "string",
        "text": "string",
        "start": 0.0,
        "end": 0.0
      }
    ]
  }
  ```
- **回應格式**:
  ```json
  { "status": "success" }
  ```

---

## 8. 後端多執行緒併發設計 (Backend Concurrency Design)

為了讓使用者能同時處理多個字幕區塊的 AI 筆記與術語生成，後端在端點設計上進行了效能優化：
- **同步端點定義 (`def` 而非 `async def`)**:
  - 由於 AI 筆記與術語的生成需要呼叫外部 OpenAI HTTP API，其內部使用了同步的 `requests.post`，屬於阻塞型（Blocking）I/O。
  - 若使用 `async def` 定義，由於 Python 的單執行緒事件循環（Event Loop）特性，這些阻塞呼叫會徹底卡死事件循環，導致多個 AI 請求必須排隊串行執行。
  - 將端點改為 `def` 定義後，FastAPI 會自動將這些請求指派給外部的 **執行緒池 (Thread Pool)** 來併發處理。如此一來，多個區塊的 AI 生成請求可以並行、並發發送給 OpenAI，大幅縮短了整體等待時間。

---

## 9. AI 請求日誌紀錄機制 (AI Request Logging Mechanism)

為方便追蹤 API 費用、分析 Prompts 效果及調試模型行為，系統提供了自動化請求紀錄日誌：
- **觸發時機**: 每次點擊調用 AI 生成 Block Note 或 Block Terms 時觸發。
- **日誌儲存路徑**: 儲存在根目錄下的 `ai_logs/ai_call_<timestamp>.json`。該資料夾已在 `.gitignore` 中設定忽略，避免敏感 API 金鑰或大型字幕數據被提交至 Git。
- **日誌結構**:
  ```json
  {
    "timestamp": "ISO-8601格式時間戳記",
    "model": "gpt-5.1",
    "segments": [],
    "prompt_1_calls": [
      {
        "title": "區塊標題",
        "prompt": "完整發送的 Prompt 內容",
        "response": "OpenAI 原始回傳 Markdown",
        "processed": "經過扁平化後的 Markdown"
      }
    ],
    "prompt_2_calls": [],
    "final_output": {
      "title": "區塊標題",
      "content": "最終結果"
    }
  }
  ```

---

## 10. 測試與 Mock 資料 (Testing & Mock Data)

專案內建了完整的單元測試與模擬數據，以驗證分段邏輯與 API 正常運行：
- **後端 API 測試 (`tests/test_backend.py`)**: 測試 FastAPI 各 API 的請求與回應狀態，包括模擬影片處理與 API 金鑰校驗。
- **前端分段測試 (`tests/test_frontend_segmentation.ts`)**: 針對前端的字幕邊界切分、句尾對齊、尾部自動合併等智慧演算法進行全方位單元測試。
- **Mock 數據目錄 (`tests/mock_data/`)**:
  - `UIf-SlmMays_subtitles.json`: 提供一部 3 小時長影片的原始字幕模擬數據。
  - `UIf-SlmMays_user_segments.json`: 提供對應長影片的用戶自訂分段 Mock 數據，供前端測試演算法之邊界條件。
