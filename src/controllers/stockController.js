const stockService = require('../services/stockService');
const { createPDFReport, createExcelReport } = require('../utils/reportGenerator');
const Producto = require('../models/Producto');

class StockController {
  // Vistas
  mostrarFormularioNuevo(req, res) {
    res.render('stock/form-producto', { 
      title: 'Nuevo Producto',
      producto: null // Indica que es creación
    });
  }

  // Productos
  async crearProducto(req, res) {
    try {
      const productoData = req.body;
      
      // Conversión y validación de datos
      productoData.stockMinimo = Number(productoData.stockMinimo);
      productoData.precio = Number(productoData.precio);
      productoData.activo = productoData.activo === 'true';
      
      // Autogenerar código si no se proporciona
      if (!productoData.codigo) {
        const ultimoProducto = await Producto.findOne().sort({ codigo: -1 });
        const nuevoNumero = ultimoProducto ? 
          parseInt(ultimoProducto.codigo.split('-')[1]) + 1 : 1;
        productoData.codigo = `PROD-${nuevoNumero.toString().padStart(4, '0')}`;
      }

      await stockService.crearProducto(productoData);
      
      req.flash('success', 'Producto creado exitosamente');
      res.redirect('/stock/productos');
    } catch (error) {
      console.error('Error al crear producto:', error);
      req.flash('error', 'Error al crear el producto: ' + error.message);
      res.redirect('/stock/productos/nuevo');
    }
  }

  // Movimientos
  async registrarMovimiento(req, res, next) {
    try {
      const movimiento = await stockService.registrarMovimiento({
        ...req.body,
        usuario: req.user._id
      });
      
      req.flash('success', 'Movimiento registrado exitosamente');
      res.redirect('/stock/movimientos');
    } catch (error) {
      req.flash('error', 'Error al registrar movimiento: ' + error.message);
      res.redirect(req.originalUrl);
    }
  }

  // Alertas
async obtenerAlertas(req, res) {
  try {
    const [stockMinimo, proximosAVencer] = await Promise.all([
      stockService.obtenerAlertasStockMinimo(),
      stockService.obtenerProximosAVencer()
    ]);
    
    console.log('Stock mínimo encontrado:', stockMinimo?.length || 0);
    console.log('Próximos a vencer:', proximosAVencer?.length || 0);
    
    res.render('stock/dashboard', {
      title: 'Dashboard de Stock',
      alertas: { 
        stockMinimo: stockMinimo || [], 
        proximosAVencer: proximosAVencer || [] 
      },
      inventario: await stockService.generarReporteInventario() || []
    });
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    req.flash('error', 'Error al cargar el dashboard');
    res.redirect('/stock/productos');
  }
}
  // Reportes
  async generarReporte(req, res) {
    try {
      const { tipo = 'pdf' } = req.query;
      const data = await stockService.generarReporteInventario();
      
      if (tipo === 'excel') {
        const buffer = await createExcelReport(data);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=inventario.xlsx');
        return res.send(buffer);
      } else {
        const stream = createPDFReport(data);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=inventario.pdf');
        stream.pipe(res);
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
      req.flash('error', 'Error al generar reporte');
      res.redirect('/stock');
    }
  }

  // Lista de productos
  async listarProductos(req, res) {
    try {
      const productos = await stockService.listarProductos();
      res.render('stock/productos', {
        title: 'Gestión de Productos',
        productos
      });
    } catch (error) {
      console.error('Error al listar productos:', error);
      req.flash('error', 'Error al cargar la lista de productos');
      res.redirect('/stock');
    }
  }
}

module.exports = new StockController();