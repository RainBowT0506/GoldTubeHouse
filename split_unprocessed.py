import os
from pathlib import Path
from pdf_to_images import convert_pdf_to_images

def main():
    # Define directories
    pdf_dir = Path("./pdf")
    unprocessed_dir = pdf_dir / "未處理"
    
    if not unprocessed_dir.exists():
        print(f"錯誤：找不到未處理資料夾 {unprocessed_dir}")
        return

    # Find all PDF files in the unprocessed directory
    pdf_files = sorted(list(unprocessed_dir.glob("*.pdf")))
    
    if not pdf_files:
        print("未處理資料夾中沒有發現任何 PDF 檔案。")
        return

    print(f"發現 {len(pdf_files)} 個待處理的 PDF 檔案：")
    for idx, pdf_file in enumerate(pdf_files, 1):
        print(f"  {idx}. {pdf_file.name} ({pdf_file.stat().st_size / 1024 / 1024:.2f} MB)")
    print("-" * 50)

    # Process each PDF
    for idx, pdf_file in enumerate(pdf_files, 1):
        # Clean the folder name by stripping leading/trailing whitespaces from stem
        clean_stem = pdf_file.stem.strip()
        output_dir = pdf_dir / clean_stem
        
        print(f"\n[{idx}/{len(pdf_files)}] 正在處理: {pdf_file.name}")
        print(f"輸出資料夾: {output_dir}")
        
        try:
            convert_pdf_to_images(pdf_file, output_dir=output_dir)
        except Exception as e:
            print(f"❌ 處理 {pdf_file.name} 時發生錯誤: {e}")
            
    print("\n" + "=" * 50)
    print("🎉 所有 PDF 檔案分割與轉換完成！")
    print("=" * 50)

if __name__ == "__main__":
    main()
