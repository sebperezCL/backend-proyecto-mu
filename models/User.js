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
              id: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
              },
              amount: Number,
              description: String,
            },
            payment: [
              {
                date: { type: String, required: true },
                amount: { type: Number, required: true },
                paymentMethod: { type: String, required: true },
                bank: String,
                checkNumber: String,
                message: String,
                dueDate: String, // Sólo si paga con cheque es necesario
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

userSchema.methods.setPayment = function (data, org, paymentId) {
  const { year, quotaYear } = data;

  // Busca dentro del usuario si es que tiene la organización asignada
  // y el año fiscal con algún pago realizado
  const userOrg = this.organizations.find(
    o => o._id.toString() === org._id.toString()
  );

  if (userOrg) {
    const fiscalYear = userOrg.fiscalYear.find(
      fy => fy.year === parseInt(year)
    );

    // Obtiene la cuota asignada desde el objeto Org, para asignarla al usuario
    const quota = org.fiscalYear
      .find(fy => fy.year === parseInt(year))
      ?.feePerYear.find(fpy => fpy._id.toString() === quotaYear);

    if (!fiscalYear) {
      // Inserta un nuevo año fiscal, el usuario no registraba pagos previos
      return userOrg.fiscalYear.push(formatFYObject(data, quota, paymentId));
    }

    // El usuario registra pagos previos

    // Primero se revisa si está cambiando la cuota anual asignada
    if (fiscalYear.feePerYear.id.toString() !== quotaYear) {
      fiscalYear.feePerYear.id = quota._id;
      fiscalYear.feePerYear.amount = quota.amount;
      fiscalYear.feePerYear.description = quota.description;
    }

    // Luego inserta un nuevo pago
    return fiscalYear.payment.push(formatPaymentObject(data, paymentId));
  }
};

const formatFYObject = (data, quota, paymentId) => {
  const {
    year,
    amount,
    desc,
    date,
    dueDate,
    bank,
    checkNumber,
    paymentMethod,
  } = data;

  return {
    year: year,
    exempt: false,
    feePerYear: {
      id: quota._id,
      amount: quota.amount,
      description: quota.description,
    },
    payment: [
      {
        _id: paymentId,
        date: date,
        amount: amount,
        paymentMethod: paymentMethod,
        bank: bank,
        checkNumber: checkNumber,
        message: desc,
        dueDate: dueDate,
      },
    ],
  };
};

const formatPaymentObject = (data, paymentId) => {
  const {
    amount,
    desc,
    date,
    dueDate,
    bank,
    checkNumber,
    paymentMethod,
  } = data;

  return {
    _id: paymentId,
    date: date,
    amount: amount,
    paymentMethod: paymentMethod,
    bank: bank,
    checkNumber: checkNumber,
    message: desc,
    dueDate: dueDate,
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
