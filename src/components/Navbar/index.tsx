import "./style.scss";

import { Link } from "@tanstack/react-router";
import logo from "../../assets/logo.svg";

const Navbar = ({ name, style }: NavbarProps) => {
    const logout = async () => {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/users/logout`,
            {
                method: "POST",
                credentials: "include",
                mode: "cors",
            }
        );

        if (response.status === 200) {
            window.location.reload();
        }
    };

    const renderButtons = () => {
        return (
            <section className="buttons">
                <Link to="/">
                    <span className="material-symbols-outlined">add</span>
                    Host Now
                </Link>
                <Link to="/login">
                    <span className="material-symbols-outlined">person</span>
                    Login
                </Link>
            </section>
        );
    };

    const renderUser = () => {
        return (
            <section className="buttons">
                <div className="user">
                    <span className="material-symbols-outlined">person</span>
                    {name}
                </div>
                <button onClick={logout}>
                    <span className="material-symbols-outlined">logout</span>
                </button>
            </section>
        );
    };

    return (
        <nav style={style}>
            <Link to="/" className="logo">
                <img src={logo} alt="logo" />
                Fieldfinder
            </Link>
            {name ? renderUser() : renderButtons()}
        </nav>
    );
};

interface NavbarProps {
    name?: string;
    style?: { [key: string]: string };
}

export default Navbar;
