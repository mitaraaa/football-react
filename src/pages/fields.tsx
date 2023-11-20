import { useEffect, useState } from "react";
import { Navbar } from "../components";

import { Link } from "@tanstack/react-router";
import "./styles/fields.scss";

const style: { [key: string]: string } = {
    height: "unset",
    display: "block",
    flexDirection: "unset",
    justifyContent: "unset",
    alignItems: "unset",
};

interface FieldEntryProps {
    id: number;
    name: string;
    location: string;
    image: string;
    price: number;
}

const FieldEntry = ({ id, name, location, image, price }: FieldEntryProps) => {
    return (
        <Link
            to="/fields/$fieldId"
            params={{ fieldId: id.toString() }}
            className="field"
        >
            <img src={image} />
            <section>
                <div className="info">
                    <h3>{name}</h3>
                    <div className="location">
                        <span className="material-symbols-outlined">
                            location_on
                        </span>
                        <span className="location-text">{location}</span>
                    </div>
                </div>
                <span className="right">
                    <span className="price">{price}₸</span>
                    per hour
                </span>
            </section>
        </Link>
    );
};

const Fields = () => {
    for (const key in style) {
        if (style.hasOwnProperty(key)) {
            (document.getElementById("root")!.style as any)[key] = style[key];
        }
    }

    const [name, setName] = useState<string>("");
    const [fields, setFields] = useState<FieldEntryProps[]>([]);

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

        fetch(`${import.meta.env.VITE_API_URL}/fields`, {
            method: "GET",
        }).then((response) => {
            if (response.status === 200) {
                response.json().then((data) => {
                    setFields(data);
                });
            }
        });
    }, []);

    return (
        <>
            <Navbar name={name} style={{ position: "sticky" }} />
            <main>
                <h2>Fields</h2>
                <div className="fields">
                    {fields.map((field) => (
                        <FieldEntry
                            key={field.id}
                            id={field.id}
                            name={field.name}
                            image={field.image}
                            location={field.location}
                            price={field.price}
                        />
                    ))}
                </div>
            </main>
        </>
    );
};

export default Fields;
