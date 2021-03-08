'use strict';

const mongoose = require('mongoose');

const orgSchema = mongoose.Schema({
  // orgId: {
  //   // Puede corresponder al identificador fiscal
  //   type: String,
  //   index: true,
  //   unique: true,
  //   required: true,
  // },
  name: {
    type: String,
    index: true,
    required: true,
  },
  foundationDate: String,
  president: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  treasurer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  secretary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  address: String,
  city: String,
  province: String,
  country: String,
  photoURL: String,
  fiscalYear: [
    {
      year: Number,
      feePerYear: [
        {
          // En un año pueden haber muchos tipos de cuotas distintas, una estándar y varias especiales
          description: String,
          amount: Number,
          defaultFee: Boolean, // indica si es la cuota por defecto para el año indicado
        },
      ],
      payment: [
        {
          user: String,
          id: Number,
          date: Date,
          amount: Number,
          paymentMethod: String,
          checkNumber: String,
          bank: String,
        },
      ],
      expense: [
        // Gastos
        {
          id: Number,
          date: Date,
          amount: Number,
          paymentMethod: String,
          bank: String,
          checkNumber: String,
          description: String,
        },
      ],
    },
  ],
});

const Org = mongoose.model('Org', orgSchema);

module.exports = Org;
