import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProfilePage } from '../pages/ProfilePage';
import { db } from '../firebase-config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

jest.mock('../firebase-config', () => ({
    db: {},
}));

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
}));

describe('ProfilePage Component', () => {
    const mockUser = { uid: 'user-123' } as any;

    beforeEach(() => {
        jest.clearAllMocks();
        window.alert = jest.fn();
        console.error = jest.fn();
    });

    test('shows login message if not logged in', ()=>{
        render(<ProfilePage user={null as any} />);
        expect(screen.getByText('Please log in to view profile')).toBeInTheDocument();
    });

    test('initially shows loading screen when user exists', async()=>{
        (getDoc as jest.Mock).mockResolvedValue({exists:()=>false});
        render( <ProfilePage user={mockUser} />);
        expect(screen.getByText('Loading profile')).toBeInTheDocument();

    });

    test('fetches and displays profile data when user exists', async()=> {
        const mockData = { name: 'test user', bio: 'blah blah blah'};
        (getDoc as jest.Mock).mockResolvedValue({exists:()=>true, data: ()=>mockData});
        render(<ProfilePage user={mockUser} />);
        await waitFor(()=>{
            expect(screen.getByDisplayValue('test user')).toBeInTheDocument();
            
        });
        expect(screen.getByDisplayValue('blah blah blah')).toBeInTheDocument(); 
    });

    test('profile data gets saved to firestore', async()=>{
        (getDoc as jest.Mock).mockResolvedValue({ exists: ()=> false});
        (doc as jest.Mock).mockImplementation(()=>({path:'profiles/user-123'}));
        (setDoc as jest.Mock).mockResolvedValue(undefined);

        render(<ProfilePage user={mockUser}/>);
        
        const button = await screen.findByText('Save Profile');
        fireEvent.click(button);

        await waitFor(()=>{
            expect(setDoc).toHaveBeenCalledWith({path:'profiles/user-123'},{name: '', bio: '', pfpUrl: '',title:'',location:'',contact:''});
        
        })
         expect(window.alert).toHaveBeenCalledWith('Profile saved successfully');
    })


});