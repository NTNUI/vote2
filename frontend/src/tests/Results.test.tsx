import { describe, expect, test, vi } from "vitest";
import { VoteType, OptionType } from "../types/votes";
import { Results } from "../components/Results";
import { render, screen } from "@testing-library/react";
import colors from "../utils/theme";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Accordion, MantineProvider } from "@mantine/core";
import { checkedInState } from "../utils/Context";

describe("Result component test", () => {
  const setStateMock = vi.fn();
  const useStateMock: any = (useState: any) => [useState, setStateMock];
  vi.spyOn(React, "useState").mockImplementation(useStateMock);
  const value = {
    checkedIn: false,
    setCheckedIn: setStateMock,
    groupSlug: "sprint",
    setGroupSlug: setStateMock,
    groupName: "Sprint",
    setGroupName: setStateMock,
  };
  const testOption1: OptionType = {
    _id: "1",
    title: "Test",
    voteCount: 2,
  };
  const testOption2: OptionType = {
    _id: "2",
    title: "Test2",
    voteCount: 3,
  };
  const votation: VoteType = {
    numberParticipants: 9,
    _id: "5",
    title: "Testvotering",
    voteText: "Dette er en testvotering",
    voted: [1, 2, 4, 7, 9],
    options: [testOption1, testOption2],
    isFinished: true,
    caseNumber: 1,
    isActive: false,
  };
  test("Results rendering correctly", () => {
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
            <Accordion>
              <Results key={votation._id} votation={votation} />
            </Accordion>
          </MantineProvider>
        </BrowserRouter>
      </checkedInState.Provider>
    );
    expect(screen.getByText("Testvotering")).toBeDefined();
    expect(screen.queryByText("Dette er en testvotering")).toBeNull();
    expect(screen.getByText("4 of 9 participants did not vote")).toBeDefined();
    expect(screen.getByText("3/5 (60.00%)")).toBeDefined();
    expect(screen.queryByText("4 of 999 participants did not vote")).toBeNull();
  });
});
