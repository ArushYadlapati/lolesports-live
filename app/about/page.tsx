import Navbar from "@/app/navbar";

export default function AboutPage() {
    return (
        <main className="flex flex-col items-center justify-top min-h-screen p-8">
            <Navbar/>
            <h1 className="text-3xl font-bold mb-4">
                About
            </h1>
            <p className="max-w-xl text-center">
                text goes here
            </p>
        </main>
    );
}
