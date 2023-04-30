import { render, screen } from "@testing-library/react";
import React from "react";

import App from "../src/App";

describe("App", () => {
  it("renders header", () => {
    render(<App />);

    expect(screen.getByText("Snake")).toBeInTheDocument();
  });
});
