import { Assembly } from "../pages/GenforsDashboard";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { UserDataGroupType } from "../types/user";

import * as ReactRouterDom from "react-router-dom";
import { EditAssembly } from "../components/EditAssembly";
import colors from "../utils/theme";
import { MantineProvider } from "@mantine/core";

// Basic example test
describe("Test of AssemblyDashboard", () => {
  test("Should show text", async () => {
    const state: UserDataGroupType = {
      groupName: "Sprint",
      groupSlug: "sprint",
      hasAssembly: true,
      organizer: true,
      hasActiveAssembly: true,
      creator: "1",
    };
    render(
      <BrowserRouter>
        <MantineProvider
          theme={{
            fontFamily: "Poppins, sans-serif",
            colors: colors,
            fontSizes: {
              xs: 10,
              sm: 12,
              md: 14,
              lg: 20,
              xl: 24,
            },
            breakpoints: {
              xs: 500,
              sm: 800,
              md: 1000,
              lg: 1200,
              xl: 1400,
            },
          }}
        >
          <EditAssembly group={state} />
        </MantineProvider>
      </BrowserRouter>
    );
    expect(screen.getByTestId("LoaderIcon")).toBeDefined();

    //Waits for the page to render completely and finish rest-calls
    await act(async () => {
      await Promise.resolve(EditAssembly);
    });
    expect(screen.getByText("Currently 3 participants")).toBeDefined();
    expect(screen.getByText("EDIT SPRINT ASSEMBLY")).toBeDefined();
  });
});
