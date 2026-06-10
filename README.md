# GoldTubeHouse 🛠️

GoldTubeHouse 是一個專為 **YouTube 字幕下載與處理** 以及 **PDF 頁面高畫質圖片轉換** 所設計的自動化工具箱。本專案包含多個實用的 Python 腳本，能有效協助您進行字幕整理、按章節分段以及 PDF 檔案的批次影像化處理。

---

## 📂 專案目錄結構

```text
GoldTubeHouse/
├── download_subtitles.py      # YouTube 字幕下載工具 (透過 yt-dlp)
├── processor.py               # 字幕清理、去重與合併工具 (合併為單一 Markdown)
├── segment_subtitles.py       # YouTube 影片字幕自動按章節分段工具
├── pdf_to_images.py           # PDF 轉圖片核心工具 (透過 PyMuPDF)
├── split_unprocessed.py       # 批次處理「未處理」資料夾中 PDF 的工具
├── main.py                    # PyCharm 預設模板腳本 (可忽略)
├── subtitles/                 # [自動建立] 存放下載之原始 .vtt 字幕檔
└── pdf/                       # PDF 相關工作目錄
    └── 未處理/                 # [需自行建立] 放置待批次轉換的 PDF 檔案
```

---

## ⚙️ 環境安裝與設定

本專案使用 Python 3 開發，執行前請確保已安裝以下相依套件：

### 1. 安裝必要套件

您可以使用 `pip` 來安裝所需的第三方函式庫（`yt-dlp` 用於字幕下載，`PyMuPDF` 用於 PDF 轉換）：

```bash
pip install yt-dlp pymupdf
```

### 2. 系統依賴 (選用)
如需處理特定受保護或特殊編碼的 YouTube 影片，建議確保系統中已安裝 `ffmpeg`。

---

## 📖 功能詳細說明與使用指南

本專案主要分為兩個核心工作流：**YouTube 字幕處理** 與 **PDF 圖片轉換**。

### 📥 工作流一：YouTube 字幕下載與處理

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
        # 提示：請輸入 YouTube 影片或播放清單網址:
        ```

#### 2. 字幕清理與合併 ([processor.py](file:///Users/linchengyi/PycharmProjects/GoldTubeHouse/processor.py))
*   **功能簡介**：讀取 `./subtitles/` 資料夾中的所有 `.vtt` 檔案，自動進行以下清理與格式化：
    *   移除 VTT 檔頭標記（如 `WEBVTT`, `Kind`, `Language`）。
    *   移除時間軸資訊（例如 `00:01:20.000 --> 00:01:22.000`）。
    *   移除 HTML 標記（例如 `<c>` 等字幕樣式標籤）。
    *   **重疊去重處理**：針對 YouTube 自動產生的滾動式字幕，自動過濾並合併重複累加的字句，避免產出重複內容。
    *   **段落合併**：將每個單元的字幕行合併為一整段連續的文字（以空格相連，消除多餘空格），並在前方加上 4 個空白的 Markdown 縮排。
*   **輸出結果**：合併後的內容會根據檔名前置序號進行排序，最後輸出至 `Flutter Tutorial for Beginners.md`。
*   **使用方式**：
    ```bash
    python processor.py
    # 提示：請輸入字幕資料夾路徑 (預設 ./subtitles):
    ```

#### 3. 字幕按章節自動分段 ([segment_subtitles.py](file:///Users/linchengyi/PycharmProjects/GoldTubeHouse/segment_subtitles.py))
*   **功能簡介**：針對具有章節（Chapters）標記的 YouTube 影片，自動下載字幕並按照章節時間軸進行切割，生成結構分明的 Markdown 文件。
*   **運作邏輯**：
    1.  自動下載目標影片的 `zh-TW` 字幕。
    2.  解析 VTT 字幕中的每一筆時間戳記。
    3.  根據腳本內輸入的 `raw_chapters` 章節清單，比對字幕的起始時間。
    4.  將字幕內容分配到對應的章節標題下（如 `## 01:34 AI 正在吃掉軟體...`），同時進行字幕清理與去重。
*   **輸出結果**：輸出至 `AI_Storm_Subtitles.md`。
*   **使用方式**：直接在程式碼中修改 `video_url` 與 `raw_chapters` 字串，然後執行：
    ```bash
    python segment_subtitles.py
    ```

---

### 📄 工作流二：PDF 轉高畫質圖片

#### 1. PDF 單一轉換工具 ([pdf_to_images.py](file:///Users/linchengyi/PycharmProjects/GoldTubeHouse/pdf_to_images.py))
*   **功能簡介**：將 PDF 的每一頁轉換為高畫質的 PNG 圖片。
*   **技術細節**：
    *   使用 PyMuPDF (`fitz`) 進行快速渲染。
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
