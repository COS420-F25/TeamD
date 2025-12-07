import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConnectGitHub, DisconnectGitHub } from '../components/ConnectGitHub';

// Simple mock - just mock the module
jest.mock('../firebase-config', () => ({
  auth: {
    currentUser: null,
  },
}));

describe('ConnectGitHub Component', () => {
  beforeEach(() => {
    window.alert = jest.fn();
    // Simple location mock
    delete (window as any).location;
    (window as any).location = { href: '' };
  });

  test('renders connect button', () => {
    render(<ConnectGitHub />);
    expect(screen.getByText('Connect GitHub')).toBeInTheDocument();
  });

  test('shows alert when not authenticated', () => {
    render(<ConnectGitHub />);
    fireEvent.click(screen.getByText('Connect GitHub'));
    expect(window.alert).toHaveBeenCalledWith('Please log in first');
  });
});

describe('DisconnectGitHub Component', () => {
  beforeEach(() => {
    window.alert = jest.fn();
    global.fetch = jest.fn();
  });

  test('renders disconnect button', () => {
    render(<DisconnectGitHub />);
    expect(screen.getByText('Disconnect GitHub')).toBeInTheDocument();
  });

  test('shows alert when not authenticated', () => {
    render(<DisconnectGitHub />);
    fireEvent.click(screen.getByText('Disconnect GitHub'));
    expect(window.alert).toHaveBeenCalledWith('Please log in first');
  });
});
