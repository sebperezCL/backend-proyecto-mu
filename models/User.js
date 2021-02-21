'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    uidFirebase: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    nombres: {
      type: String,
      required: [true, 'Name cannot be empty'],
    },
    firstSurname: {
      type: String,
      required: [true, 'Surname cannot be empty'],
    },
    secondSurname: {
      type: String,
    },
    fiscalId: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    activo: {
      type: Boolean,
      required: true,
      default: false,
    },
    foto: String, // ruta a fotografía del usuario
    role: {
      type: String,
      default: 'Miembro',
      enum: {
        values: [
          'SuperAdmin',
          'Tesorero',
          'Presidente',
          'Secretario',
          'Miembro',
        ],
        message: 'You cannot enter another role',
      },
    },
    contacto: {
      direccion: String,
      fonoCasa: String,
      fonoOficina: String,
    },
    orgMiembro: [
      {
        nombre: String,
        codigoId: String,
        periodo: [
          {
            year: Number,
            condicion: String,
            eximido: Boolean,
            valorAnual: {
              monto: Number,
              descripcion: String,
            },
            abono: [
              {
                id: Number,
                fecha: Date,
                monto: Number,
                medioPago: String,
                banco: String,
                nroCheque: String,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    autoIndex: process.env.NODE_ENV !== 'production', // no crear los índices automáticamente en producción
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
