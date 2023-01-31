import Login from '../pages/Login';
import {render, screen} from '@testing-library/react';
import {describe, expect, test} from 'vitest';

// Basic example test
describe("Login test", () => {
    test("Should show text", () => {
        render(<Login />)
        expect(screen.getByText("Login")).toBeDefined()
    })

})
