import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import logo from "../assets/logo_alt.svg";
import { Modal } from "../components";
import "./styles/login.scss";

const style: { [key: string]: string } = {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
};

const Login = () => {
    for (const key in style) {
        if (style.hasOwnProperty(key)) {
            (document.getElementById("root")!.style as any)[key] = style[key];
        }
    }

    const navigate = useNavigate();

    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorVisible, setErrorVisible] = useState<boolean>(false);
    const [animate, setAnimate] = useState<boolean>(false);

    const [errorMessage, setErrorMessage] = useState<string>(
        "Error occured. Please try again later."
    );

    const login = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/users/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
                credentials: "include",
                mode: "cors",
            }
        );

        if (response.status === 200) {
            navigate({ from: "/login", to: "/fields" });
        } else {
            const res = await response.json();
            setErrorMessage(res.detail ?? "Invalid username or password.");
            setErrorVisible(true);
        }
    };

    return (
        <>
            <div className="top">
                <Link to="/" className="back">
                    <span className="material-symbols-outlined">
                        chevron_left
                    </span>
                    Back to main page
                </Link>
            </div>
            <section className="login">
                <img src={logo} />
                <header>
                    <h2>Sign in</h2>
                    <span>to continue with Fieldfinder</span>
                </header>
                <div className="form">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") login();
                        }}
                    />
                </div>
                <div className="actions">
                    <button onClick={login}>Continue</button>
                    <span>
                        Don't have an account? Register{" "}
                        <Link to="/signup">here</Link>.
                    </span>
                </div>
            </section>
            <Modal
                {...{
                    message: errorMessage,
                    animate,
                    visible: errorVisible,
                    setAnimate,
                    setVisible: setErrorVisible,
                }}
            />
        </>
    );
};

export default Login;
