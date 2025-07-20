// This file mocks the Joplin API module.
// It is used by Jest's moduleNameMapper to resolve the 'api' import.

export default {
  views: {
    dialogs: {
      showMessageBox: jest.fn(),
    },
  },
  settings: {
    values: jest.fn(),
    setValue: jest.fn(),
    onChange: jest.fn(),
  },
  // Add other parts of the Joplin API as needed for your tests
};
