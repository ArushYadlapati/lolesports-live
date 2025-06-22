import Navbar from "@/app/navbar";

export default function BettingPage() {
    return (
        <main className="flex flex-col items-center justify-top min-h-screen p-8">
            <Navbar/>
            <h1 className="text-3xl font-bold mb-4">
                Betting Disclaimer
            </h1>
            <p className="max-w-xl text-center">
                text goes here
            </p>
        </main>
    );
}
