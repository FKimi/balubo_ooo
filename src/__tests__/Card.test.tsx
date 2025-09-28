import { render } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

describe("<Card />", () => {
  it("renders correctly with children", () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Body content</CardContent>
      </Card>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
