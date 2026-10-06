import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function Toast({ toast, onClose }) {
    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [toast, onClose]);

    if (!toast) return null;
    const isError = toast.type === "error";

    return (
        <div
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm
        ${isError ? "bg-rose-600" : "bg-emerald-600"}`}
        >
            {isError ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {toast.message}
        </div>
    );
}