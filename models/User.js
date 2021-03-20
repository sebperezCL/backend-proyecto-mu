'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    uid: {
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
    displayName: {
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
    fiscalNumber: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    active: {
      type: Boolean,
      //required: true,
      default: true,
    },
    photoURL: String, // ruta a fotografía del usuario
    role: {
      type: String,
      default: 'Member',
      enum: {
        values: ['SuperAdmin', 'Treasurer', 'President', 'Secretary', 'Member'],
        message: 'You cannot enter another role',
      },
    },
    contact: {
      address: String,
      mobile: String,
      homePhone: String,
    },
    organizations: [
      {
        name: String,
        fiscalYear: [
          {
            year: Number,
            condition: String,
            exempt: Boolean,
            feePerYear: {
              amount: Number,
              description: String,
            },
            payment: [
              {
                paymentId: Number,
                date: String,
                amount: Number,
                paymentMethod: String,
                bank: String,
                checkNumber: String,
                message: String,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    autoIndex: process.env.NODE_ENV !== 'production', // no crear los índices automáticamente en producción
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

userSchema.virtual('fullName').get(function () {
  return `${this.displayName.trim()} ${this.firstSurname.trim()} ${this.secondSurname.trim()}`;
});

userSchema.methods.setPayment = function (data, orgId) {
  const { year, desc, date, amount, userId } = data;

  const org = this.organizations.filter(
    o => o._id.toString() === orgId.toString()
  );

  console.log(org);

  if (org[0]) {
    const fiscalYear = org[0].fiscalYear.filter(
      fy => fy.year === parseInt(year)
    );
    // TODO Falta controlar en el front para que mande la cuota establecida del usuario
    // TODO Falta calcular en el front los totales pagados
    console.log(fiscalYear);
    return;
  }
  return console.log('error');
};

const User = mongoose.model('User', userSchema);

module.exports = User;
