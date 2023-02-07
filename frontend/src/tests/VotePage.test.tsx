import {Vote} from '../pages/VotePage';
import {render, screen} from '@testing-library/react';
import {describe, expect, test} from 'vitest';

// Basic example test
describe("Login test", () => {
    test("Should show text", () => {
        render(<Vote />)
    })

})
