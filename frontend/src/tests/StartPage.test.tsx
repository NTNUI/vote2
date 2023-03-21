import { StartPage } from "../pages/StartPage";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MantineProvider } from "@mantine/core";
import colors from "../utils/theme";
import { BrowserRouter } from "react-router-dom";

// Basic example test
describe("Login test", () => {
  test("Should show text", () => {
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
          <StartPage />
        </MantineProvider>
      </BrowserRouter>
    );
  });
});
