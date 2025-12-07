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
    
    // Resume System Tests
    test('Profile page shows insert resume button initially', async()=> {
        render(<ProfilePage user={mockUser} />);
        await waitFor(()=>{
            expect(screen.getByText('Insert New Resume')).toBeInTheDocument();
        });
    });

    test('Clicking insert button shows resume menu', async()=> {
        render(<ProfilePage user={mockUser} />);
        await waitFor(()=>{
            expect(screen.getByText('Insert New Resume')).toBeInTheDocument();
        });
        
        const insertButton = screen.getByText('Insert New Resume');
        fireEvent.click(insertButton);
        
        expect(screen.getByText('Resume Management')).toBeInTheDocument();
        expect(screen.getByText('Choose a Preset Resume')).toBeInTheDocument();
        expect(screen.getByText('Upload Your Own Resume')).toBeInTheDocument();
    });

    test('if file name is displayed after upload and shows preview card', async()=>{
        render(<ProfilePage user={mockUser} />);
        await waitFor(()=>{
            expect(screen.getByText('Insert New Resume')).toBeInTheDocument();
        });
        
        // Click to open menu
        fireEvent.click(screen.getByText('Insert New Resume'));
        
        const file = new File(['test stuff'], 'resume.pdf', { type: 'application/pdf' });
        const input = screen.getByLabelText('Upload Your Own Resume') as HTMLInputElement;

        fireEvent.change(input, {target: { files: [file] }});

        expect(screen.getByText('Uploaded: resume.pdf')).toBeInTheDocument();
        expect(screen.getByText('Download Resume')).toBeInTheDocument();
        
        // Click back to see preview card
        fireEvent.click(screen.getByText('Back'));
        expect(screen.getByText('resume.pdf')).toBeInTheDocument();
        expect(screen.getByText('Click to edit or change resume')).toBeInTheDocument();
    });

    test('Can download uploaded files', async()=>{
        render(<ProfilePage user={mockUser} />);
        await waitFor(()=>{
            expect(screen.getByText('Insert New Resume')).toBeInTheDocument();
        });

        const mockURL = 'blob:mock-url';
        global.URL.createObjectURL = jest.fn(() => mockURL);
        global.URL.revokeObjectURL = jest.fn();

        const appendChild = jest.spyOn(document.body, 'appendChild');
        const removeChild = jest.spyOn(document.body, 'removeChild');

        // Open menu
        fireEvent.click(screen.getByText('Insert New Resume'));

        const file = new File(['test stuff'], 'resume.pdf', { type: 'application/pdf' });
        const input = screen.getByLabelText('Upload Your Own Resume') as HTMLInputElement;

        fireEvent.change(input, {target: { files: [file] }});

        const downloadButton = screen.getByText('Download Resume');
        fireEvent.click(downloadButton);

        expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
        expect(appendChild).toHaveBeenCalled();
        expect(removeChild).toHaveBeenCalled();
        expect(global.URL.revokeObjectURL).toHaveBeenCalledWith(mockURL);

        appendChild.mockRestore();
        removeChild.mockRestore();
    });

    test('Can select and download preset resume', async()=>{
        render(<ProfilePage user={mockUser} />);
        await waitFor(()=>{
            expect(screen.getByText('Insert New Resume')).toBeInTheDocument();
        });

        const appendChild = jest.spyOn(document.body, 'appendChild');
        const removeChild = jest.spyOn(document.body, 'removeChild');

        // Open menu
        fireEvent.click(screen.getByText('Insert New Resume'));

        const select = screen.getByLabelText('Choose a Preset Resume') as HTMLSelectElement;
        fireEvent.change(select, { target: { value: '/resumes/database-engineer.pdf' } });

        expect(screen.getByText('Preset: Database Engineer Resume')).toBeInTheDocument();

        const downloadButton = screen.getByText('Download Resume');
        fireEvent.click(downloadButton);

        expect(appendChild).toHaveBeenCalled();
        expect(removeChild).toHaveBeenCalled();

        appendChild.mockRestore();
        removeChild.mockRestore();
    });
});