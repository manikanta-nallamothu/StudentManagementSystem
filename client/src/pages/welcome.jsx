
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  return (
    <main className="welcome-page">
      <div className="welcome-card">
        <p className="welcome-label">Welcome</p>

        <h1>Student Management System</h1>

        <p className="welcome-description">
          Manage student records easily in one place.
        </p>

        <div className="welcome-actions">
          <button onClick={() => navigate("/dashboard")}>
            Login
          </button>

          <button
            className="secondary-button"
            onClick={() => navigate("/register")}
          >
            Create Account
          </button>
        </div>
      </div>
    </main>
  );
}

export default Welcome;
