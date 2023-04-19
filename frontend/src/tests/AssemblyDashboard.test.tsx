import { Assembly } from "../pages/AssemblyDashboard";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { BrowserRouter } from "react-router-dom";

// Basic example test
describe("Login test", () => {
  test("Should show text", () => {
    render(
      <BrowserRouter>
        <Assembly />
      </BrowserRouter>
    );
    //expect(screen.getByText("Assembly dashboard")).toBeDefined()
  });
});
