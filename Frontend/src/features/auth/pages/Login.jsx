import React, { useCallback, useState } from "react";
import "../auth.form.scss";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();

  const { loading, handleLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      await handleLogin(formData);

      navigate("/");
    },
    [formData, handleLogin, navigate],
  );

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    );
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              name="email"
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button className="button primary-button">Login</button>
        </form>

        <p>
          Don't have an account? <Link to={"/register"}>Register</Link>{" "}
        </p>
      </div>
    </main>
  );
}

export default Login;
