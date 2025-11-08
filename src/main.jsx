import React from "react";
import { createRoot } from "react-dom/client";
import TestHook from "./TestHook";
import TestTheme from "./TestTheme";

createRoot(document.getElementById("root")).render(<TestTheme />);