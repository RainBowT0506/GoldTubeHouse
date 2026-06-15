// ============================================================
// GoldTubeHouse — 全域常數設定
// 所有魔法值（magic values）集中於此，方便日後調整
// ============================================================

// --- 分段設定預設值（分鐘）---
/** 每個 AI 群組的目標區間長度（分鐘），超過此長度才切新群組 */
export const DEFAULT_INTERVAL_MIN = 30;

/** 短影片判斷上限（分鐘）；影片時長 ≤ 此值（+緩衝）且無章節 → 短影片 combined 模式 */
export const DEFAULT_NO_SEGMENT_MIN = 30;

/** 子段落（SubSegment）切分上限（分鐘） */
export const DEFAULT_SUB_SEGMENT_MIN = 30;

/** 短影片判斷緩衝秒數（避免剛好卡在邊界）*/
export const SHORT_VIDEO_BUFFER_SEC = 300; // 5 分鐘緩衝

// --- GPT-5.1 計費費率 ---
/** 輸入 Token 費率（USD / 1M tokens）*/
export const PRICE_INPUT_PER_M = 1.25;

/** 輸出 Token 費率（USD / 1M tokens）*/
export const PRICE_OUTPUT_PER_M = 10.0;

/** 台幣匯率（TWD / USD）*/
export const TWD_PER_USD = 32.5;

// --- Token 輸出量估算 ---
/** 每次筆記呼叫預估輸出 tokens */
export const EST_OUTPUT_TOKENS_NOTES = 500;

/** 每次術語呼叫預估輸出 tokens */
export const EST_OUTPUT_TOKENS_TERMS = 800;

/** 短影片 combined 呼叫預估總輸出 tokens（筆記 + 術語）*/
export const EST_OUTPUT_TOKENS_COMBINED = EST_OUTPUT_TOKENS_NOTES + EST_OUTPUT_TOKENS_TERMS; // 1300

/** 字元數 → Token 數估算倍率 */
export const CHARS_TO_TOKENS_RATIO = 1.2;
