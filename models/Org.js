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
          userName: String,
          userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          date: { type: String, required: true },
          amount: { type: Number, required: true },
          paymentMethod: String,
          checkNumber: String,
          bank: String,
          message: String,
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

orgSchema.methods.setFee = function (year, description, amount, defaultFee) {
  if (!this.fiscalYear) this.fiscalYear = [];
  const periodo = this.fiscalYear.filter(fy => fy.year === parseInt(year));
  // Si existe el periodo le agrega una nueva cuota
  if (periodo[0]) {
    if (defaultFee) {
      periodo[0].feePerYear.forEach(fee => {
        fee.defaultFee = false;
      });
    }
    periodo[0].feePerYear.push({
      description: description,
      amount: parseInt(amount),
      defaultFee: defaultFee,
    });
    //console.log(periodo[0]);
    return;
  }

  // Si no existe entonces crea el periodo con la cuota nueva
  const fee = {
    year: year,
    feePerYear: [
      {
        description: description,
        amount: parseInt(amount),
        defaultFee: defaultFee,
      },
    ],
  };
  this.fiscalYear.push(fee);
  return;
};

orgSchema.methods.setPayment = function (data) {
  const { year, desc, date, amount, userId } = data;
  const fiscalYear = this.fiscalYear.filter(fy => fy.year === parseInt(year));
  if (fiscalYear.length > 0) {
    fiscalYear[0].payment.push({
      userId,
      date,
      message: desc,
      amount,
    });
  }
  //console.log(fiscalYear[0]);
};

const Org = mongoose.model('Org', orgSchema);

module.exports = Org;
