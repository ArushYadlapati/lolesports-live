import React from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { colorSchemes, useColorScheme } from "@/app/helper/colorScheme";
import Link from "next/link";

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch <React.SetStateAction<boolean>>;
}

/**
 * Sidebar that replaces the navbar for mobile devices.
 * @param isOpen if the sidebar is open
 * @param setIsOpen sets the sidebar's open state
 * @constructor
 */
export default function Sidebar({ isOpen, setIsOpen }: SidebarProps): React.JSX.Element {
    const { scheme, setScheme } = useColorScheme();
    const pathName = usePathname();

    const handleSchemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName: string = event.target.value;
        const selectedScheme = colorSchemes.find((s) => s.name === selectedName);
        if (selectedScheme) {
            setScheme(selectedScheme);
        }
    };

    const isBold = (path: string) => (path === pathName ? "font-bold" : "");

    return (
        <div>
            <button className="p-4 z-60 fixed top-4 left-4 bg-transparent" onClick={ () => setIsOpen(!isOpen) }
                aria-label="Toggle menu" aria-expanded={ isOpen }
            >
                { !isOpen ? <Menu size={ 24 } /> : "" }
            </button>

            <nav className={ `fixed top-0 left-0 h-full w-64 z-50 shadow-lg transform transition-transform duration-300 ease-in-out 
                 ${ isOpen ? "translate-x-0" : "-translate-x-full" }` } style={{ backgroundColor: scheme.foreground, color: scheme.background }}
            >
                <div className="flex items-center space-x-3 px-6 py-4 pt-6">
                    <Image src="/favicon-clearbg.png" alt="Logo" width={ 40 } height={ 40 } onClick={ () => setIsOpen(!isOpen) } />
                    <span className="text-lg font-semibold">
                        LoL Esports Live
                    </span>
                </div>

                <div className="flex flex-col space-y-4 px-6 py-2">
                    <Link href="/" className={ `${ isBold("/") } hover:underline` } onClick={() => setIsOpen(false) }>
                        View Matches
                    </Link>

                    <Link href="/about" className={ `${ isBold("/about") } hover:underline` } onClick={ () => setIsOpen(false) }>
                        About
                    </Link>

                    <Link href="/betting" className={ `${ isBold("/betting") } hover:underline` } onClick={ () => setIsOpen(false) }>
                        Betting
                    </Link>

                    <a href="https://github.com/ArushYadlapati/lolesports-live" target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Source Code (GitHub)
                    </a>

                    <select value={ scheme.name } className="p-2 rounded border shadow" onChange={ handleSchemeChange }
                        style={{ backgroundColor: scheme.background, color: scheme.foreground, borderColor: scheme.foreground }}
                    >
                        { colorSchemes.map((color) => (
                            <option key={ color.name } value={ color.name }>
                                { color.name }
                            </option>
                        ))}
                    </select>
                </div>
            </nav>
        </div>
    );
}
