import Navbar from "@/app/navbar";

export default function AboutPage() {
    return (
        <main className="flex flex-col items-center justify-top min-h-screen px-4 py-3">
            <Navbar/>
            <div className="flex-shrink-0 px-2">
                <h1 className="text-3xl font-bold mb-4 px-2">
                    About
                </h1>
                <p className="max-w-xl text-center">
                    text goes here
                </p>
            </div>
        </main>
    );
}
