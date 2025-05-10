const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF({
  htmlContent,
  fileName,
  folderPath,
  baseBackPath,   // Yeh dynamic kiya hai
  headerTemplate = '<div style="height:0;"></div>',
  footerTemplate = '<div style="height:0;"></div>'
}) {
  try {

 if (typeof headerTemplate !== 'string' || headerTemplate.trim() === '') {
    headerTemplate = '<div style="height:0;"></div>';
  }

  if (typeof footerTemplate !== 'string' || footerTemplate.trim() === '') {
    footerTemplate = '<div style="height:0;"></div>';
  }


    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent);

    // Final pdfDir
    const pdfDir = path.join(__dirname, baseBackPath, process.env.DOMAIN, folderPath);

    // Create folder if not exists
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    const pdfPath = path.join(pdfDir, fileName);

    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate,
      footerTemplate,
      margin: {
        top: '20mm',
        right: '10mm',
        bottom: '50mm',
        left: '10mm',
      },
    });

    await browser.close();

    return {
      status: true,
      path: pdfPath
    }
  } catch (error) {
   // console.error('Error generating PDF:', error);
   // throw error;
    return {
      status: false,
      message: error.message 
    }
  }
}

module.exports = { generatePDF };
