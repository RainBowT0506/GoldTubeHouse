import fitz  # PyMuPDF
import os
from pathlib import Path

class PDFPageConverter:
    @staticmethod
    def convert_pdf_to_images(pdf_path, output_dir=None, zoom=2):
        """
        將 PDF 的每一頁轉換為圖片
        """
        pdf_path = Path(pdf_path)
        if not pdf_path.exists():
            print(f"錯誤：找不到檔案 {pdf_path}")
            return False

        # 如果未指定輸出目錄，則在 PDF 同層建立一個同名的資料夾
        if output_dir is None:
            output_dir = pdf_path.parent / pdf_path.stem
        else:
            output_dir = Path(output_dir)

        if not output_dir.exists():
            output_dir.mkdir(parents=True)

        print(f"正在處理: {pdf_path.name}")
        
        # 開啟 PDF
        doc = fitz.open(pdf_path)
        
        for page_index in range(len(doc)):
            page = doc[page_index]
            
            # 設定縮放比例 (DPI)
            mat = fitz.Matrix(zoom, zoom)
            
            # 取得頁面的 pixmap (圖片資料)
            pix = page.get_pixmap(matrix=mat)
            
            # 設定輸出的檔名
            output_filename = output_dir / f"page_{page_index + 1:03d}.png"
            
            # 儲存圖片
            pix.save(output_filename)
            print(f"  已儲存: {output_filename.name}")

        doc.close()
        print(f"\n✅ 轉換完成！圖片儲存於: {output_dir}")
        return True


# Backward compatibility wrappers
def convert_pdf_to_images(pdf_path, output_dir=None):
    return PDFPageConverter.convert_pdf_to_images(pdf_path, output_dir)


if __name__ == "__main__":
    import sys
    
    # 預設處理 pdf 資料夾下的 PDF 檔案
    pdf_dir = Path("./pdf")
    
    if len(sys.argv) > 1:
        target = sys.argv[1]
        if os.path.isfile(target):
            convert_pdf_to_images(target)
        elif os.path.isdir(target):
            for f in Path(target).glob("*.pdf"):
                convert_pdf_to_images(f)
    else:
        pdf_files = list(pdf_dir.glob("*.pdf"))
        if pdf_files:
            for pdf_file in pdf_files:
                convert_pdf_to_images(pdf_file)
        else:
            print("請輸入 PDF 檔案路徑，或在 ./pdf 資料夾放入 PDF。")
