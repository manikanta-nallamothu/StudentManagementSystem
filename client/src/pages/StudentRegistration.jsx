
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://student-management-api-dsyj.onrender.com/api/students";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  course: "",
  gender: "",
};

function StudentRegistration() {
  const navigate = useNavigate();
  const location = useLocation();
  const student = location.state?.student;

  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        course: student.course || "",
        gender: student.gender || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [student]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.course.trim()
    ) {
      setError("Please fill in name, email, phone, and course.");
      return;
    }

    try {
      const studentData = {
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        course: form.course.trim(),
      };

      if (student?._id) {
        await axios.put(`${API_URL}/${student._id}`, studentData);
        setMessage("Student updated successfully!");
      } else {
        await axios.post(API_URL, studentData);
        setMessage("Student registered successfully!");
      }

      setForm(emptyForm);

      // Return to the dashboard after saving.
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to save student."
      );
    }
  }

  return (
    <main className="registration-page">
      <section className="registration-card">
        <h2>{student ? "Edit Student" : "Student Registration Form"}</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />

          <label htmlFor="course">Course</label>
          <input
            id="course"
            name="course"
            value={form.course}
            onChange={handleChange}
            placeholder="Enter your course"
            required
          />

          <label>Gender</label>
          <div className="gender-options">
            {["male", "female", "other"].map((gender) => (
              <label key={gender}>
                <input
                  type="radio"
                  name="gender"
                  value={gender}
                  checked={form.gender === gender}
                  onChange={handleChange}
                />
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </label>
            ))}
          </div>

          <div className="registration-actions">
            <button type="submit">
              {student ? "Update Student" : "Register Student"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </form>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </section>
    </main>
  );
}

export default StudentRegistration;
