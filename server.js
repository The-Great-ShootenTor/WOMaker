const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const app = express(); // <== this is the line you were missing!
app.use(express.json({ limit: '10mb' }));

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
      displayHeaderFooter: true, // ✅ turn on
      margin: {
        top: '175px',   // space for header
        bottom: '100px', // space for footer
        left: '20px',
        right: '20px',
      },
      headerTemplate: `
        <style>
           .poppins-regular, p {
      font-family: "Poppins", sans-serif;
      font-weight: 400;
      font-style: normal;
    }
    p {
      margin: 4px;
    }

    .poppins-medium {
      font-family: "Poppins", sans-serif;
      font-weight: 500;
      font-style: normal;
    }

    .poppins-bold {
      font-family: "Poppins", sans-serif;
      font-weight: 700;
      font-style: normal;
    }
thead {
  display: table-header-group; /* This is key for repeating headers on print pages */
}

tbody {
  display: table-row-group;
}

    @page {
      size: A4;
      margin: .25in;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      margin: 0;
      padding: 0;
      color: #000;
    }

    .container {
      padding: 1rem;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }

    h1, h2, h3 {
      margin: 0;
      padding-bottom: 0.2rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 4px solid rgb(7, 31, 61);
    }

    .header,
    .footer {
      text-align: center;
      
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
    }

    .footer {
      border-top: 1px solid #ccc;
      margin-top: 2rem;
      padding-top: 0.5rem;
      display: flex;
      justify-content: space-between
    }

    .section {
      margin-bottom: 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.5rem;
    }

    .table1 th,
    .table1 td {
      border: 1px solid rgb(7, 31, 61);
      padding: 8px;
      text-align: left;
    }

    .table1 th {
      background-color:rgb(7, 31, 61);
      color: white;
    }

    .table2 {
      width: 80%;
    }
    .table2 th,
    .table2 td {
      border: 1px solid rgb(212, 135, 19);
      padding: 8px;
      text-align: left;
    }

    .table2 th {
      background-color:rgb(212, 135, 19);
      color: white;
    }
     .table3 {
      width: 100%;
      box-sizing: border-box;
    }
    .table3 th,
    .table3 td {
      border: 1px solid rgb(9, 65, 16);
      padding: 8px;
      text-align: left;
    }

    .table3 th {
      background-color:rgb(9, 65, 16);
      color: white;
    }
    .table4 {
      width: 100%;
      box-sizing: border-box;
    }
    .table4 th,
    .table4 td {
      border: 1px solid rgb(43, 16, 92);
      padding: 8px;
      text-align: left;
    }

    .table4 th {
      background-color:rgb(43, 16, 92);
      color: white;
    }

    .palletsC {
      width: 19%;
      border-left: solid 2px rgb(212, 135, 19);
      margin-top: 0.5rem;
    }

    tr {
      min-height: 100px;
    }
    th, .palletTitle {
      font-family: "Poppins", sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      margin: 0;
    }
    tr {
      font-family: "Poppins", sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      margin: 0;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }
    .headerLeft {
      text-align: left;
    }
    .headerRight {
      text-align: right;
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      align-items: flex-end;
      
    }

    .notes {
      border-bottom: 4px solid rgb(7, 31, 61);
      display: Flex;
      padding-bottom: 1rem;
    }

    .notes p {
      margin: 0;
    }

    .notes p[1] {
      color:  rgb(7, 31, 61);
    }

    .ASAP {
      padding:15px 50px;
      background-color:rgb(180, 60, 23);
      flex: 0 0 auto;
      width: auto;
      border-radius: 16px;
    }

    .ASAP p {
      color: white;
      font-size: 24px;
    }
    .flexSection {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    body {
      margin-top: 150px;
      margin-bottom: 150px;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
      }

      .no-print {
        display: none;
        gap: 10px;
        align-items: flex-start;
        justify-content: flex-start;
      }
    }
        </style>
        <div class="header">
            <div id="header" style="width: 100%;">
      <div class="clipboardTop"  >
        <div
          style="width: 150px; height: auto; overflow: hidden; padding-bottom: 1rem;">
          <img
            src="[Clipboard Image.Large.URL]"
            alt="Image"
            style="width: 100%; height: 100%; object-fit: cover;">
        </div>

      </div>
      <div class="header">
        <div class="headerLeft">
          <h1 class="poppins-bold"
            style="color: rgb(7, 31, 61); font-size: 24px;">WORK ORDER:
            <%= order['WO #'] || '' %></h1>
          <p>PO#: <%= order['PO Number'] || '' %></p>
          <p>Customer: <%= order['Customer Name']?.[0] || '' %></p>
          <p>Ship To: <%= order['Ship to Address']?.[0] || '' %></p>
        </div>
        <div class="headerRight">
          <h2 class="poppins-medium" style="font-size: 18px;">Ship Date:
            Ship Date: <%= order['Scheduled Ship Date'] || '' %></h2>
          <% if (order['ASAP']) { %>
          <div class="ASAP">
            <p class="poppins-bold">ASAP</p>
          </div>
        <% } %>
          
        </div>
      </div>
      </div>
      `,
      footerTemplate: `
        <style>
           .poppins-regular, p {
      font-family: "Poppins", sans-serif;
      font-weight: 400;
      font-style: normal;
    }
    p {
      margin: 4px;
    }

    .poppins-medium {
      font-family: "Poppins", sans-serif;
      font-weight: 500;
      font-style: normal;
    }

    .poppins-bold {
      font-family: "Poppins", sans-serif;
      font-weight: 700;
      font-style: normal;
    }
thead {
  display: table-header-group; /* This is key for repeating headers on print pages */
}

tbody {
  display: table-row-group;
}

    @page {
      size: A4;
      margin: .25in;
    }

    * {
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      margin: 0;
      padding: 0;
      color: #000;
    }

    .container {
      padding: 1rem;
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
    }

    h1, h2, h3 {
      margin: 0;
      padding-bottom: 0.2rem;
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 4px solid rgb(7, 31, 61);
    }

    .header,
    .footer {
      text-align: center;
      
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
    }

    .footer {
      border-top: 1px solid #ccc;
      margin-top: 2rem;
      padding-top: 0.5rem;
      display: flex;
      justify-content: space-between
    }

    .section {
      margin-bottom: 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 0.5rem;
    }

    .table1 th,
    .table1 td {
      border: 1px solid rgb(7, 31, 61);
      padding: 8px;
      text-align: left;
    }

    .table1 th {
      background-color:rgb(7, 31, 61);
      color: white;
    }

    .table2 {
      width: 80%;
    }
    .table2 th,
    .table2 td {
      border: 1px solid rgb(212, 135, 19);
      padding: 8px;
      text-align: left;
    }

    .table2 th {
      background-color:rgb(212, 135, 19);
      color: white;
    }
     .table3 {
      width: 100%;
      box-sizing: border-box;
    }
    .table3 th,
    .table3 td {
      border: 1px solid rgb(9, 65, 16);
      padding: 8px;
      text-align: left;
    }

    .table3 th {
      background-color:rgb(9, 65, 16);
      color: white;
    }
    .table4 {
      width: 100%;
      box-sizing: border-box;
    }
    .table4 th,
    .table4 td {
      border: 1px solid rgb(43, 16, 92);
      padding: 8px;
      text-align: left;
    }

    .table4 th {
      background-color:rgb(43, 16, 92);
      color: white;
    }

    .palletsC {
      width: 19%;
      border-left: solid 2px rgb(212, 135, 19);
      margin-top: 0.5rem;
    }

    tr {
      min-height: 100px;
    }
    th, .palletTitle {
      font-family: "Poppins", sans-serif;
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      margin: 0;
    }
    tr {
      font-family: "Poppins", sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      margin: 0;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }
    .headerLeft {
      text-align: left;
    }
    .headerRight {
      text-align: right;
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      align-items: flex-end;
      
    }

    .notes {
      border-bottom: 4px solid rgb(7, 31, 61);
      display: Flex;
      padding-bottom: 1rem;
    }

    .notes p {
      margin: 0;
    }

    .notes p[1] {
      color:  rgb(7, 31, 61);
    }

    .ASAP {
      padding:15px 50px;
      background-color:rgb(180, 60, 23);
      flex: 0 0 auto;
      width: auto;
      border-radius: 16px;
    }

    .ASAP p {
      color: white;
      font-size: 24px;
    }
    .flexSection {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    body {
      margin-top: 150px;
      margin-bottom: 150px;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact;
      }

      .no-print {
        display: none;
        gap: 10px;
        align-items: flex-start;
        justify-content: flex-start;
      }
    }
        </style>
              
      <div class="footer" id="footer" style="position: fixed; bottom: 0; width: 100%;">
        <div
          style="width: 30%; height: 80px; overflow: hidden; padding-bottom: 1rem;">
          <img src="https://washmachinebases.com/a/A/Artboard%201%20copy.png"
            alt="Image"
            style="width: 100%; height: 100%; object-fit: contain;">
        </div>
        <p class="poppins-bold" style="font-size: 20px; width: 30%"><span class="pageNumber"></span> of <span class="totalPages"></span></p>
        <div style="width: 30%"></div>
        
      </div>
     
      `
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PDF generator running on port ${PORT}`);
});
