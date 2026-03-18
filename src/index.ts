import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';
import { PDFDocument, rgb } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Temp directory for downloaded files (Vercel uses /tmp)
const tempDir = process.env.TEMP_DIR || '/tmp';

/**
 * Download file from URL
 */
async function downloadFile(url: string): Promise<Buffer> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  });
  return Buffer.from(response.data);
}

/**
 * Convert JPG/JPEG to PDF
 */
async function convertJpgToPdf(jpgBuffer: Buffer): Promise<PDFDocument> {
  const pdfDoc = await PDFDocument.create();
  const jpgImage = await pdfDoc.embedJpg(jpgBuffer);
  
  // Add page with same aspect ratio as image
  const jpgDims = jpgImage.scale(1);
  const page = pdfDoc.addPage([jpgDims.width, jpgDims.height]);
  
  page.drawImage(jpgImage, {
    x: 0,
    y: 0,
    width: jpgDims.width,
    height: jpgDims.height,
  });
  
  return pdfDoc;
}

/**
 * API: Merge PDFs from URLs
 * POST /api/merge
 * Body: { "urls": "url1.pdf,url2.pdf,url3.jpg" } or { "urls": ["url1.pdf", "url2.pdf"] }
 */
app.post('/api/merge', async (req: Request, res: Response): Promise<void> => {
  try {
    const { urls } = req.body;

    // Parse URLs from string or array
    let urlList: string[];
    
    if (typeof urls === 'string') {
      // Handle comma-separated string
      urlList = urls.split(',').map((url: string) => url.trim()).filter((url: string) => url.length > 0);
    } else if (Array.isArray(urls)) {
      urlList = urls;
    } else {
      res.status(400).json({
        success: false,
        error: 'กรุณาระบุ URLs เป็น string (comma-separated) หรือ array'
      });
      return;
    }

    // Validate input
    if (urlList.length < 1) {
      res.status(400).json({
        success: false,
        error: 'กรุณาระบุ URLs อย่างน้อย 1 URL'
      });
      return;
    }

    // Create new PDF document
    const mergedPdf = await PDFDocument.create();

    // Download and merge each file
    for (let i = 0; i < urlList.length; i++) {
      const url = urlList[i];
      
      if (typeof url !== 'string') {
        res.status(400).json({
          success: false,
          error: `URL ที่ ${i + 1} ไม่ถูกต้อง`
        });
        return;
      }

      const fileExtension = url.split('.').pop()?.toLowerCase();
      console.log(`Downloading file ${i + 1}/${urlList.length}: ${url} (${fileExtension})`);

      try {
        const fileBuffer = await downloadFile(url);
        
        if (fileExtension === 'jpg' || fileExtension === 'jpeg') {
          // Convert JPG to PDF
          console.log(`Converting JPG to PDF...`);
          const jpgPdf = await convertJpgToPdf(fileBuffer);
          
          // Copy all pages from converted JPG PDF
          const copiedPages = await mergedPdf.copyPages(jpgPdf, jpgPdf.getPageIndices());
          copiedPages.forEach((page) => {
            mergedPdf.addPage(page);
          });
          
          console.log(`Converted and merged 1 page from JPG ${i + 1}`);
        } else if (fileExtension === 'pdf') {
          // Merge PDF
          const pdfDoc = await PDFDocument.load(fileBuffer);
          
          // Copy all pages from the source PDF
          const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
          
          // Add pages to the merged document
          copiedPages.forEach((page) => {
            mergedPdf.addPage(page);
          });

          console.log(`Merged ${pdfDoc.getPageCount()} pages from PDF ${i + 1}`);
        } else {
          console.warn(`Skipping unsupported file type: ${fileExtension}`);
        }
      } catch (urlError: any) {
        console.error(`Error processing file from ${url}:`, urlError.message);
        res.status(400).json({
          success: false,
          error: `ไม่สามารถดาวน์โหลด/ประมวลผลไฟล์จาก URL ที่ ${i + 1}: ${url}`
        });
        return;
      }
    }

    // Save merged PDF
    const mergedPdfBytes = await mergedPdf.save();

    // Send response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=merged.pdf');
    res.send(Buffer.from(mergedPdfBytes));

    console.log('PDF merge completed successfully');

  } catch (error: any) {
    console.error('Error merging PDFs:', error);
    res.status(500).json({
      success: false,
      error: 'เกิดข้อผิดพลาดในการรวมไฟล์ PDF: ' + error.message
    });
  }
});

/**
 * API: Health check
 * GET /health
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok', 
    message: 'PDF Merge API is running' 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 PDF Merge API running on http://localhost:${PORT}`);
  console.log(`📝 API Endpoint: POST /api/merge`);
  console.log(`💡 Example: curl -X POST http://localhost:${PORT}/api/merge -H "Content-Type: application/json" -d '{"urls": "url1.pdf,url2.jpg"}'`);
});