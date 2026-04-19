import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { resolveBasePath } from "../app/basePath";
import { TestReportPage } from "../pages/TestReportPage";

describe("TestReportPage", () => {
  it("レポートページの見出しとリンクが表示される", () => {
    render(
      <MemoryRouter>
        <TestReportPage />
      </MemoryRouter>
    );

    expect(screen.getByText("E2E テストレポート")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "最新のテストレポートを開く" })).toBeInTheDocument();
  });

  it("レポートリンクが /playwright-report/index.html を指す", () => {
    render(
      <MemoryRouter>
        <TestReportPage />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: "最新のテストレポートを開く" });
    expect(link).toHaveAttribute(
      "href",
      resolveBasePath(import.meta.env.BASE_URL, "playwright-report/index.html")
    );
  });
});
