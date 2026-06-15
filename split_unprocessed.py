import os
from pathlib import Path
from pdf_to_images import PDFPageConverter

class PDFBatchManager:
    def __init__(self, pdf_dir: str = "./pdf"):
        self.pdf_dir = Path(pdf_dir)
        self.unprocessed_dir = self.pdf_dir / "未處理"

    def process_unprocessed_pdfs(self) -> bool:
        if not self.unprocessed_dir.exists():
            print(f"錯誤：找不到未處理資料夾 {self.unprocessed_dir}")
            return False

        # Find all PDF files in the unprocessed directory
        pdf_files = sorted(list(self.unprocessed_dir.glob("*.pdf")))
        
        if not pdf_files:
            print("未處理資料夾中沒有發現任何 PDF 檔案。")
            return False

        print(f"發現 {len(pdf_files)} 個待處理的 PDF 檔案：")
        for idx, pdf_file in enumerate(pdf_files, 1):
            print(f"  {idx}. {pdf_file.name} ({pdf_file.stat().st_size / 1024 / 1024:.2f} MB)")
        print("-" * 50)

        # Process each PDF
        for idx, pdf_file in enumerate(pdf_files, 1):
            clean_stem = pdf_file.stem.strip()
            output_dir = self.pdf_dir / clean_stem
            
            print(f"\n[{idx}/{len(pdf_files)}] 正在處理: {pdf_file.name}")
            print(f"輸出資料夾: {output_dir}")
            
            try:
                PDFPageConverter.convert_pdf_to_images(pdf_file, output_dir=output_dir)
            except Exception as e:
                print(f"❌ 處理 {pdf_file.name} 時發生錯誤: {e}")
                
        print("\n" + "=" * 50)
        print("🎉 所有 PDF 檔案分割與轉換完成！")
        print("=" * 50)
        return True


if __name__ == "__main__":
    manager = PDFBatchManager()
    manager.process_unprocessed_pdfs()
