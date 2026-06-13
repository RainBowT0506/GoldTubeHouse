# GoldTubeHouse 專業術語 AI 分批整�本文件詳細記錄了「專業術語對照」AI 生成功能的分批整理演算法邏輯。該演算法設計的主要目的在於**優化 API 呼叫效率與維持上下文連貫性**，確保將長影片的字幕依據 105 分鐘基準門檻，智慧且平均地分批發送，避免產生極短的無意義尾部批次。

---

## 1. 設計背景與規則約束

在長影片（例如 3 至 6 小時的完整課程）中，若按章節個別發送給 AI 提取「專業術語」，將會產生大量的重複詞彙且費用昂貴。因此，我們需要對專業術語的發送文字進行時間軸合併，以減少 AI 呼叫次數，同時避免尾端出現太短的無意義批次（浪費 API 費用）。

我們設計了基於 **105 分鐘基準門檻** 的分批演算法：

1. **基本單位**：以影片中的章節卡片（Chapter）或自訂切分出的子分段（Sub-segments）為分段邊界。
2. **總時長 $\le 105$ 分鐘 (6300 秒)**：
   * 合併為 **1 批**發送。
3. **總時長 $> 105$ 分鐘**：
   * 每多 60 分鐘則多拆分出一批，總批次數 $N$ 計算公式為：
     $$N = \left\lceil \frac{\text{totalDurationMins} - 105}{60} \right\rceil + 1$$
   * 例如：
     * $105 < \text{時長} \le 165$ 分鐘 (如 2:45) $\implies 2$ 批 (每批理想長度 $\approx 52.5$ ~ $82.5$ 分鐘)。
     * $165 < \text{時長} \le 225$ 分鐘 (如 3:45) $\implies 3$ 批 (每批理想長度 $\approx 55$ ~ $75$ 分鐘)。
     * $225 < \text{時長} \le 285$ 分鐘 $\implies 4$ 批。
     * 依此類推。
4. **平均分配與邊界對齊**：
   * 確定總批次數 $N$ 後，計算每批的理想時長 $T_{\text{ideal}} = \text{totalDuration} / N$。
   * 對於第 $b$ 個批次（$b \in [0, N-2]$），其理想結束時間為 $\text{idealEnd} = (b + 1) \times T_{\text{ideal}}$。
   * 遍歷所有 segment 的結束點，尋找與理想結束時間 $\text{idealEnd}$ 絕對誤差最小的 segment 邊界作為實際切分點，實現最均勻的切分，避免「第一批切了很長、第二批卻只有十幾分鐘」的浪費。

---

## 2. 演算法實作說明

演算法實作於 [utils.ts](file:///Users/linchengyi/PycharmProjects/GoldTubeHouse/frontend/src/utils.ts) 的 `groupSegmentsForTerms` 函數中。

### 2.1 核心邏輯流程

1. **計算批次數 $N$**：
   * 將影片總長度轉換為分鐘：`totalDurationMins = totalDuration / 60`。
   * 若 `totalDurationMins <= 105`，則 `N = 1`。
   * 若 `totalDurationMins > 105`，則計算 `N = Math.ceil((totalDurationMins - 105) / 60) + 1`。
   * 為了安全防護，確保 $N$ 不超過卡片總數：`N = Math.min(N, segments.length)`。
2. **尋找最優邊界切分**：
   * 計算每批目標理想時長：`targetBatchDuration = totalDuration / N`。
   * 初始化起點索引 `startIndex = 0`。
   * 進行 $N-1$ 次切分循環（對應前 $N-1$ 個批次）：
     * 計算當前批次的理想結束時間：`idealEnd = (b + 1) * targetBatchDuration`。
     * 在可切分範圍內遍歷所有 segment 的結束時間，找出與 `idealEnd` 差值絕對值 `Math.abs(segments[i].end - idealEnd)` 最小的 segment。
     * 以此最接近 idealEnd 的邊界為切分點，切出當前批次，並將 `startIndex` 更新為該 segment 的下一個 index。
3. **最後一批處理**：
   * 將剩餘的所有 segment（從 `startIndex` 到結尾）包裝成最後一個批次。

---

## 3. 測試案例 Trace (Cases 1 to 5)

以下為測試套件中驗證的 5 個核心案例：

### Case 1：影片長度 1:36:52 (96.8 分鐘)
* **期待結果**：低於 105 分鐘 $\implies 1$ 批。
* **演算法 Trace**：
  * `totalDurationMins = 96.8`
  * 因為 $96.8 \le 105$，計算得 $N = 1$。
  * 整部影片合併為單一批次。
* **結果**：分 1 批發送。

### Case 2：影片長度 2:45:00 (165 分鐘)
* **期待結果**：剛好等於 165 分鐘 $\implies 2$ 批。
* **演算法 Trace**：
  * `totalDurationMins = 165`
  * 因為 $165 > 105$，計算 $N = \text{Math.ceil}((165 - 105) / 60) + 1 = \text{Math.ceil}(60 / 60) + 1 = 2$ 批。
  * 每批理想時長為 $165 / 2 = 82.5$ 分鐘。
* **結果**：分 2 批發送。

### Case 3：影片長度 2:46:00 (166 分鐘)
* **期待結果**：大於 165 分鐘 $\implies 3$ 批。
* **演算法 Trace**：
  * `totalDurationMins = 166`
  * 因為 $166 > 165$，計算 $N = \text{Math.ceil}((166 - 105) / 60) + 1 = \text{Math.ceil}(61 / 60) + 1 = 3$ 批。
  * 每批理想時長為 $166 / 3 \approx 55.3$ 分鐘。
* **結果**：分 3 批發送。

### Case 4：影片長度 4:30:00 (270 分鐘)
* **期待結果**：大於 225 分鐘但小於 285 分鐘 $\implies 4$ 批。
* **演算法 Trace**：
  * `totalDurationMins = 270`
  * 因為 $270 > 105$，計算 $N = \text{Math.ceil}((270 - 105) / 60) + 1 = \text{Math.ceil}(165 / 60) + 1 = 3 + 1 = 4$ 批。
  * 每批理想時長為 $270 / 4 = 67.5$ 分鐘。
* **結果**：分 4 批發送。

### Case 5：最接近理想結束時間的切分點搜尋
* **期待結果**：選擇與理想時間最接近的 segment 邊界。
* **演算法 Trace**：
  * 影片長度 120 分鐘 ($7200$ 秒)，$N = 2$ 批，理想結束點為 60 分鐘 ($3600$ 秒)。
  * 影片章節結束點分別在：Ch1 結束點於 45 分鐘 ($2700$ 秒)，Ch2 結束點於 70 分鐘 ($4200$ 秒)。
  * 計算兩者與理想結束點 $3600$ 秒的差距絕對值：
    * Ch1 結束誤差：$\text{Math.abs}(2700 - 3600) = 900$ 秒。
    * Ch2 結束誤差：$\text{Math.abs}(4200 - 3600) = 600$ 秒。
  * 選擇誤差最小的 Ch2 結束點為第一批切分點（即第一批在 70 分鐘處切分）。
* **結果**：分 2 批發送（第一批包含 Ch1 + Ch2，第二批包含 Ch3）。

---

## 4. 測試執行

本演算法的自動化測試套件可透過以下命令執行：

```bash
# 於專案根目錄下執行
npx tsx tests/test_frontend_segmentation.ts
```

**測試結果輸出範例**：
```
🧪 Running Frontend Segmentation Logic Tests...
[Test 1] 25 min video segments count: 1
✅ PASS: 25 minutes video is kept as a single segment (only 1 API request will be sent).
[Test 2] 40 min video segments count: 2
...
🧪 Running Professional Terms Partitioning Tests (Cases 1 to 9)...
[Case 1] 1:36:52 video batches count: 1
✅ PASS: Case 1 correctly generated 1 batch for 96.8 min video.
[Case 2] 2:45:00 video batches count: 2
✅ PASS: Case 2 correctly generated 2 batches for 165 min video.
...
🎉 All frontend segmentation, boundary, entry-split, and professional terms batching tests passed!
```2 合併)**
  * 剩餘 Ch3 (110m) 自成第二批。
* **結果**：分 2 批（Ch1 + Ch2 合併，Ch3 個別）。

### Case 6：影片總長 1:20 (不足 2 小時且切分會使尾端過短)
* **輸入章節**：
  * Ch1: `00:00 ~ 00:45` (45 分鐘)
  * Ch2: `00:45 ~ 01:20` (35 分鐘)
* **演算法 Trace**：
  * 0 ~ Ch1 結束 (45m): 小於 1 小時，不切。
  * 0 ~ Ch2 結束 (80m): 達到影片尾端。
* **結果**：不拆分，全片 1 批發送。

### Case 7：影片總長 2:05 (不足 2 小時但尾部長度足夠)
* **輸入章節**：
  * Ch1: `00:00 ~ 00:40` (40 分鐘)
  * Ch2: `00:40 ~ 01:15` (35 分鐘)
  * Ch3: `01:15 ~ 02:05` (50 分鐘)
* **演算法 Trace**：
  * 0 ~ Ch1 結束 (40m): 小於 1 小時，不切。
  * 0 ~ Ch2 結束 (75m): $\ge 60$m 且剩餘 $50$m $\ge 30$m $\to$ **切分第一批 (Ch1 + Ch2 合併)**
  * 剩餘 Ch3 (50m) 為第二批（時長 $\ge 30$m，符合規定）。
* **結果**：分 2 批（Ch1 + Ch2 合併，Ch3 個別）。

### Case 8：影片總長 2:20，尾部章節極短 (15 分鐘)
* **輸入章節**：
  * Ch1: `00:00 ~ 01:10` (70 分鐘)
  * Ch2: `01:10 ~ 02:05` (55 分鐘)
  * Ch3: `02:05 ~ 02:20` (15 分鐘)
* **演算法 Trace**：
  * 0 ~ Ch1 結束 (70m): $\ge 60$m 且剩餘 $70$m $\ge 30$m $\to$ **切分第一批 (Ch1 個別)**
  * 從 Ch1 開始尋找第二批切分點：
    * 尋找 Ch2 結束 (55m): 雖然剩餘 Ch3 僅 15m，且自身 55m 未滿 1 小時。
    * 因此，Ch2 與 Ch3 必須合併發送以滿足尾端保護與最小時長要求。
* **結果**：分 2 批（Ch1 個別，Ch2 + Ch3 合併）。

### Case 9：影片總長 2:05，尾部章節極短 (15 分鐘)
* **輸入章節**：
  * Ch1: `00:00 ~ 01:10` (70 分鐘)
  * Ch2: `01:10 ~ 01:50` (40 分鐘)
  * Ch3: `01:50 ~ 02:05` (15 分鐘)
* **演算法 Trace**：
  * 0 ~ Ch1 結束 (70m): $\ge 60$m 且剩餘 $55$m $\ge 30$m $\to$ **切分第一批 (Ch1 個別)**
  * 自 Ch1 往後：剩餘的 Ch2 (40m) 與 Ch3 (15m) 長度總和為 55m ($>30$m)，因為不夠再切分出 1 小時，自成第二批。
* **結果**：分 2 批（Ch1 個別，Ch2 + Ch3 合併）。

---

## 4. 測試執行

本演算法的自動化測試套件可透過以下命令執行：

```bash
# 於專案根目錄下執行
npx tsx tests/test_frontend_segmentation.ts
```

**測試結果輸出範例**：
```
🧪 Running Frontend Segmentation Logic Tests...
[Test 1] 25 min video segments count: 1
✅ PASS: 25 minutes video is kept as a single segment (only 1 API request will be sent).
[Test 2] 40 min video segments count: 2
...
🧪 Running Professional Terms Partitioning Tests (Cases 1 to 9)...
[Case 1] Batches count: 3
✅ PASS: Case 1 correctly generated 3 individual batches.
[Case 2] Batches count: 3
✅ PASS: Case 2 correctly merged Ch1 and Ch2, leaving Ch3 and Ch4 individual.
...
🎉 All frontend segmentation, boundary, entry-split, and professional terms batching tests passed!
```
