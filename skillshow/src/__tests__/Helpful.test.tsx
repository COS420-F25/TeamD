import React from 'react';

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import {collection, getDocs, where, query, doc, deleteDoc} from 'firebase/firestore';
import AddToDBButton from "../components/AddtoDBButton";
import { db } from '../firebase-config';


describe("Just making sure the tests work", () =>{
    // test("Expert works", () => {
    //     render(<AddToDBButton/>);
    //     const buttonElement = screen.getByText(/Not there button/i);
    //     expect(buttonElement).toBeInTheDocument();
    // });

    test("Expert works", () => {
        render(<AddToDBButton/>);
        const buttonElement = screen.getByText(/Add/i);
        expect(buttonElement).toBeInTheDocument();
    });

})
