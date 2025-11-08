import React from "react";
import useLocalStorage from "./hooks/useLocalStorage";

export default function TestHook() {
    const [count, setCount] = useLocalStorage("demo_count", 0);

    return (
        <div style={{padding: "20px"}}>
            <h1>Count: {count}</h1>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}

