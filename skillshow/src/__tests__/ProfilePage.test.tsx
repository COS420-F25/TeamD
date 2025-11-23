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
            expect(screen.getByDisplayValue('blah blah blah')).toBeInTheDocument(); //ignoring warning as test still works as intended
        });
    });

    test('profile data gets saved to firestore', async()=>{
        (getDoc as jest.Mock).mockResolvedValue({ exists: ()=> false});
        (doc as jest.Mock).mockImplementation(()=>({path:'profiles/user-123'}));
        (setDoc as jest.Mock).mockResolvedValue(undefined);

        render(<ProfilePage user={mockUser}/>);
        
        const button = await screen.findByText('Save Profile');
        fireEvent.click(button);

        await waitFor(()=>{
            expect(setDoc).toHaveBeenCalledWith({path:'profiles/user-123'},{name: '', bio: ''});
            expect(window.alert).toHaveBeenCalledWith('Profile saved successfully');
        })

    })
    
    // Resume System Tests
    test('Profile page is prompting for resume download', async()=> {
        render(<ProfilePage user={mockUser} />);
        await waitFor(()=>{
            expect(screen.getByText('Upload your resume')).toBeInTheDocument();
        });
    });

    test('if file name is displayed after upload', async()=>{
        render(<ProfilePage user={mockUser} />);
        await waitFor(()=>{
            expect(screen.getByText('Upload your resume')).toBeInTheDocument();
        });
        const file = new File(['test stuff'], 'resume.pdf', { type: 'application/pdf' });
        const input = screen.getByLabelText('Upload your resume') as HTMLInputElement;

        fireEvent.change(input, {target: { files: [file] }})

        expect(screen.getByText('Resume: resume.pdf')).toBeInTheDocument();
        expect(screen.getByText('Download File')).toBeInTheDocument();

    });

    test('Can download files?', async()=>{
        render(<ProfilePage user={mockUser} />);
        await waitFor(()=>{
            expect(screen.getByText('Upload your resume')).toBeInTheDocument();
        });

        const mockURL = 'blob:mock-url';
        global.URL.createObjectURL = jest.fn(() => mockURL);
        global.URL.revokeObjectURL = jest.fn();

        const appendChild = jest.spyOn(document.body, 'appendChild');
        const removeChild = jest.spyOn(document.body, 'removeChild');

        const file = new File(['test stuff'], 'resume.pdf', { type: 'application/pdf' });
        const input = screen.getByLabelText('Upload your resume') as HTMLInputElement;

        fireEvent.change(input, {target: { files: [file] }})

        const downloadButton = screen.getByText('Download File');
        fireEvent.click(downloadButton);

        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
        expect(appendChild).toHaveBeenCalled();
        expect(removeChild).toHaveBeenCalled();
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(mockURL);

        appendChild.mockRestore();
        removeChild.mockRestore();

    });
});