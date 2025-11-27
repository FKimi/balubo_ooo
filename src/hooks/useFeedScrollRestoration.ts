import { useEffect, useRef } from 'react';

interface FeedState {
    items: any[];
    nextCursor: string | null;
    hasMore: boolean;
    scrollY: number;
    timestamp: number;
}

const STORAGE_KEY = 'balubo_feed_state';
const EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

export function useFeedScrollRestoration<T>(
    items: T[],
    nextCursor: string | null,
    hasMore: boolean,
    setItems: (_items: T[]) => void,
    setNextCursor: (_cursor: string | null) => void,
    setHasMore: (_hasMore: boolean) => void
) {
    const isRestoring = useRef(false);

    // Save state before unloading or navigating
    useEffect(() => {
        const saveState = () => {
            // Don't save if we are currently restoring or if there are no items
            if (isRestoring.current || items.length === 0) return;

            const state: FeedState = {
                items,
                nextCursor,
                hasMore,
                scrollY: window.scrollY,
                timestamp: Date.now(),
            };
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        };

        window.addEventListener('beforeunload', saveState);

        // Also save on visibility change (e.g. switching tabs or navigating away in SPA)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                saveState();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', saveState);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            // Also save on component unmount
            saveState();
        };
    }, [items, nextCursor, hasMore]);

    // Restore state on mount
    useEffect(() => {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        try {
            const state: FeedState = JSON.parse(saved);
            const now = Date.now();

            // Check expiry
            if (now - state.timestamp > EXPIRY_MS) {
                sessionStorage.removeItem(STORAGE_KEY);
                return;
            }

            isRestoring.current = true;

            // Restore data
            setItems(state.items);
            setNextCursor(state.nextCursor);
            setHasMore(state.hasMore);

            // Restore scroll position after a short delay to allow rendering
            setTimeout(() => {
                window.scrollTo(0, state.scrollY);
                isRestoring.current = false;
            }, 100);

        } catch (e) {
            console.error('Failed to restore feed state', e);
            sessionStorage.removeItem(STORAGE_KEY);
        }
    }, [setItems, setNextCursor, setHasMore]); // Add dependencies

    // Clear storage when manually refreshing (optional, depends on UX preference)
    const clearScrollRestoration = () => {
        sessionStorage.removeItem(STORAGE_KEY);
    };

    return { clearScrollRestoration };
}
