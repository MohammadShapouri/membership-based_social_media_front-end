import React, { useContext, useState } from 'react'
import { toast } from "react-toastify";

import ThemeButton from '../ThemeButton/ThemeButton'
import TextBody from '../Text/body'
import TextTitle from '../Text/title'
import AppLogo from '../../components/icons/AppLogo';
import Button from '../Button/Button'

import { UserContext } from "../../context/UserContext";
import { client } from '../../utils'

function Register({ setAuth }) {
    const [fullName, setFullName] = useState("name")
    const [username, setUsername] = useState("uname")
    const [email, setEmail] = useState("something@gmail.com")
    const [password, setPassword] = useState(">3kUL3SpfSp>QZp")
    const [repeatPassword, setRepeatPassword] = useState(">3kUL3SpfSp>QZp")
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e) => {
        e.preventDefault()

        if (!fullName || !email || !username || !password || !repeatPassword) {
            return toast.error("You need to fill in all the fields");
        }
        // Username validation (only letters, numbers, underscores, and dots)
        const usernameRegex = /^[\w.]+$/
        console.log(username);
        if (!usernameRegex.test(username)) {
            return toast.error("Username can only contain letters, numbers, underscores, and dots.");
        }
        if (password !== repeatPassword) {
            return toast.error("Passwords do not match");
        }
        const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_+\=\-<>]{8,}$/;
        if (!passwordRegex.test(password)) {
        return toast.error(
            "Password must be at least 8 characters and can contain letters, numbers, and !@#$%^&*()_+=-<>"
        );
        }

        const body = {
            full_name: fullName,
            username: username,
            email: email,
            password: password,
            confirm_password: repeatPassword,
        };

        setLoading(true);
        try {
            // Create user account
            const response = await client("/api/v1/users/", { method: "POST", body });

            // Show verification message if backend sent it
            toast.success("Account created successfully! Please check your email for verification link.");

            // Reset form
            setFullName('');
            setUsername('');
            setEmail('');
            setPassword('');
            setRepeatPassword('');
        } catch (err) {
            console.log(err)
            // Backend returns { username, email, password }
            if (err.username || err.email || err.password || err.full_name || err.confirm_password) {
                setErrors(err);  // store the whole error object
            }
            toast.error("Registration failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <form onSubmit={handleRegister} >
                <div className="auth-page__logo">
                    <Button icon><AppLogo /></Button>
                </div>
                <TextTitle title style={{ fontSize: "23px", marginBottom: "5px" }}>Social Media</TextTitle>

                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ color: "black", borderRadius: "5px" }}
                    />
                    {errors.full_name && (
                        <span style={{ color: "red", fontSize: "12px" }}>{errors.full_name}</span>
                    )}
                </div> 
                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ color: "black", borderRadius: "5px" }}
                    />
                    {errors.username && (
                        <span style={{ color: "red", fontSize: "12px" }}>{errors.username}</span>
                    )}
                </div>
                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ color: "black", borderRadius: "5px" }}
                    />
                    {errors.email && (
                        <span style={{ color: "red", fontSize: "12px" }}>{errors.email}</span>
                    )}
                </div>
                <div className="form-control">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ color: "black", borderRadius: "5px" }}
                    />
                    {errors.password && (
                        <span style={{ color: "red", fontSize: "12px" }}>{errors.password}</span>
                    )}
                </div>
                <div className="form-control" style={{ marginBottom: "15px" }}>
                    <input
                        type="password"
                        placeholder="Repeat Password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        style={{ color: "black", borderRadius: "5px" }}
                    />
                    {errors.repeat_password && (
                        <span style={{ color: "red", fontSize: "12px" }}>{errors.repeat_password}</span>
                    )}
                </div>

                <ThemeButton full size="large" type="submit">
                    {loading ? "Signing up..." : "Sign up"}
                </ThemeButton>
                <div style={{ margin: "5px" }}>
                    <TextBody bold>or</TextBody>
                </div>
                <ThemeButton full size="large" primary type="button" onClick={setAuth}>
                    Login
                </ThemeButton>
            </form>
        </>
    )
}

export default Register
