import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProfileHeader } from "@/features/profile/components/ProfileHeader";

// プロップスのモック
const defaultProps = {
  displayName: "テストユーザー",
  bio: "",
  location: "",
  websiteUrl: "",
  backgroundImageUrl: "",
  avatarImageUrl: "",
  isProfileEmpty: false,
  hasCustomBackground: false,
  hasCustomAvatar: false,
  userId: "user123",
  slug: "test-user",
  portfolioVisibility: "public" as const,
};

describe("ProfileHeader", () => {
  it("renders display name correctly", () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "テストユーザー",
    );
  });

  it('shows placeholder message when displayName is "ユーザー"', () => {
    render(<ProfileHeader {...defaultProps} displayName="ユーザー" />);
    expect(screen.getByText("表示名を設定してください")).toBeInTheDocument();
  });
});
