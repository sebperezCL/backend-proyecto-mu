'use strict';

const mongoose = require('mongoose');

const orgSchema = mongoose.Schema({
  orgId: {
    // Puede corresponder al identificador fiscal
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  nombre: {
    type: String,
    index: true,
    required: true,
  },
  fundacion: Date,
  presidente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tesorero: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  secretario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  direccion: String,
  ciudad: String,
  provincia: String,
  pais: String,
  periodo: [
    {
      year: Number,
      cuotaAnual: [
        {
          // En un año pueden haber muchos tipos de cuotas distintas, una estándar y varias especiales
          descripcion: String,
          valor: Number,
          default: Boolean, // indica si es la cuota por defecto para el año indicado
        },
      ],
      abono: [
        {
          user: String,
          id: Number,
          fecha: Date,
          monto: Number,
          medioPago: String,
          banco: String,
          nroCheque: String,
        },
      ],
      egreso: [
        // Gastos
        {
          id: Number,
          fecha: Date,
          monto: Number,
          medioPago: String,
          banco: String,
          nroCheque: String,
          descripcion: String,
        },
      ],
    },
  ],
});

const Org = mongoose.model('Org', orgSchema);

module.exports = Org;
