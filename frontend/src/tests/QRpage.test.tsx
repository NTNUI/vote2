import QRpage from '../pages/QRpage';
import {render, screen} from '@testing-library/react';
import {describe, expect, test} from 'vitest';

// Basic example test
describe("Login test", () => {
    test("Should show text", () => {
        render(<QRpage />)
        expect(screen.getByText("QR code here")).toBeDefined()
    })

})
