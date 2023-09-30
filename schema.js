const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tasks: {
    type: [
      {
        name: {
          type: String,
          required: true,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    default: [],
  },
  testResult: {
    type: Number,
  },
});

const Department = mongoose.model('Department', departmentSchema);

module.exports = Department;
