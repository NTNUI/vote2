import { AssemblyLobby } from "../pages/AssemblyPage";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi, vitest } from "vitest";
import { BrowserRouter } from "react-router-dom";
import * as ReactRouterDom from "react-router-dom";

// Basic example test
describe("Login test", () => {
  test("Should show text", async () => {
    vi.mock("react-router-dom", async () => {
      const actual = (await vi.importActual(
        "react-router-dom"
      )) as typeof ReactRouterDom;
      return {
        ...actual,
        useLocation: vitest.fn().mockImplementation(() => {
          return {
            state: { pathname: "localhost:3000/lobby", groupName: "Sprint" },
          };
        }),
      };
    });
    render(
      <BrowserRouter>
        <AssemblyLobby
          setCheckedIn={function (checkin: boolean): void {
            throw new Error("Function not implemented.");
          }}
          checkedIn={false}
        />
      </BrowserRouter>
    );
  });
});
