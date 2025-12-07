/* File created with Claude Code */

import { AuthService } from '../services/AuthService';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase-config';

// Mock firebase-config
jest.mock('../firebase-config', () => ({
  auth: {},
  db: {}
}));

// Mock firebase/auth module
jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  updateProfile: jest.fn()
}));

// Mock firebase/firestore module
jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn()
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  describe('registerUser', () => {
    test('successfully registers user without displayName', async () => {
      // Mock user credential
      const mockUserCredential = {
        user: {
          uid: 'test-uid-123',
          email: 'test@example.com',
          displayName: null
        }
      };

      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
      (setDoc as jest.Mock).mockResolvedValue(undefined);
      (doc as jest.Mock).mockReturnValue({ path: 'users/test-uid-123' });

      const result = await authService.registerUser('test@example.com', 'password123');

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
      expect(updateProfile).not.toHaveBeenCalled();
      expect(setDoc).toHaveBeenCalledWith(
        { path: 'users/test-uid-123' },
        expect.objectContaining({
          uid: 'test-uid-123',
          email: 'test@example.com',
          displayName: '',
          createdAt: expect.any(String)
        })
      );
      expect(console.log).toHaveBeenCalledWith('User signed up:', 'test-uid-123');
      expect(result).toEqual(mockUserCredential);
    });

    test('successfully registers user with displayName', async () => {
      const mockUserCredential = {
        user: {
          uid: 'test-uid-456',
          email: 'test@example.com',
          displayName: 'Test User'
        }
      };

      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
      (updateProfile as jest.Mock).mockResolvedValue(undefined);
      (setDoc as jest.Mock).mockResolvedValue(undefined);
      (doc as jest.Mock).mockReturnValue({ path: 'users/test-uid-456' });

      const result = await authService.registerUser('test@example.com', 'password123', 'Test User');

      expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
      expect(updateProfile).toHaveBeenCalledWith(mockUserCredential.user, { displayName: 'Test User' });
      expect(setDoc).toHaveBeenCalledWith(
        { path: 'users/test-uid-456' },
        expect.objectContaining({
          uid: 'test-uid-456',
          email: 'test@example.com',
          displayName: 'Test User',
          createdAt: expect.any(String)
        })
      );
      expect(console.log).toHaveBeenCalledWith('User signed up:', 'test-uid-456');
      expect(result).toEqual(mockUserCredential);
    });

    test('handles createUserWithEmailAndPassword failure', async () => {
      const error = new Error('auth/email-already-in-use');
      (createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

      await expect(authService.registerUser('test@example.com', 'password123'))
        .rejects
        .toThrow('auth/email-already-in-use');

      expect(console.error).toHaveBeenCalledWith('Signup failed:', error.message);
      expect(setDoc).not.toHaveBeenCalled();
    });

    test('handles updateProfile failure', async () => {
      const mockUserCredential = {
        user: {
          uid: 'test-uid-789',
          email: 'test@example.com',
          displayName: null
        }
      };

      const error = new Error('Profile update failed');
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
      (updateProfile as jest.Mock).mockRejectedValue(error);

      await expect(authService.registerUser('test@example.com', 'password123', 'Test User'))
        .rejects
        .toThrow('Profile update failed');

      expect(console.error).toHaveBeenCalledWith('Signup failed:', error.message);
      expect(setDoc).not.toHaveBeenCalled();
    });

    test('handles Firestore setDoc failure', async () => {
      const mockUserCredential = {
        user: {
          uid: 'test-uid-999',
          email: 'test@example.com',
          displayName: 'Test User'
        }
      };

      const error = new Error('permission-denied');
      (createUserWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);
      (updateProfile as jest.Mock).mockResolvedValue(undefined);
      (doc as jest.Mock).mockReturnValue({ path: 'users/test-uid-999' });
      (setDoc as jest.Mock).mockRejectedValue(error);

      await expect(authService.registerUser('test@example.com', 'password123', 'Test User'))
        .rejects
        .toThrow('permission-denied');

      expect(console.error).toHaveBeenCalledWith('Signup failed:', error.message);
    });
  });

  describe('loginUser', () => {
    test('successfully logs in user', async () => {
      const mockUserCredential = {
        user: {
          uid: 'test-uid-123',
          email: 'test@example.com'
        }
      };

      (signInWithEmailAndPassword as jest.Mock).mockResolvedValue(mockUserCredential);

      const result = await authService.loginUser('test@example.com', 'password123');

      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, 'test@example.com', 'password123');
      expect(console.log).toHaveBeenCalledWith('User Logged in:', 'test-uid-123');
      expect(result).toEqual(mockUserCredential);
    });

    test('handles login failure (wrong password)', async () => {
      const error = new Error('auth/wrong-password');
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

      await expect(authService.loginUser('test@example.com', 'wrongpass'))
        .rejects
        .toThrow('auth/wrong-password');

      expect(console.error).toHaveBeenCalledWith('Login failed:', error.message);
    });

    test('handles login failure (user not found)', async () => {
      const error = new Error('auth/user-not-found');
      (signInWithEmailAndPassword as jest.Mock).mockRejectedValue(error);

      await expect(authService.loginUser('nonexistent@example.com', 'password123'))
        .rejects
        .toThrow('auth/user-not-found');

      expect(console.error).toHaveBeenCalledWith('Login failed:', error.message);
    });
  });

  describe('logoutUser', () => {
    test('successfully logs out user', async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);

      await authService.logoutUser();

      expect(signOut).toHaveBeenCalledWith(auth);
      expect(console.log).toHaveBeenCalledWith('User logged out');
    });

    test('handles logout failure', async () => {
      const error = new Error('auth/network-request-failed');
      (signOut as jest.Mock).mockRejectedValue(error);

      await expect(authService.logoutUser())
        .rejects
        .toThrow('auth/network-request-failed');

      expect(console.error).toHaveBeenCalledWith('Logout failed:', error.message);
    });

    test('verifies signOut called with correct auth instance', async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);

      await authService.logoutUser();

      expect(signOut).toHaveBeenCalledTimes(1);
      expect(signOut).toHaveBeenCalledWith(auth);
    });
  });
});
