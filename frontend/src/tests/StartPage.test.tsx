import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { MantineProvider } from "@mantine/core";
import colors from "../utils/theme";
import { BrowserRouter } from "react-router-dom";
import { Groups } from "../components/Groups";
import { checkedInState } from "../utils/Context";
import React from "react";
import { act } from "react-dom/test-utils";

describe("Startpage test", () => {
  const setStateMock = vi.fn();
  const useStateMock: any = (useState: any) => [useState, setStateMock];
  vi.spyOn(React, "useState").mockImplementation(useStateMock);
  expect(setStateMock).toHaveBeenCalledTimes(0);

  const value = {
    checkedIn: false,
    setCheckedIn: setStateMock,
    groupSlug: "sprint",
    setGroupSlug: setStateMock,
    groupName: "Sprint",
    setGroupName: setStateMock,
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });
  test("Test page loading", async () => {
    render(
      <checkedInState.Provider value={value}>
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
            <Groups />
          </MantineProvider>
        </BrowserRouter>
      </checkedInState.Provider>
    );
    expect(screen.getByTestId("LoaderIcon")).toBeDefined();
    await act(async () => {
      await Promise.resolve(Groups);
    });

    expect(screen.getByText("Hello Ola!")).toBeDefined();
  });

  test("Test server call", async () => {
    render(
      <checkedInState.Provider value={value}>
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
            <Groups />
          </MantineProvider>
        </BrowserRouter>
      </checkedInState.Provider>
    );
    await act(async () => {
      await Promise.resolve(Groups);
    });

    expect(screen.getByText("Hello Ola!")).toBeDefined();
    expect(screen.getByText("SPRINT")).toBeDefined();
    expect(screen.getByText("DANS")).toBeDefined();
  });
  test("Find Organizer button", async () => {
    render(
      <checkedInState.Provider value={value}>
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
            <Groups />
          </MantineProvider>
        </BrowserRouter>
      </checkedInState.Provider>
    );
    await act(async () => {
      await Promise.resolve(Groups);
    });

    expect(screen.getAllByTestId("organizer")).toBeDefined();
  });
});
