import 'jest-preset-angular/setup-jest.js';
import '@testing-library/jest-dom';

// jsdom does not implement matchMedia, which govuk-service-navigation reads on construction
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: true,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
