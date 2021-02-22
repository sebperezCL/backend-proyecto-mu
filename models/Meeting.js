'use strict';

const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
  meetingId: String,
  orgId: {
    // Puede corresponder al identificador fiscal
    type: String,
    index: true,
    unique: true,
    required: true,
  },
  date: Date,
  attendancePercentage: Number,
  meetingMinute: String, // url al documento
  attendance: [{ userId: String, name: String, email: string }],
});
