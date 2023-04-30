import { act, render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import GameBoard from "../src/GameBoard";
import { vi } from "vitest";

describe("GameBoard", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("renders a 15x15 grid", () => {
    render(<GameBoard />);

    expect(screen.getAllByRole("gridcell")).toHaveLength(15 * 15);
  });

  it("renders snake after first tick", () => {
    render(<GameBoard />);

    act(() => {
      vi.runOnlyPendingTimers();
    });

    expect(
      screen
        .getAllByRole("gridcell")
        .filter((cell) => cell.className.includes("snakeBox"))
    ).toHaveLength(1);
  });

  it("renders head of snake at row 1 col 1", () => {
    render(<GameBoard />);

    expect(screen.getByLabelText("row 1 col 1").classList).toHaveLength(2);
  });

  describe("Movement", () => {
    it("moves snake one unit to the left when no arrow keys pressed", () => {
      render(<GameBoard />);

      act(() => {
        vi.runOnlyPendingTimers();
      });

      expect(
        screen.getByLabelText("row 1 col 2").className.includes("snakeBox")
      ).toBeTruthy();
    });

    it("moves snake one unit up when up arrow pressed", () => {
      render(<GameBoard />);

      fireEvent.keyDown(window, { key: "ArrowUp" });

      act(() => {
        vi.runOnlyPendingTimers();
      });

      expect(
        screen.getByLabelText("row 0 col 1").className.includes("snakeBox")
      ).toBeTruthy();
    });
  });
});
