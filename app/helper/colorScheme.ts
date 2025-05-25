import { useState, useEffect } from "react";

export interface ColorScheme {
    name: string;
    background: string;
    foreground: string;
}

export const colorSchemes: ColorScheme[] = [
    { name: "Light", background: "#ffffff", foreground: "#171717" },
    { name: "Dark", background: "#0a0a0a", foreground: "#ededed" },
    { name: "Red", background: "#b91c1c", foreground: "#ffffff" },
    { name: "Orange", background: "#c2410c", foreground: "#ffffff" },
    { name: "Yellow", background: "#ca8a04", foreground: "#ffffff" },
    { name: "Lime", background: "#4d7c0f", foreground: "#ffffff" },
    { name: "Green", background: "#065f46", foreground: "#ffffff" },
    { name: "Emerald", background: "#065f46", foreground: "#ffffff" },
    { name: "Forest", background: "#013220", foreground: "#a8dadc" },
    { name: "Teal", background: "#0d9488", foreground: "#ffffff" },
    { name: "Cyan", background: "#0891b2", foreground: "#ffffff" },
    { name: "Sky Blue", background: "#0284c7", foreground: "#ffffff" },
    { name: "Royal Blue", background: "#1e3a8a", foreground: "#ffffff" },
    { name: "Ocean Blue", background: "#0f2027", foreground: "#a9c9ff" },
    { name: "Purple", background: "#5b21b6", foreground: "#ffffff" },
    { name: "Violet", background: "#7c3aed", foreground: "#ffffff"},
    { name: "Pueblo Brown", background: "#7c2d12", foreground: "#ffffff" },
    { name: "Pink", background: "#be185d", foreground: "#ffffff" },
    { name: "Sunset", background: "#ff6e7f", foreground: "#4a148c" },
];

export function useColorScheme() {
    const [scheme, setScheme] = useState<ColorScheme | null>(null);

    const applyColorScheme = (colorScheme: ColorScheme) => {
        document.documentElement.style.setProperty(
            "--background-color",
            colorScheme.background
        );
        document.documentElement.style.setProperty(
            "--foreground-color",
            colorScheme.foreground
        );
    };

    useEffect(() => {
        const savedScheme = localStorage.getItem("colorScheme");
        if (savedScheme) {
            const parsed = JSON.parse(savedScheme);
            setScheme(parsed);
            applyColorScheme(parsed);
        } else {
            setScheme(colorSchemes[1]);
            applyColorScheme(colorSchemes[1]);
        }
    }, []);

    useEffect(() => {
        if (scheme) {
            localStorage.setItem("colorScheme", JSON.stringify(scheme));
            applyColorScheme(scheme);
        }
    }, [scheme]);

    return { scheme: scheme || colorSchemes[1], setScheme };
}
