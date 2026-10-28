
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://student-management-api-dsyj.onrender.com/api/students";

function Dashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchStudents(searchText = "") {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(API_URL, {
        params: { search: searchText },
      });

      setStudents(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not load students."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStudents("");
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchStudents(search);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete student."
      );
    }
  }

  const totalCourses = new Set(
    students.map((student) => student.course?.trim().toLowerCase())
      .filter(Boolean)
  ).size;

  return (    
<main className="dashboard">
  <header className="app-title-header">
    <div className="app-title-icon">🎓</div>
    <div className="app-title-text">
      <h1>Student Management System</h1>
    </div>
  </header>

  <header className="dashboard-header">
    <h2>Dashboard</h2>
  </header>

      <section className="stats-container">
        <div className="stat-card">
          <h2>Total Students</h2>
          <p>{students.length}</p>
        </div>

        <div className="stat-card">
          <h2>Courses</h2>
          <p>{totalCourses}</p>
        </div>
      </section>

      <div className="dashboard-actions">
        <button onClick={() => navigate("/register")}>
          + Add Student
        </button>
      </div>

      <section className="dashboard-table-section">
        <h2>All Students</h2>

        <form
          className="search-form"
          onSubmit={(event) => {
            event.preventDefault();
            fetchStudents(search);
          }}
        >
          <input
            type="search"
            placeholder="Search students by name, email, phone, or course"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <button type="submit">Search</button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setSearch("");
              fetchStudents("");
            }}
          >
            Clear
          </button>
        </form>

        {error && <p className="error">{error}</p>}
        {loading && <p>Loading students...</p>}

        {!loading && !error && students.length === 0 && (
          <p>No students found.</p>
        )}

        {!loading && students.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Course</th>
                  <th>Gender</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>{student.course}</td>
                    <td>{student.gender || "—"}</td>
                    <td>
                      <button
                        onClick={() =>
                          navigate("/register", {
                            state: { student },
                          })
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default Dashboard;
