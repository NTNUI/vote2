import { AssemblyLobby } from "../pages/AssemblyPage";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

// Basic example test
describe("Login test", () => {
  test("Should show text", () => {
    render(<AssemblyLobby />);
  });
});