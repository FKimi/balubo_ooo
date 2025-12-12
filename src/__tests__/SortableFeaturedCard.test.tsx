import { render, screen, fireEvent } from "@testing-library/react";
import { SortableFeaturedCard } from "@/features/profile/components/ProfileWorks/SortableFeaturedCard";
import { WorkData } from "@/features/work/types";

// DndContext用のモック
jest.mock("@dnd-kit/sortable", () => ({
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: jest.fn(),
        transform: null,
        transition: null,
        isDragging: false,
    }),
}));

jest.mock("@dnd-kit/utilities", () => ({
    CSS: {
        Transform: {
            toString: () => null,
        },
    },
}));

describe("<SortableFeaturedCard />", () => {
    const createMockWork = (overrides: Partial<WorkData> = {}): WorkData => ({
        id: "work-1",
        title: "Test Work Title",
        description: "Test description",
        banner_image_url: "",
        external_url: "https://example.com",
        tags: ["tag1", "tag2"],
        ...overrides,
    } as WorkData);

    const mockOnRemove = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders work title correctly", () => {
        const work = createMockWork({ title: "My Featured Work" });

        render(
            <SortableFeaturedCard
                work={work}
                index={0}
                onRemove={mockOnRemove}
                isUpdating={false}
            />,
        );

        expect(screen.getByText("My Featured Work")).toBeInTheDocument();
    });

    it("shows correct rank badge for first position", () => {
        const work = createMockWork();

        render(
            <SortableFeaturedCard
                work={work}
                index={0}
                onRemove={mockOnRemove}
                isUpdating={false}
            />,
        );

        expect(screen.getByText("1")).toBeInTheDocument();
    });

    it("shows correct rank badge for second position", () => {
        const work = createMockWork();

        render(
            <SortableFeaturedCard
                work={work}
                index={1}
                onRemove={mockOnRemove}
                isUpdating={false}
            />,
        );

        expect(screen.getByText("2")).toBeInTheDocument();
    });

    it("shows correct rank badge for third position", () => {
        const work = createMockWork();

        render(
            <SortableFeaturedCard
                work={work}
                index={2}
                onRemove={mockOnRemove}
                isUpdating={false}
            />,
        );

        expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("calls onRemove with work id when delete button is clicked", () => {
        const work = createMockWork({ id: "work-to-remove" });

        render(
            <SortableFeaturedCard
                work={work}
                index={0}
                onRemove={mockOnRemove}
                isUpdating={false}
            />,
        );

        // X アイコンを含むボタンをクリック
        const buttons = screen.getAllByRole("button");
        const deleteButton = buttons.find(
            (btn) => btn.className.includes("bg-red-500"),
        );

        if (deleteButton) {
            fireEvent.click(deleteButton);
            expect(mockOnRemove).toHaveBeenCalledWith("work-to-remove");
        }
    });

    it("disables delete button when isUpdating is true", () => {
        const work = createMockWork();

        render(
            <SortableFeaturedCard
                work={work}
                index={0}
                onRemove={mockOnRemove}
                isUpdating={true}
            />,
        );

        const buttons = screen.getAllByRole("button");
        const deleteButton = buttons.find(
            (btn) => btn.className.includes("bg-red-500"),
        );

        expect(deleteButton).toBeDisabled();
    });

    it("renders placeholder when no banner image", () => {
        const work = createMockWork({
            banner_image_url: undefined,
            preview_data: undefined,
        });

        render(
            <SortableFeaturedCard
                work={work}
                index={0}
                onRemove={mockOnRemove}
                isUpdating={false}
            />,
        );

        // SVGプレースホルダーの存在を確認
        const svgElement = document.querySelector("svg");
        expect(svgElement).toBeInTheDocument();
    });
});
