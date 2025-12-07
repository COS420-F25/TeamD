import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConnectGitHub, DisconnectGitHub } from '../components/ConnectGitHub';

// IMPORTANT: The module path here must match the path used by the component imports
// The component imports '../firebase-config' so mock that same path
const mockAuth = {
  currentUser: null as any,
  signOut: jest.fn(),
};

jest.mock('../firebase-config', () => ({
  auth: mockAuth,
}));

// Safer location mocking without deleting the property
const originalLocation = window.location;
let mockLocation: { href: string };

beforeAll(() => {
  // Define a mutable href for tests that change location
  Object.defineProperty(window, 'location', {
    configurable: true,
    writable: true,
    value: { href: '' },
  });
  mockLocation = window.location as { href: string };
  
  // Provide a default fetch mock that resolves
  global.fetch = jest.fn(() => 
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, redirectUrl: 'https://example.com' }),
    } as Response)
  );
});

afterAll(() => {
  // Restore original location
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: originalLocation,
  });
  
  // Restore fetch
  (global.fetch as jest.Mock).mockRestore?.();
});

describe('ConnectGitHub Component', () => {
  beforeEach(() => {
    window.alert = jest.fn();
    mockLocation.href = '';
    // Reset auth state for each test
    mockAuth.currentUser = null;
    jest.clearAllMocks();
  });

  test('has a connect button', () => {
    render(<ConnectGitHub />);
    const button = screen.getByText('Connect GitHub');
    expect(button).toBeInTheDocument();
  });

  test('has redirect logic', () => {
    // Mock authenticated user for this test
    mockAuth.currentUser = { uid: 'test-user-123' };
    
    render(<ConnectGitHub />);
    const button = screen.getByText('Connect GitHub');
    fireEvent.click(button);
    
    // Check that location was set (even if env vars are missing, href should change)
    expect(mockLocation.href).toBeTruthy();
  });

  test('has authentication check logic', () => {
    // Set user to null for this test
    mockAuth.currentUser = null;
    
    render(<ConnectGitHub />);
    const button = screen.getByText('Connect GitHub');
    fireEvent.click(button);
    
    expect(window.alert).toHaveBeenCalledWith('Please log in first');
  });
});

describe('DisconnectGitHub Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    // Reset auth state for each test
    mockAuth.currentUser = null;
    // Reset fetch mock
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, redirectUrl: 'https://example.com' }),
    });
  });

  test('has a disconnect button', () => {
    render(<DisconnectGitHub />);
    const button = screen.getByText('Disconnect GitHub');
    expect(button).toBeInTheDocument();
  });

  test('has authentication check logic', () => {
    mockAuth.currentUser = null;
    
    render(<DisconnectGitHub />);
    const button = screen.getByText('Disconnect GitHub');
    fireEvent.click(button);
    
    expect(window.alert).toHaveBeenCalledWith('Please log in first');
  });

  test('calls fetch when user is authenticated', async () => {
    mockAuth.currentUser = { uid: 'test-user-123' };
    
    render(<DisconnectGitHub />);
    const button = screen.getByText('Disconnect GitHub');
    fireEvent.click(button);
    
    // Wait for async fetch call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
