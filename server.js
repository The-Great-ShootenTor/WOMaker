app.post('/generate-pdf', async (req, res) => {
  const payload = Array.isArray(req.body) ? req.body[0] : req.body;
  const data = {
    order: payload.order,
    items: payload.items,
    optimization: payload.optimization
  };

  try {
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
      margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' }
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="workorder.pdf"'
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation error:', err);
    res.status(500).send('PDF generation failed');
  }
});
