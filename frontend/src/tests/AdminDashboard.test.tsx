import { AdminDashboard } from "../pages/AdminDashboard";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { BrowserRouter } from "react-router-dom";

// Basic example test
describe("Login test", () => {
  test("Should show text", () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
  });
});
