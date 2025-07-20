import { useState } from "react";
import "./ExpenseTracker.css";
import "./Login.css";
import { useNavigate } from "react-router-dom";
const API = process.env.REACT_APP_API_BASE_URL;

function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            // Replace with your actual login API endpoint and logic
            const res = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                const data = await res.json();
                // Save token or user info as needed
                // if (onLogin) onLogin(data);
                navigate("/");
            } else {
                setError("Invalid username or password");
            }
        } catch (err) {
            setError("Login failed");
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="login-logo-wrap">
                    <img
                        src={require("./../../src/logo_expensetracker.png")}
                        alt="Expense Tracker Logo"
                        className="login-logo"
                    />
                </div>
                <h2 className="login-title">Login</h2>
                <input
                    className="login-input"
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
                <input
                    className="login-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
                {error && <div className="login-error">{error}</div>}
                <button
                    className="login-btn"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;
