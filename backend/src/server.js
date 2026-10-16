const app = require('./app');

const PORT = process.env.PORT || 8000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`=================================================`);
  console.log(` TECHSPIRIT 2026 Node.js Server Active`);
  console.log(` Port: ${PORT}`);
  console.log(` Health: http://localhost:${PORT}/api/health`);
  console.log(` Google Sheets ID: ${process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '1Y8ExCm3-oXK10o7Wysml0ITGXsLfnqb5kV899ddMm5k'}`);
  console.log(`=================================================`);
});
