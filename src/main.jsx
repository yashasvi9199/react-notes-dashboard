import React from "react";
import { createRoot } from "react-dom/client";
import TestHook from "./TestHook";
import { create } from "framer-motion/m";

createRoot(document.getElementById("root")).render(<TestHook />);