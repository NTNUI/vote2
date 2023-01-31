import CheckIn from '../pages/CheckIn';
import {render, screen} from '@testing-library/react';
import {describe, expect, test} from 'vitest';

// Basic example test
describe("Login test", () => {
    test("Should show text", () => {
        render(<CheckIn />)
        expect(screen.getByText("CheckIn")).toBeDefined()
    })

})
