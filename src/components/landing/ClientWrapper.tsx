"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useScrollProgress } from "@/hooks";

function ScrollProgressBar() {
    const [mounted, setMounted] = useState(false);
    const scrollProgress = useScrollProgress();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none">
            <div
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${scrollProgress}%` }}
            />
        </div>
    );
}

export function ClientWrapper() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient && !loading && user) {
            router.push("/profile?tab=profile");
        }
    }, [isClient, user, loading, router]);

    return <ScrollProgressBar />;
}
