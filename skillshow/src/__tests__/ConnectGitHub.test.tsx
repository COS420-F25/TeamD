import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConnectGitHub, DisconnectGitHub } from '../components/ConnectGitHub';
import { auth } from '../firebase-config';

// Create mock for firebase auth
jest.mock('../../src/firebase-config', () => ({
  auth: {
    currentUser: null,
  },
}));

// Create a mock window.location.href
delete (window as any).location;
(window as any).location = { href: '' };
global.fetch = jest.fn();

describe('ConnectGitHub Component', () => {
  beforeEach(() => {
    window.alert = jest.fn();
    window.location.href = '';
  });

  test('has a connect button', () => {
    render(<ConnectGitHub />);
    const button = screen.getByText('Connect GitHub');
    expect(button).toBeInTheDocument();
  });

  test('has redirect logic', () => {
    // Mock authenticated user for this test
    (auth as any).currentUser = { uid: 'test-user-123' };
    
    render(<ConnectGitHub />);
    const button = screen.getByText('Connect GitHub');
    fireEvent.click(button);
    
    expect(window.location.href).toContain('githubInstall');
  });

  test('has authentication check logic', () => {
    // Set user to null for this test
    (auth as any).currentUser = null;
    
    render(<ConnectGitHub />);
    const button = screen.getByText('Connect GitHub');
    fireEvent.click(button);
    
    expect(window.alert).toHaveBeenCalled();
  });
});

describe('DisconnectGitHub Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
  });

  test('has a disconnect button', () => {
    render(<DisconnectGitHub />);
    const button = screen.getByText('Disconnect GitHub');
    expect(button).toBeInTheDocument();
  });

  test('has authentication check logic', () => {
    (auth as any).currentUser = null;
    
    render(<DisconnectGitHub />);
    const button = screen.getByText('Disconnect GitHub');
    fireEvent.click(button);
    
    expect(window.alert).toHaveBeenCalled();
  });
});