import {Assembly} from '../pages/GenforsDashboard';
import {render, screen} from '@testing-library/react';
import {describe, expect, test} from 'vitest';

// Basic example test
describe("Login test", () => {
    test("Should show text", () => {
        render(<Assembly />)
        //expect(screen.getByText("Genfors dashboard")).toBeDefined()
    })

})
