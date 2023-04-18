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
  //   vi.mock("@mantine/core", () => ({
  //     ...vi.importActual("@mantine/core"),
  //     useMediaQuery: vi.fn().mockReturnValue(false),
  //   }));
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
  test("HEI", () => {
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
    expect(screen.getByText("eET")).toBeDefined();
  });
  //   test("Test", () => {
  //     render(
  //       <>
  //         <p>hei</p>
  //       </>
  //     );
  //     //   <>
  //     //     <checkedInState.Provider value={value}>
  //     //       <BrowserRouter>
  //     //         <MantineProvider
  //     //           theme={{
  //     //             fontFamily: "Poppins, sans-serif",
  //     //             colors: colors,
  //     //             fontSizes: {
  //     //               xs: 10,
  //     //               sm: 12,
  //     //               md: 14,
  //     //               lg: 20,
  //     //               xl: 24,
  //     //             },
  //     //             breakpoints: {
  //     //               xs: 500,
  //     //               sm: 800,
  //     //               md: 1000,
  //     //               lg: 1200,
  //     //               xl: 1400,
  //     //             },
  //     //           }}
  //     //         >
  //     //           <Accordion>
  //     //             <Results key={votation._id} votation={votation} />
  //     //             <p>Hei</p>
  //     //           </Accordion>
  //     //           <p>test</p>
  //     //         </MantineProvider>
  //     //       </BrowserRouter>
  //     //     </checkedInState.Provider>
  //     //     <p>tetete</p>
  //     //   </>
  //   });
  //   expect(screen.getByText("Hei")).toBeDefined();
  // });
});
