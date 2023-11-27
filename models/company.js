/* COMPANY DATABSE CONTAIN NAME STUDENT ARRAY OF STUDENT ID AND DATE OF INTERVIEW WITH STATUS*/

const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
    },

    students: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
        },

        date: {
          type: String,
          required:true,
        },

        result: {
          type: String,
          enum: ["Selected", "Not Selected", "On Hold", "Pending"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", CompanySchema);

module.exports = Company;