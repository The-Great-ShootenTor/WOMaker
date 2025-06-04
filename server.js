const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

app.post('/generate-pdf', async (req, res) => {
  try {
    // Step 1: Load HTML template
    let htmlTemplate = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');

    // Step 2: Inject JSON data
    const data = req.body; // Expects JSON like { customerName: 'Ben', invoiceNumber: 'INV-001' }
    for (const [key, value] of Object.entries(data)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      htmlTemplate = htmlTemplate.replace(regex, value);
    }

    // Step 3: Generate PDF with Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlTemplate, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: false, // We're using custom HTML headers
      margin: {
        top: '0px',
        bottom: '0px',
        left: '0px',
        right: '0px',
      },
    });

    await browser.close();

    // Step 4: Return PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="document.pdf"',
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).send('Failed to generate PDF');
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
