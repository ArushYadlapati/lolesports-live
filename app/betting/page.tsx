"use client";

import Image from "next/image";
import { useColorScheme } from "@/app/helper/colorScheme";
import React, {JSX, useState} from "react";
import Menu from "@/app/menu/menu";

/**
 * Betting disclaimer page for the LoL Live app.
 * Provides information about the betting system used in the app.
 *
 * @returns { JSX.Element } The Betting page component.
 */
export default function Betting(): JSX.Element {
    const { scheme } = useColorScheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <main className="flex flex-col min-h-screen px-4 py-3" style={{ backgroundColor: scheme.background, color: scheme.foreground }}>
            <Menu isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="flex flex-col md:flex-row justify-between items-start mt-12 gap-12 pl-10 pt-7">
                <div className="flex-1">
                    <h1 className="text-5xl font-bold mb-6">
                        Betting Disclaimer
                    </h1>

                    <p className="text-lg leading-relaxed mb-10 max-w-xl">
                        The betting system uses an unaffiliated (meaning that I don't make any commissions) betting website called <a href="https://www.bet365.com/" className="underline { scheme.foreground }" target="_blank"> bet365</a>.
                        Specifically, it uses the <a href="https://www.co.bet365.com/#/AC/B151/C1/D50/E3/F163/" className="underline { scheme.foreground }" target="_blank"> League of Legends section</a> of their website. It is a match betting website
                        that allows you to bet with REAL MONEY on that League of Legends esports match.
                    </p>

                    <p className="text-lg leading-relaxed mb-10 max-w-xl">
                        I do <strong>NOT</strong> recommend gambling with REAL MONEY. Betting on any form of Esports is a form of gambling.
                        I added this because adding my own betting system is way harder, and I don't want to deal with a login system and a database.
                        Thank you for understanding.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end pr-50 pt-15">
                    <Image src="/bet365.webp" alt="bet365 Logo" width={ 400 } height={ 400 } className="drop-shadow-lg"/>
                    <p className="text-lg leading-relaxed mt-4 max-w-[400px] text-center md:text-center pt-5">
                        bet365 was chosen because it was a simple website that allowed me to get the link without too much work.
                        It didn’t have an API however, so that made getting the information a bit tricky (but still possible).
                    </p>
                </div>
            </div>
        </main>
    );
}
