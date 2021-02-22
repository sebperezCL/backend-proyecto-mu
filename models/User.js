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
    names: {
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
    active: {
      type: Boolean,
      required: true,
      default: false,
    },
    photo: String, // ruta a fotografía del usuario
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
      homePhone: String,
      officePhone: String,
    },
    organizations: [
      {
        name: String,
        orgId: String,
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
                date: Date,
                amount: Number,
                paymentMethod: String,
                bank: String,
                checkNumber: String,
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
