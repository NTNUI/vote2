import App from '../App';
import {render, screen} from '@testing-library/react';
import {describe, expect, test} from 'vitest';
import {BrowserRouter, MemoryRouter} from 'react-router-dom'

// Basic example test
describe("App test", () => {
    test("Should show title", () => {
        render(<App />, {wrapper: BrowserRouter})
        expect(screen.getByText("Login")).toBeDefined()
    })

})
