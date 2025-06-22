const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');
const moment = require('moment');

// Generar reporte en Excel
async function createExcelReport(data) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Inventario');

  // Cabeceras
  worksheet.columns = [
    { header: 'Código', key: 'codigo', width: 15 },
    { header: 'Nombre', key: 'nombre', width: 30 },
    { header: 'Categoría', key: 'categoria', width: 15 },
    { header: 'Stock Total', key: 'stockTotal', width: 12 },
    { header: 'Stock Mínimo', key: 'stockMinimo', width: 12 }
  ];

  // Datos
  data.forEach(item => {
    worksheet.addRow({
      codigo: item.codigo,
      nombre: item.nombre,
      categoria: item.categoria,
      stockTotal: item.stockTotal,
      stockMinimo: item.stockMinimo
    });
  });

  // Generar buffer
  return await workbook.xlsx.writeBuffer();
}

// Generar reporte en PDF
function createPDFReport(data) {
  const doc = new PDFDocument();
  
  doc.fontSize(18).text('Reporte de Inventario', { align: 'center' });
  doc.moveDown();
  doc.fontSize(10).text(`Generado el: ${moment().format('LLL')}`, { align: 'right' });
  doc.moveDown();
  
  data.forEach(item => {
    doc.fontSize(12).text(`${item.codigo} - ${item.nombre} (${item.categoria})`);
    doc.fontSize(10).text(`Stock: ${item.stockTotal} | Mínimo: ${item.stockMinimo}`);
    doc.moveDown(0.5);
  });
  
  doc.end();
  return doc;
}

module.exports = { createPDFReport, createExcelReport };