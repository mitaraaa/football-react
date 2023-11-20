import { RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";
import { router } from "./router";

import github from "./assets/github.svg";
import "./globals.scss";

import "material-symbols";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
        <footer>
            <span>Grow Enters LLP // 2023</span>
            <a href="https://github.com/mitaraaa">
                <img src={github} alt="github" />
                GIthub
            </a>
        </footer>
    </React.StrictMode>
);
