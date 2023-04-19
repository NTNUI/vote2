import { LoginForm } from "../components/LoginForm";
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import colors from "../utils/theme";

// Basic example test
describe("Login test", () => {
  test("Should show text", () => {
    expect(true);

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
          <LoginForm />{" "}
        </MantineProvider>
      </BrowserRouter>
    );
    //expect(screen.getByText("Assembly dashboard")).toBeDefined()
  });
});
