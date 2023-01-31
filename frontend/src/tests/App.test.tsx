import App from '../App';
import {render, screen} from '@testing-library/react';
import {describe, expect, test} from 'vitest';

// Basic example test
describe("App test", () => {
    test("Should show title", () => {
        render(<App />)
        expect(screen.getByText("Vite + React")).toBeDefined()
    })

    test("Should show button", () =>{
        render(<App />)
        expect(screen.getByRole("button")).toBeDefined()
    })

    
})
