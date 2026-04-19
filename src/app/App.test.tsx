import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { HomePage } from "../pages/HomePage";

describe("HomePage", () => {
  it("renders the expanded hero and hobby link", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(screen.getByText("趣味と学びのベース")).toBeInTheDocument();
    expect(screen.getAllByText("ランニング").length).toBeGreaterThan(0);
    expect(screen.getAllByText("DIY").length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "趣味一覧を見る" })).toBeInTheDocument();
  });
});
