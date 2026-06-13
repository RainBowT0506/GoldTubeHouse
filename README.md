# GoldTubeHouse 🛠️

GoldTubeHouse 是一個專為 **YouTube 字幕下載與處理** 以及 **PDF 頁面高畫質圖片轉換** 所設計的自動化工具箱。本專案包含多個實用的 Python 腳本，能有效協助您進行字幕整理、按章節分段以及 PDF 檔案的批次影像化處理。

此外，專案目前已全面整合 **Web 視覺化操作介面**，包含基於 **FastAPI** 的後端伺服器與 **React + TypeScript + Vite** 的前端單頁應用程式（SPA），提供直觀的字幕編輯、參數微調、AI 筆記與專業術語生成功能。

---

## 📂 專案目錄結構

```text
GoldTubeHouse/
├── download_subtitles.py      # YouTube 字幕下載工具 (透過 yt-dlp)
├── processor.py               # 字幕清理、去重與合併工具 (合併為單一 Markdown)
├── segment_subtitles.py       # YouTube 影片字幕自動按章節分段工具
├── pdf_to_images.py           # PDF 轉圖片核心工具 (透過 PyMuPDF)
├── split_unprocessed.py       # 批次處理「未處理」資料夾中 PDF 的工具
├── server.py                  # FastAPI 後端伺服器程式
├── main.py                    # PyCharm 預設模板腳本 (可忽略)
├── subtitles/                 # [自動建立] 存放下載之原始 .vtt 字幕檔
├── pdf/                       # PDF 相關工作目錄
│   └── 未處理/                 # [需自行建立] 放置待批次轉換的 PDF 檔案
├── frontend/                  # React + TypeScript + Vite 前端專案目錄
│   ├── src/                   # 前端原始碼 (App.tsx, utils.ts 等)
│   ├── dist/                  # 前端打包後的靜態檔案 (由 FastAPI 自動託管)
│   └── package.json           # 前端相依性與指令設定檔
├── tests/                     # 系統測試目錄
│   ├── mock_data/             # 測試用 Mock 字幕與分段數據
│   ├── test_backend.py        # 後端 API 單元測試
│   └── test_frontend_segmentation.ts # 前端分段演算法測試
├── ai_logs/                   # [自動建立] 存放 AI 請求與回應的 JSON 日誌 (已加入 .gitignore)
└── scratch/                   # 存放快取或暫存資料的目錄 (如 user_segments.json)
```

---

## ⚙️ 環境安裝與設定

本專案使用 Python 3 與 Node.js 開發，執行前請確保已完成以下安裝與設定：

### 1. 安裝 Python 必要套件 (後端與腳本)

您可以使用 `pip` 來安裝所需的第三方函式庫：

```bash
pip install fastapi uvicorn youtube-transcript-api yt-dlp pymupdf requests
```

### 2. 系統依賴 (選用)
如需處理特定受保護或特殊編碼的 YouTube 影片，建議確保系統中已安裝 `ffmpeg`。

### 3. 安裝 Node.js 套件 (前端開發)
若您需要對前端進行開發與調整，請進入 `frontend` 目錄並安裝套件：

```bash
cd frontend
npm install
```

---

## 🚀 啟動與執行方式

本專案支援 **Web 網頁模式** 與 **CLI 腳本模式**。

### 💻 網頁模式 (整合運行)

1. **打包前端靜態資源**：
   如果您修改了前端程式碼，或者初次運行，請在 `frontend` 目錄下進行打包：
   ```bash
   cd frontend
   npm run build
   ```
   這會在 `frontend/dist/` 下生成打包好的靜態檔案。

2. **啟動 FastAPI 後端伺服器**：
   在專案根目錄下執行：
   ```bash
   python server.py
   ```
   或者直接使用 `uvicorn` 啟動：
   ```bash
   uvicorn server:app --reload --port 8000
   ```
   啟動後，後端伺服器會自動託管 `frontend/dist/` 目錄下的前端網頁，並監聽於 `http://127.0.0.1:8000`。請打開瀏覽器訪問該網址即可開始使用。

3. **前端開發模式 (熱更新)**：
   若需開發前端並啟用即時熱更新 (HMR)，請在 `frontend` 目錄下執行：
   ```bash
   cd frontend
   npm run dev
   ```
   開發伺服器預設運行於 `http://localhost:5173`。此時前端會將 API 請求傳送至 `http://127.0.0.1:8000` (後端伺服器需同時開啟)。

---

### 📥 腳本模式一：YouTube 字幕下載與處理

#### 1. YouTube 字幕下載器 ([download_subtitles.py](file:///Users/linchengyi/PycharmProjects/GoldTubeHouse/download_subtitles.py))
*   **功能簡介**：針對指定的 YouTube 影片或播放清單，僅下載其**英文字幕**（含自動生成字幕），不下載影片檔案以節省空間與時間。
*   **預設設定**：
    *   字幕語言：`en`（英文，可於程式碼第 20 行修改 `subtitleslangs` 變更語言，例如 `['zh-Hant', 'en', 'ja']`）。
    *   輸出路徑：預設儲存於 `./subtitles/`。
*   **使用方式**：
    *   **命令列參數**：
        ```bash
        python download_subtitles.py "https://www.youtube.com/watch?v=..."
        ```
    *   **互動式輸入**：直接執行腳本，並根據提示輸入網址：
        ```bash
        python download_subtitles.py
        ```

#### 2. 字幕清理與合併 ([processor.py](file:///Users/linchengyi/PycharmProjects/GoldTubeHouse/processor.py))
*   **功能簡介**：讀取 `./subtitles/` 資料夾中的所有 `.vtt` 檔案，自動進行清理、去重與 Markdown 合併。
*   **使用方式**：
    ```bash
    python processor.py
    ```

#### 3. 字幕按章節自動分段 ([segment_subtitles.py](file:///Users/linchengyi/PycharmProjects/GoldTubeHouse/segment_subtitles.py))
*   **功能簡介**：針對具有章節（Chapters）標記的 YouTube 影片，自動下載字幕並按照章節時間軸進行切割。
*   **運作邏輯**：將字幕內容分配到對應的章節標題下，同時進行字幕清理與去重。
*   **使用方式**：直接在程式碼中修改 `video_url` 與 `raw_chapters` 字串，然後執行：
    ```bash
    python segment_subtitles.py
    ```

---

### 📄 腳本模式二：PDF 轉高畫質圖片

#### 1. PDF 單一轉換工具 ([pdf_to_images.py](file:///Users/linchengyi/PycharmProjects/GoldTubeHouse/pdf_to_images.py))
*   **功能簡介**：將 PDF 的每一頁轉換為高畫質的 PNG 圖片。
    *   預設使用 **2 倍縮放 (DPI)**，確保轉換出來的圖片文字清晰可讀。
    *   輸出資料夾預設與 PDF 同目錄且同名。
*   **使用方式**：
    *   **轉換單一 PDF 檔案**：
        ```bash
        python pdf_to_images.py /path/to/document.pdf
        ```
    *   **轉換指定目錄下的所有 PDF 檔案**：
        ```bash
        python pdf_to_images.py /path/to/pdf_directory/
        ```
    *   **預設執行（無參數）**：自動掃描並轉換 `./pdf/` 目錄下的所有 `.pdf` 檔案。
        ```bash
        python pdf_to_images.py
        ```

#### 2. 批次處理未處理 PDF ([split_unprocessed.py](file:///Users/linchengyi/PycharmProjects/GoldTubeHouse/split_unprocessed.py))
*   **功能簡介**：專為大量 PDF 批次處理設計的工作流。
*   **工作流程**：
    1.  掃描 `./pdf/未處理/` 資料夾底下的所有 PDF 檔案。
    2.  清除 PDF 檔名首尾的空白字元。
    3.  自動在 `./pdf/` 目錄下建立與 PDF 檔名同名的資料夾。
    4.  將 PDF 每頁轉換為圖片並存放在對應的資料夾中（命名為 `page_001.png`, `page_002.png`...）。
*   **使用方式**：
    1.  在專案根目錄下的 `./pdf/` 中，建立一個名為 `未處理` 的資料夾。
    2.  將所有欲轉換的 PDF 放入該資料夾。
    3.  執行腳本：
        ```bash
        python split_unprocessed.py
        ```

---

## 🛠️ 開發與客製化提示

*   **更換字幕語言**：
    *   在 `download_subtitles.py` 中，修改 `subtitleslangs` 參數（例如改為 `['zh-Hant']` 下載繁體中文）。
    *   在 `segment_subtitles.py` 中，修改 `download_subtitles` 函數調用時的 `lang` 參數。
*   **調整圖片畫質**：
    *   在 `pdf_to_images.py` 中，可調整 `convert_pdf_to_images` 函數內的 `zoom` 變數（預設為 `2`）。若需要更高解析度（如 OCR 辨識用）可設為 `3` 或 `4`。

---

## ⚠️ AI 代理開發規範 (AI Agent Development Rules)

- **絕對禁止自動執行 Git Commit**：AI 協同開發代理在修改或新增程式碼後，**絕對禁止自作主張或自動執行 `git commit`**。
- **僅在明確指令下執行**：只有當使用者在對話中**明確下達「進行 commit」或「幫我 commit」的指令**時，AI 代理才可以執行 Git commit 操作。

