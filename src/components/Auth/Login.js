import React, { useState, useContext } from 'react';
import { toast } from "react-toastify";
import { useHistory } from 'react-router-dom'
import ThemeButton from '../ThemeButton/ThemeButton'
import TextBody from '../Text/body'
import TextTitle from '../Text/title'
import AppLogo from '../../components/icons/AppLogo';
import Button from '../Button/Button'
import { client } from '../../utils';
import { UserContext } from '../../context/UserContext';

function Login({ setAuth }) {
    const history = useHistory()
    const { setUser } = useContext(UserContext);
    const [username, setUsername] = useState("user1")
    const [password, setPassword] = useState("admin")
    const [loading, setLoading] = useState(false)
    const handleLogin = async (e) => {

        e.preventDefault()

        if (
            !username ||
            !password
        ) {
            return toast.error("You need to fill in all the fields");
        }


        const body = { username: username, password: password };
        setLoading(true);
        try {
            await client("/api/cookie-based-token/", { body });
            const userData = await client("/api/v1/auth/me");
            setUser(userData);
            history.push("/");
        } catch (err) {
            if (err.no_account) {
                toast.error(err.no_account);
            }
            toast.error("Failed Logging in");
        } finally {
            setLoading(false);
        }
        setUsername('');
        setPassword('');
    }

    return (
        <>
            <form onSubmit={handleLogin} >
                <div className="auth-page__logo">
                    <Button icon><AppLogo /></Button>
                </div>
                <TextTitle title style={{ fontSize: "23px", marginBottom: "5px" }}>Social Media</TextTitle>

                <div className="form-control">
                    <input
                        type="text"
                        placeholder="Email/Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ color: "black", borderRadius: "5px" }}
                    />
                </div>
                <div className="form-control" style={{ marginBottom: "15px" }}>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ color: "black", borderRadius: "5px" }}
                    />
                </div>


                <ThemeButton disabled={loading} full size="large" type="submit">
                    {loading ? "Logging in" : "Login"}
                </ThemeButton>
                <div style={{ margin: "5px" }}>
                    <TextBody bold>or</TextBody>
                </div>
                <ThemeButton full size="large" primary type="button" onClick={setAuth}>
                    Signup
                </ThemeButton>
            </form>
        </>
    )
}

export default Login
