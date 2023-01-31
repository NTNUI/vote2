import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        coverage: {
            provider: 'istanbul', // or 'c8',
            all: true,
            reporter: ['text', 'json', 'html']
        },
    },
});