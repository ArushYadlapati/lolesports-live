import React, { useEffect, useState } from "react";
import Navbar from "@/app/menu/navbar";
import Sidebar from "@/app/menu/sidebar";

interface MenuProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Menu component that conditionally renders a Navbar or Sidebar based on the screen size (mobile vs pc).
 * @param isOpen if the sidebar is open
 * @param setIsOpen sets the sidebar's open state
 * @constructor
 */
export default function Menu({ isOpen, setIsOpen }: MenuProps): React.JSX.Element {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Run on client side only
        function handleResize() {
            setIsMobile(window.innerWidth < 768);
        }

        handleResize(); // initialize

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isMobile) {
        return <Sidebar isOpen={ isOpen } setIsOpen={ setIsOpen }/>;
    }
    return <Navbar/>;
}

export function dimClass(isSidebarOpen: boolean): string {
    if (isSidebarOpen) {
        return "opacity-40 pointer-events-none transition-opacity duration-300";
    }
    return "opacity-100 transition-opacity duration-300";
}

export function viewMatchesText() {
    try {

    if (window.innerWidth < 768) {
        return (
            <h1 className="text-3xl pt-5 font-bold pb-10 flex-shrink-0">
                View Matches
            </h1>
        );
    }
    }
    catch (e) {
        return (
            <h1 className="text-5xl pt-10 pl-10 font-bold pb-10 flex-shrink-0">
                View Matches
            </h1>
        );
    }
    return (
        <h1 className="text-5xl pt-10 pl-10 font-bold pb-10 flex-shrink-0">
            View Matches
        </h1>
    );

}

export function isMobile(): boolean {
    try {
        return window.innerWidth < 768;
    }
    catch (e) {
        return false;
    }
}