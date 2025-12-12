import { renderHook, act, waitFor } from "@testing-library/react";
import { useFeaturedWorks } from "@/features/profile/hooks/useFeaturedWorks";
import { WorkData } from "@/features/work/types";

// fetchモックの準備
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Supabaseモック
jest.mock("@/lib/supabase", () => ({
    supabase: {
        auth: {
            getSession: jest.fn().mockResolvedValue({
                data: { session: { access_token: "mock-token" } },
            }),
        },
    },
}));

describe("useFeaturedWorks", () => {
    const mockSetSavedWorks = jest.fn();

    const createMockWorks = (): WorkData[] => [
        {
            id: "work-1",
            title: "Featured Work 1",
            is_featured: true,
            featured_order: 1,
        } as WorkData,
        {
            id: "work-2",
            title: "Featured Work 2",
            is_featured: true,
            featured_order: 2,
        } as WorkData,
        {
            id: "work-3",
            title: "Regular Work",
            is_featured: false,
        } as WorkData,
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockFetch.mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    });

    it("correctly separates featured and non-featured works", () => {
        const savedWorks = createMockWorks();

        const { result } = renderHook(() =>
            useFeaturedWorks({
                savedWorks,
                setSavedWorks: mockSetSavedWorks,
            }),
        );

        expect(result.current.featuredWorks).toHaveLength(2);
        expect(result.current.nonFeaturedWorks).toHaveLength(1);
        expect(result.current.featuredWorks[0].id).toBe("work-1");
        expect(result.current.featuredWorks[1].id).toBe("work-2");
        expect(result.current.nonFeaturedWorks[0].id).toBe("work-3");
    });

    it("sorts featured works by featured_order", () => {
        const savedWorks: WorkData[] = [
            { id: "work-a", title: "A", is_featured: true, featured_order: 3 } as WorkData,
            { id: "work-b", title: "B", is_featured: true, featured_order: 1 } as WorkData,
            { id: "work-c", title: "C", is_featured: true, featured_order: 2 } as WorkData,
        ];

        const { result } = renderHook(() =>
            useFeaturedWorks({
                savedWorks,
                setSavedWorks: mockSetSavedWorks,
            }),
        );

        expect(result.current.featuredWorks[0].id).toBe("work-b");
        expect(result.current.featuredWorks[1].id).toBe("work-c");
        expect(result.current.featuredWorks[2].id).toBe("work-a");
    });

    it("initializes with editing mode off", () => {
        const savedWorks = createMockWorks();

        const { result } = renderHook(() =>
            useFeaturedWorks({
                savedWorks,
                setSavedWorks: mockSetSavedWorks,
            }),
        );

        expect(result.current.isEditingFeatured).toBe(false);
        expect(result.current.isUpdating).toBe(false);
    });

    it("toggles editing mode", () => {
        const savedWorks = createMockWorks();

        const { result } = renderHook(() =>
            useFeaturedWorks({
                savedWorks,
                setSavedWorks: mockSetSavedWorks,
            }),
        );

        act(() => {
            result.current.setIsEditingFeatured(true);
        });

        expect(result.current.isEditingFeatured).toBe(true);

        act(() => {
            result.current.setIsEditingFeatured(false);
        });

        expect(result.current.isEditingFeatured).toBe(false);
    });

    it("adds work to featured", async () => {
        const savedWorks = createMockWorks();

        const { result } = renderHook(() =>
            useFeaturedWorks({
                savedWorks,
                setSavedWorks: mockSetSavedWorks,
            }),
        );

        await act(async () => {
            await result.current.addToFeatured("work-3");
        });

        // setSavedWorksが呼ばれたことを確認
        expect(mockSetSavedWorks).toHaveBeenCalled();

        // 更新されたworksの中でwork-3がfeaturedになっていることを確認
        const updatedWorks = mockSetSavedWorks.mock.calls[0][0];
        const work3 = updatedWorks.find((w: WorkData) => w.id === "work-3");
        expect(work3.is_featured).toBe(true);
    });

    it("removes work from featured", async () => {
        const savedWorks = createMockWorks();

        const { result } = renderHook(() =>
            useFeaturedWorks({
                savedWorks,
                setSavedWorks: mockSetSavedWorks,
            }),
        );

        await act(async () => {
            await result.current.removeFromFeatured("work-1");
        });

        expect(mockSetSavedWorks).toHaveBeenCalled();

        const updatedWorks = mockSetSavedWorks.mock.calls[0][0];
        const work1 = updatedWorks.find((w: WorkData) => w.id === "work-1");
        expect(work1.is_featured).toBe(false);
    });

    it("prevents adding more than 3 featured works", async () => {
        const alertMock = jest.spyOn(window, "alert").mockImplementation(() => { });

        const savedWorks: WorkData[] = [
            { id: "w1", title: "1", is_featured: true, featured_order: 1 } as WorkData,
            { id: "w2", title: "2", is_featured: true, featured_order: 2 } as WorkData,
            { id: "w3", title: "3", is_featured: true, featured_order: 3 } as WorkData,
            { id: "w4", title: "4", is_featured: false } as WorkData,
        ];

        const { result } = renderHook(() =>
            useFeaturedWorks({
                savedWorks,
                setSavedWorks: mockSetSavedWorks,
            }),
        );

        await act(async () => {
            await result.current.addToFeatured("w4");
        });

        expect(alertMock).toHaveBeenCalledWith("代表作は最大3つまで設定できます");
        expect(mockSetSavedWorks).not.toHaveBeenCalled();

        alertMock.mockRestore();
    });

    it("saves featured works and exits editing mode", async () => {
        const savedWorks = createMockWorks();

        const { result } = renderHook(() =>
            useFeaturedWorks({
                savedWorks,
                setSavedWorks: mockSetSavedWorks,
            }),
        );

        // 編集モードを開始
        act(() => {
            result.current.setIsEditingFeatured(true);
        });

        expect(result.current.isEditingFeatured).toBe(true);

        // 保存を実行
        await act(async () => {
            await result.current.handleSaveFeatured();
        });

        // 編集モードが終了していることを確認
        await waitFor(() => {
            expect(result.current.isEditingFeatured).toBe(false);
        });
    });
});
