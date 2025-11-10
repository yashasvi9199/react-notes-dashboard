import React from "react";
import './index.css';
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/styles.css"

// import TestHook from "./TestHook";
// import TestTheme from "./TestTheme";
// import TestAddNote from "./TestAddNote";
// import TestNoteCard from "./TestNoteCard";

createRoot(document.getElementById("root")).render(<App />);
