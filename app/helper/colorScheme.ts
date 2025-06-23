import React, { useState, useEffect } from "react";
import { hasLeague } from "@/app/helper/leagues";

export interface ColorScheme {
    name: string;
    background: string;
    foreground: string;
    buttonColor: string;
}

export const colorSchemes: ColorScheme[] = [
    // TODO: make foreground colors nicer (not white or black)
    { name: "Light", background: "#ffffff", foreground: "#8d8888", buttonColor: "#d2d0d0" },
    { name: "Dark", background: "#0a0a0a", foreground: "#b4b1b1", buttonColor: "#656060" },
    { name: "Red", background: "#af2121", foreground: "#de6e6e", buttonColor: "#ffc1c1" },
    { name: "Orange", background: "#c2410c", foreground: "#f5c29e", buttonColor: "#fb923c" },
    { name: "Yellow", background: "#ca8a04", foreground: "#fce9b0", buttonColor: "#d2bf12" },
    { name: "Lime", background: "#4d7c0f", foreground: "#c8e8a2", buttonColor: "#84cc16" },
    { name: "Green", background: "#065f46", foreground: "#a2e2cf", buttonColor: "#10b981" },
    { name: "Emerald", background: "#065f46", foreground: "#a2e2cf", buttonColor: "#259d5e" },
    { name: "Forest", background: "#013220", foreground: "#9ccbbf", buttonColor: "#2f855a" },
    { name: "Teal", background: "#0d9488", foreground: "#a9e4dc", buttonColor: "#23bba8" },
    { name: "Cyan", background: "#0891b2", foreground: "#abe1f0", buttonColor: "#22d3ee" },
    { name: "Sky Blue", background: "#0284c7", foreground: "#aed7f2", buttonColor: "#38bdf8" },
    { name: "Royal Blue", background: "#1e3a8a", foreground: "#b4bff4", buttonColor: "#4f46e5" },
    { name: "Ocean Blue", background: "#0f2027", foreground: "#adc8e3", buttonColor: "#2563eb" },
    { name: "Purple", background: "#5b21b6", foreground: "#ceb5f5", buttonColor: "#6a3bd5" },
    { name: "Violet", background: "#7c3aed", foreground: "#dbcaf5", buttonColor: "#9774ff" },
    { name: "Indigo", background: "#3730a3", foreground: "#b8c6f4", buttonColor: "#6366f1" },
    { name: "Pueblo Brown", background: "#7c2d12", foreground: "#e0b199", buttonColor: "#ea580c" },
    { name: "Pink", background: "#be185d", foreground: "#f3b3cf", buttonColor: "#ec4899" },
    { name: "Fuchsia Sunset", background: "#ff6e7f", foreground: "#4a148c", buttonColor: "#d946ef" },
];

let globalColorScheme = colorSchemes[1];
let getters: Array<(scheme: ColorScheme) => void> = [];

export function getCurrentColorScheme(): ColorScheme {
    return globalColorScheme;
}

export function setCurrentColorScheme(scheme: ColorScheme) {
    globalColorScheme = scheme;
    applyColorScheme(scheme);
    if (typeof window !== "undefined") {
        localStorage.setItem("colorScheme", JSON.stringify(scheme));
    }

    getters.forEach(accessors => accessors(scheme));
}

function applyColorScheme(scheme: ColorScheme) {
    if (typeof document !== 'undefined') {
        document.documentElement.style.setProperty(
            "--background-color",
            scheme.background
        );
        document.documentElement.style.setProperty(
            "--foreground-color",
            scheme.foreground
        );
    }
}

export function useColorScheme() {
    const [scheme, setScheme] = useState<ColorScheme>(globalColorScheme);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedScheme = localStorage.getItem("colorScheme");
            if (savedScheme) {
                try {
                    const parsed = JSON.parse(savedScheme);
                    globalColorScheme = parsed;
                    setScheme(parsed);
                    applyColorScheme(parsed);
                } catch (e) {
                    // uhhhh rip, it got cooked
                }
            } else {
                applyColorScheme(globalColorScheme);
            }
        }

        const accessor = (newScheme: ColorScheme) => {
            setScheme(newScheme);
        };
        getters.push(accessor);

        return () => {
            getters = getters.filter(listen => listen !== accessor);
        };
    }, []);

    const updateScheme = (newScheme: ColorScheme) => {
        setCurrentColorScheme(newScheme);
    };

    return { scheme, setScheme: updateScheme };
}

export function getButtonStyle(button: any, scheme: ColorScheme): React.CSSProperties {
    const style: React.CSSProperties = {
        backgroundColor: scheme.foreground,
        color: scheme.background,
        borderColor: "transparent",
    };

    if (!button) {
        style.borderColor = scheme.buttonColor;
        style.boxShadow = `0 0 0 4px ${ scheme.buttonColor }`;
    }

    return style;
}

export function getButtonClassName(league: any) {
    let className = "px-6 py-3 rounded-full text-sm sm:text-base transition duration-200 shadow-md"

    if (hasLeague(league)) {
        className += "ring-4 scale-105";
    }

    return className;
}