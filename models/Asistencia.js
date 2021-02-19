'use strict';

const mongoose = require('mongoose');

const asistenciaSchema = mongoose.Schema({
  reunionId: String,
  orgId: {
    // Puede corresponder al identificador fiscal
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  fecha: Date,
  porcentajeAsistencia: Number,
  documentoRespaldo: String, // url al documento
  asistentes: [{ userId: String, nombre: String }],
});
