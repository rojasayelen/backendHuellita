const Producto = require('../models/Producto');
const Lote = require('../models/Lote');
const Movimiento = require('../models/Movimiento');
const moment = require('moment');

class StockService {
  // Registrar un nuevo producto
  async crearProducto(productoData) {
    const producto = new Producto(productoData);
    return await producto.save();
  }

  // Registrar movimiento de stock
  async registrarMovimiento(movimientoData) {
    const movimiento = new Movimiento(movimientoData);
    
    // Actualizar stock del lote si corresponde
    if (movimientoData.lote) {
      await Lote.findByIdAndUpdate(
        movimientoData.lote,
        { $inc: { cantidad: movimientoData.tipo === 'entrada' ? movimientoData.cantidad : -movimientoData.cantidad } }
      );
    }
    
    return await movimiento.save();
  }

  // Obtener alertas de stock mínimo
  async obtenerAlertasStockMinimo() {
    return await Producto.aggregate([
      {
        $lookup: {
          from: 'lotes',
          localField: '_id',
          foreignField: 'producto',
          as: 'lotes'
        }
      },
      {
        $addFields: {
          stockTotal: { $sum: '$lotes.cantidad' }
        }
      },
      {
        $match: {
          $expr: { $lte: ['$stockTotal', '$stockMinimo'] }
        }
      }
    ]);
  }

  // Obtener productos próximos a vencer
  async obtenerProximosAVencer(dias = 30) {
    const fechaLimite = moment().add(dias, 'days').toDate();
    return await Lote.find({
      fechaVencimiento: { $lte: fechaLimite },
      cantidad: { $gt: 0 }
    }).populate('producto');
  }

  // Generar reporte de inventario
  async generarReporteInventario() {
    return await Producto.aggregate([
      {
        $lookup: {
          from: 'lotes',
          localField: '_id',
          foreignField: 'producto',
          as: 'lotes'
        }
      },
      {
        $addFields: {
          stockTotal: { $sum: '$lotes.cantidad' },
          lotesActivos: {
            $filter: {
              input: '$lotes',
              as: 'lote',
              cond: { $gt: ['$$lote.cantidad', 0] }
            }
          }
        }
      },
      { $sort: { categoria: 1, nombre: 1 } }
    ]);
  }

  async listarProductos() {
  return await Producto.aggregate([
    {
      $lookup: {
        from: 'lotes',
        localField: '_id',
        foreignField: 'producto',
        as: 'lotes'
      }
    },
    {
      $addFields: {
        stockTotal: { $sum: '$lotes.cantidad' }
      }
    },
    { $sort: { nombre: 1 } }
  ]);
}
}

module.exports = new StockService();