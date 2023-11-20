import { Link } from "@tanstack/react-router";
import { Navbar } from "../components";
import "./styles/home.scss";

import { useEffect, useState } from "react";
import centres from "../assets/centres.png";
import clubs from "../assets/clubs.png";
import councils from "../assets/councils.png";
import schools from "../assets/schools.png";

interface ToolProps {
    name: string;
    description: string;
    icon: string;
}

const Tool = ({ name, description, icon }: ToolProps) => {
    return (
        <div className="tool">
            <h3>
                <span className="material-symbols-outlined">{icon}</span>
                {name}
            </h3>
            <p>{description}</p>
        </div>
    );
};

const style: { [key: string]: string } = {
    height: "unset",
    display: "block",
    flexDirection: "unset",
    justifyContent: "unset",
    alignItems: "unset",
};

const Home = () => {
    for (const key in style) {
        if (style.hasOwnProperty(key)) {
            (document.getElementById("root")!.style as any)[key] = style[key];
        }
    }

    const [name, setName] = useState<string>("");

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/users/profile`, {
            method: "GET",
            credentials: "include",
            mode: "cors",
        }).then((response) => {
            if (response.status === 200) {
                response
                    .json()
                    .then((data) => {
                        setName(data.name);
                    })
                    .catch(() => {
                        setName("");
                    });
            }
        });
    }, []);

    return (
        <>
            <Navbar name={name} style={{ position: "fixed" }} />
            <header>
                <h1>
                    <span className="highlighted">Field</span> booking
                </h1>
                <h3>
                    Kazakhstan's first online solution for football field
                    booking.
                </h3>
                <section className="buttons">
                    <Link to="/fields">
                        {name ? "Browse fields" : "Get started"}
                    </Link>
                    {!name && (
                        <Link to="/signup" className="outlined">
                            Create new account
                        </Link>
                    )}
                </section>
            </header>
            <section className="clients">
                <h2>Our clients</h2>
                <div className="cards">
                    <Link to="/" className="card">
                        <img src={councils} alt="logo" />
                        <h3>
                            Councils
                            <span className="material-symbols-outlined">
                                arrow_outward
                            </span>
                        </h3>
                    </Link>
                    <Link to="/" className="card">
                        <img src={clubs} alt="logo" />
                        <h3>
                            Clubs
                            <span className="material-symbols-outlined">
                                arrow_outward
                            </span>
                        </h3>
                    </Link>
                    <Link to="/" className="card">
                        <img src={schools} alt="logo" />
                        <h3>
                            Schools
                            <span className="material-symbols-outlined">
                                arrow_outward
                            </span>
                        </h3>
                    </Link>
                    <Link to="/" className="card">
                        <img src={centres} alt="logo" />
                        <h3>
                            Commercial Centres
                            <span className="material-symbols-outlined">
                                arrow_outward
                            </span>
                        </h3>
                    </Link>
                </div>
                <p>
                    Fieldfinder software serves as the trusted choice for sports
                    clubs, schools, councils, commercial hubs, and sporting
                    bodies in their sports facility management. We offer a
                    seamless solution to streamline all aspects of booking and
                    payment procedures.
                </p>
            </section>
            <section className="features">
                <h2>Tools to get job done</h2>
                <div className="tools">
                    <Tool
                        icon="manage_search"
                        name="Manage bookings"
                        description="Manage bookings and payments with our easy-to-use
                            software."
                    />
                    <Tool
                        icon="manage_search"
                        name="Multiplatform"
                        description="Any device, anytime, anywhere access for grounds teams and other staff."
                    />
                    <Tool
                        icon="manage_search"
                        name="Book 24/7"
                        description="Round the clock online booking so no need to have someone constantly “on call”."
                    />
                    <Tool
                        icon="manage_search"
                        name="Offline booking"
                        description="Designed for managing phone, email, and in-person reservations."
                    />
                    <Tool
                        icon="manage_search"
                        name="Digital payment"
                        description="We ensure the highest level of transaction security, with full PCI compliance, and support a variety of 25+ payment methods including Card, Kaspi Pay, Google Pay, Apple Pay, Invoicing, and more."
                    />
                </div>
                <Link to="/" className="button">
                    Host a facility
                </Link>
            </section>
            <section className="pricing">
                <h2>No-tricks pricing</h2>
                <p>
                    Whether you are a grassroots sports club or an international
                    multi-department organisation, we have open and honest
                    pricing for your every need.
                </p>
                <div className="badges">
                    <div className="badge">
                        <span className="material-symbols-outlined">
                            newspaper
                        </span>
                        No hidden charges
                    </div>
                    <div className="badge">
                        <span className="material-symbols-outlined">sell</span>
                        No commission
                    </div>
                    <div className="badge">
                        <span className="material-symbols-outlined">
                            storefront
                        </span>
                        No additional setup costs
                    </div>
                    <div className="badge">
                        <span className="material-symbols-outlined">block</span>
                        Cancel anytime with no cancellation fees
                    </div>
                </div>
                <h3>Our plans</h3>
                <div className="plans">
                    <div className="plan">
                        <h4>Free</h4>
                        <p>
                            A simple listing of your facility, accessible to our
                            web visitors.
                        </p>
                        <span className="price">
                            <span className="big">0$</span>per month
                        </span>
                        <Link to="/" className="button">
                            Get started
                        </Link>
                    </div>
                    <div className="plan">
                        <h4>Standard</h4>
                        <p>
                            A simple listing of your facility, accessible to our
                            web visitors.
                        </p>
                        <span className="price">
                            <span className="big">10$</span>per month
                        </span>
                        <Link to="/" className="button" disabled>
                            Get started
                        </Link>
                    </div>
                    <div className="plan">
                        <h4>Premium</h4>
                        <p>
                            A simple listing of your facility, accessible to our
                            web visitors.
                        </p>
                        <span className="price">
                            <span className="big">20$</span>per month
                        </span>
                        <Link to="/" className="button" disabled>
                            Get started
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
