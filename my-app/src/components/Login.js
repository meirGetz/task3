// Login.js
import React, { useState } from 'react';
import { auth } from '../firebase'; // אם קובץ firebase נמצא בתיקיית src
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link } from 'react-router-dom'; // לייבוא רכיב הקישור

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Login successful!");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
            </form>
            <div className="register-link">
                <p>Don't have an account?</p>
                <Link to="/register" className="register-button">Register</Link>
            </div>
        </div>
    );
}

export default Login;
