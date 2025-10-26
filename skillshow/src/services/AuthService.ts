import { createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    UserCredential,
} from "firebase/auth";
import {auth, db} from "../firebase-config"
import {doc, setDoc} from "firebase/firestore"

export class AuthService{

    async registerUser(
        email: string,
        password: string,
        displayName?: string
    ): Promise<UserCredential>{
        try{
            // create user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            //set display name
            if(displayName){
                await updateProfile(user, {displayName})
            }

            //store user info in Firestore
            await setDoc(doc(db, "users", user.uid),{
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || displayName || "",
                createdAt: new Date().toISOString(),
            });
            console.log("User signed up:", user.uid);
            return userCredential;

        }catch(error: any){
            console.error("Signup failed:", error.message);
            throw new Error(error.message);
        }
    }
    async loginUser(email: string, password: string): Promise<UserCredential> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("User Logged in:", userCredential.user.uid);
            return userCredential;
        } catch(error: any){
            console.error("Login failed:", error.message);
            throw new Error(error.message);
        }
    }

    async logoutUser(): Promise<void>{
        try{
            await signOut(auth);
            console.log("User logged out");
        }catch (error:any){
            console.error("Logout failed:", error.message);
            throw new Error(error.message);
        }
    }
}