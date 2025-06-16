import React, { useState, useEffect } from "react";
import { hasLeague } from "@/app/helper/leagues";

export interface ColorScheme {
    name: string;
    background: string;
    foreground: string;
    buttonColor: string;
}

export const colorSchemes: ColorScheme[] = [
    // TODO: fix the buttonColors so that they are more visible/different from background colors
    { name: "Light", background: "#ffffff", foreground: "#171717", buttonColor: "#d5e7eb" },
    { name: "Dark", background: "#0a0a0a", foreground: "#ededed", buttonColor: "#3E526E" },
    { name: "Red", background: "#b91c1c", foreground: "#ffffff", buttonColor: "#fca5a5" },
    { name: "Orange", background: "#c2410c", foreground: "#ffffff", buttonColor: "#fb923c" },
    { name: "Yellow", background: "#ca8a04", foreground: "#ffffff", buttonColor: "#fde047" },
    { name: "Lime", background: "#4d7c0f", foreground: "#ffffff", buttonColor: "#84cc16" },
    { name: "Green", background: "#065f46", foreground: "#ffffff", buttonColor: "#10b981" },
    { name: "Emerald", background: "#065f46", foreground: "#ffffff", buttonColor: "#34d399" },
    { name: "Forest", background: "#013220", foreground: "#a8dadc", buttonColor: "#2f855a" },
    { name: "Teal", background: "#0d9488", foreground: "#ffffff", buttonColor: "#2dd4bf" },
    { name: "Cyan", background: "#0891b2", foreground: "#ffffff", buttonColor: "#22d3ee" },
    { name: "Sky Blue", background: "#0284c7", foreground: "#ffffff", buttonColor: "#38bdf8" },
    { name: "Royal Blue", background: "#1e3a8a", foreground: "#ffffff", buttonColor: "#4f46e5" },
    { name: "Ocean Blue", background: "#0f2027", foreground: "#a9c9ff", buttonColor: "#2563eb" },
    { name: "Purple", background: "#5b21b6", foreground: "#ffffff", buttonColor: "#8b5cf6" },
    { name: "Violet", background: "#7c3aed", foreground: "#ffffff", buttonColor: "#a78bfa" },
    { name: "Pueblo Brown", background: "#7c2d12", foreground: "#ffffff", buttonColor: "#ea580c" },
    { name: "Pink", background: "#be185d", foreground: "#ffffff", buttonColor: "#ec4899" },
    { name: "Fuchsia Sunset", background: "#ff6e7f", foreground: "#4a148c", buttonColor: "#d946ef" },
];

let currentColorScheme = colorSchemes[1];

export function getCurrentColorScheme(): ColorScheme {
    return currentColorScheme;
}

export function setCurrentColorScheme(scheme: ColorScheme) {
    currentColorScheme = scheme;
}

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
            try {
                const savedScheme = localStorage.getItem("colorScheme");
                if (savedScheme) {
                    const parsed = JSON.parse(savedScheme);
                    setScheme(parsed);
                    applyColorScheme(parsed);
                }
            } catch (e) {
                setScheme(colorSchemes[1]);
                applyColorScheme(colorSchemes[1]);
            }
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