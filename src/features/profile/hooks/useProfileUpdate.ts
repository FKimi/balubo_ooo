import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Hook for updating profile fields via PATCH request.
 * Returns a function `updateProfileField` that accepts the field name and new value.
 */
export const useProfileUpdate = () => {
    const { user } = useAuth();

    const updateProfileField = useCallback(async (field: string, value: any) => {
        if (!user) {
            throw new Error("User not authenticated");
        }
        const response = await fetch(`/api/profile`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                // Assuming auth token is stored in user.token
                Authorization: `Bearer ${(user as any).token}`,
            },
            body: JSON.stringify({ field, value }),
        });
        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Failed to update profile: ${err}`);
        }
        // Optionally return updated profile data
        return response.json();
    }, [user]);

    return { updateProfileField };
};
