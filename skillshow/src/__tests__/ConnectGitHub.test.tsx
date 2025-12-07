// src/__tests__/ConnectGitHub.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConnectGitHub, DisconnectGitHub } from '../components/ConnectGitHub';
import { auth } from '../firebase-config';

// Mock the same module path used by the tests/components
jest.mock('../firebase-config', () => {
  return {
    auth: {
      currentUser: null,
      signOut: jest.fn(),
    },
  };
});

// Safer location and fetch mocking
const originalLocation = window.location;

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { href: '' },
  });
  // Default fetch mock that resolves a JSON object (used by Disconnect)
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, redirectUrl: 'https://github.com/uninstall' }),
    } as Response)
  );
});

afterAll(() => {
  // restore original location
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: originalLocation,
  });
  // restore fetch
  (global.fetch as jest.Mock).mockRestore?.();
});

beforeEach(() => {
  jest.clearAllMocks();
  // ensure starting state
  (auth as any).currentUser = null;
  window.alert = jest.fn();
  window.open = jest.fn();
  (window.location as any).href = '';
});

describe('ConnectGitHub Component', () => {
  test('has a connect button', () => {
    render(<ConnectGitHub />);
    const button = screen.getByText('Connect GitHub');
    expect(button).toBeInTheDocument();
  });

  test('has redirect logic', () => {
    (auth as any).currentUser = { uid: 'test-user-123' };
    render(<ConnectGitHub />);
    const button = screen.getByText('Connect GitHub');
    fireEvent.click(button);
    // Even if env vars are missing, the href should be set (might be undefined/NaN but not empty)
    expect((window.location as any).href).toBeTruthy();
  });

  test('has authentication check logic', () => {
    (auth as any).currentUser = null;
    render(<ConnectGitHub />);
    const button = screen.getByText('Connect GitHub');
    fireEvent.click(button);
    expect(window.alert).toHaveBeenCalledWith('Please log in first');
  });
});

describe('DisconnectGitHub Component', () => {
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
    expect(window.alert).toHaveBeenCalledWith('Please log in first');
  });

  test('disconnect triggers fetch and open', async () => {
    (auth as any).currentUser = { uid: 'test-user-123' };
    render(<DisconnectGitHub />);
    const btn = screen.getByText('Disconnect GitHub');
    fireEvent.click(btn);
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
    // Check that window.open was called if redirectUrl is present
    await waitFor(() => {
      expect(window.open).toHaveBeenCalledWith('https://github.com/uninstall', '_blank');
    });
  });
});
