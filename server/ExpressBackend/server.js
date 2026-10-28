
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env")
});

const app = express();

app.use(cors());
app.use(express.json());

// Student schema
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  course: { type: String, required: true, trim: true },
  gender: { type: String, default: "" }
});

const Student = mongoose.model("Student", studentSchema);

// Basic server-side validation
function validateStudent(data) {
  const { name, email, phone, course, gender } = data;

  if (
    typeof name !== "string" || !name.trim() ||
    typeof email !== "string" || !email.trim() ||
    typeof phone !== "string" || !phone.trim() ||
    typeof course !== "string" || !course.trim()
  ) {
    return "Name, email, phone, and course are required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return "Please enter a valid email address.";
  }

  if (!/^\+?[0-9\s()-]{7,20}$/.test(phone.trim())) {
    return "Please enter a valid phone number.";
  }

  if (gender && !["male", "female", "other"].includes(gender)) {
    return "Please select a valid gender.";
  }

  return null;
}

// CREATE: Register a student
app.post("/api/students", async (req, res) => {
  try {
    const error = validateStudent(req.body);
    if (error) return res.status(400).json({ message: error });

    const student = await Student.create({
      ...req.body,
      name: req.body.name.trim(),
      email: req.body.email.trim(),
      phone: req.body.phone.trim(),
      course: req.body.course.trim()
    });

    res.status(201).json({
      message: "Student registered successfully!",
      student
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to register student." });
  }
});

// READ + SEARCH: Get all students or search
app.get("/api/students", async (req, res) => {
  try {
    const search = req.query.search?.trim();
    const filter = {};

    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(safeSearch, "i");

      filter.$or = [
        { name: regex },
        { email: regex },
        { phone: regex },
        { course: regex }
      ];
    }

    const students = await Student.find(filter).sort({ _id: -1 });
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to fetch students." });
  }
});

// UPDATE: Edit a student
app.put("/api/students/:id", async (req, res) => {
  console.log("PUT route reached. Student ID:", req.params.id);
  try {
    const error = validateStudent(req.body);
    if (error) return res.status(400).json({ message: error });

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name.trim(),
        email: req.body.email.trim(),
        phone: req.body.phone.trim(),
        course: req.body.course.trim(),
        gender: req.body.gender || ""
      },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json({ message: "Student updated successfully!", student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to update student." });
  }
});

// DELETE: Remove a student
app.delete("/api/students/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID." });
    }

    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json({ message: "Student deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Unable to delete student." });
  }
});

// Start server only after MongoDB connects
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
