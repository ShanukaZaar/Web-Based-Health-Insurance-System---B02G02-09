import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function HomeButton() {
    return (
        <Link
            to="/"
            title="Back to Home"
            aria-label="Back to Home"
            className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:-translate-y-0.5 hover:bg-emerald-700"
        >
            <Icon name="home" className="h-4 w-4" />
            Home
        </Link>
    );
}