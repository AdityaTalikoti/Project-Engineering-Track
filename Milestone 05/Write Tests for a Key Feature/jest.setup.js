import '@testing-library/jest-dom';

// Mock lucide-react icons globally to avoid ESM build issues in test runner environment
jest.mock('lucide-react', () => {
  const React = require('react');
  const mockIcon = (name) => {
    // Return a simple component showing the name so we can assert if needed, e.g. using queryByText
    return (props) => React.createElement('span', { ...props, 'data-testid': `icon-${name}` }, name);
  };
  return {
    AlertCircle: mockIcon('alert-circle'),
    RefreshCw: mockIcon('refresh-cw'),
    Mail: mockIcon('mail'),
    Lock: mockIcon('lock'),
    LogIn: mockIcon('login'),
    Package: mockIcon('package'),
    Calendar: mockIcon('calendar'),
    CheckCircle2: mockIcon('check-circle-2'),
    Clock: mockIcon('clock'),
    Truck: mockIcon('truck'),
    PackageOpen: mockIcon('package-open'),
  };
});
