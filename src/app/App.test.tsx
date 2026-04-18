import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { HomePage } from "../pages/HomePage";

describe("HomePage", () => {
  it("renders the initial release hero and hobby link", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText("初回リリース")).toBeInTheDocument();
    expect(screen.getByText("ランニング")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "趣味一覧を見る" })).toBeInTheDocument();
  });
});
