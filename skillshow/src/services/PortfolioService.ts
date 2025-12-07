import { db } from "../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Portfolio } from "../types/Portfolio";
import { Project } from "../types/Project";


export async function addProjectToPortfolio(userId: string, project: Project) {
    const portfolioRef = doc(db, "portfolios", userId);
    const snapshot = await getDoc(portfolioRef);

    let portfolio: Portfolio;

    if (snapshot.exists()) {
        portfolio = snapshot.data() as Portfolio;
    } else {
        portfolio = {
            portfolioId: userId,
            userId,
            projects: []
        };
    }
    portfolio.projects.push(project);
    await setDoc(portfolioRef, portfolio);
}
