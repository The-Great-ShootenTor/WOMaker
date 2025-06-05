const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const app = express();
app.use(express.json({ limit: '10mb' }));

app.post('/generate-pdf', async (req, res) => {
  try {
    const data = req.body;

    // Render EJS template with provided data
    const templatePath = path.join(__dirname, 'WO_template.ejs');
    const html = await ejs.renderFile(templatePath, { data });

    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      margin: {
        top: '5in', // reserve space for header
        bottom: '100px' // reserve space for footer
      },
      headerTemplate: `
      `,
      footerTemplate: `
        <style>
          .footer {
            font-size: 15px;
            width: 100%;
            text-align: center;
          }
        </style>
        <div class="footer">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>
      `
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="workorder.pdf"'
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).send('PDF generation failed');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PDF generator running on port ${PORT}`);
});
