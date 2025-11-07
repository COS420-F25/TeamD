# TeamD
Team D's repository for COS 420 - Fall of 2025

# Team name: Dingo

# Team Roles:

Project Manager (PM): Chauncey O’Connell

Designer: Nathaniel Hayes

Developer 1: Josh Vansantvoord

Developer 2: Mason Peasley

Developer 3: Xander Watkins

# Team Schedule

Monday: 3:15 – 4:00 PM (Sprint Kickoff / Task Management, 45m)

Wednesday: 3:15 – 3:30 PM (Scrum stand-up, 15m)

Tuesday: 3:30 PM (Reserved 30m slot)

Thursday: 3:30 PM (Reserved 30m slot)

Friday: 4:30 PM (15m End of Sprint Review)

# Communication Policies

# Pings:

@username -> okay anytime

@TeamD -> only when you need the attention of all team members

     Eg.  You need team-wide input for a task
          Something needs to be brought to attention like a suprise deadline
          You need anybody to respond ASAP.
     
     !Eg. You need a particular person's attention

@all -> you need all team members attention AND Dr. Greg's.

Response expectations:

Please check-in at 10 AM and 9 PM
     
     If pinged please respond by or at the next check-in
     If not pinged make sure to still glance at the chat

Who should reply?

  1. First, the person pinged

  2. If unclear -> whoever can answer

  3. Team lead steps in if unresolved

If unable to communicate by Discord, Zoom will be used as an alternative. 

# Mission Statement

Team Dingo is dedicated to empowering computer science students by simplifying how they showcase their skills and access career resources, bridging the gap between education and employment.

# Problem Statement

Students often struggle to effectively share and showcase their coding work, particularly when it comes to displaying project overviews rather than just the underlying code. This problem is exacerbated by many employers utilizing generative AI, limiting the number of entry-level job opportunities being offered to junior engineers entering the workforce. If new graduates could demonstrate their ability to effectively use generative AI to boost their productivity and enhance their skillsets, then they might be more likely to be hired into a traditional junior role. Standard solutions like GitHub have been widely adopted in computer science education and offer tools for code documentation, version control, and collaboration. However, they lack options to create polished, professional portfolios that can effectively demonstrate a student's capabilities to potential employers. This creates a significant gap between the academic adoption of GitHub as a primary tool for managing coding assignments and students' need to professionally present their work. In addition, there is currently no standard way to demonstrate a students’ ability to efficiently and effectively use generative AI. How can we create a way for students to better showcase the coding work they've accomplished in an organized and professional manner that also demonstrates generative AI proficiency, while taking into account the massive academic adoption of GitHub?

# Environment Setup

     Requirments for the development of SkillShow may change over the course of this project.
     
## Prerequisites

  **Node.js** 
     - Download from [nodejs.org](https://nodejs.org/en/download)
     - Verify installation: `node --version`
- **npm** 
     - Verify installation: `npm --version`
- **Git**
     - Download from [git-scm.com](https://git-scm.com/)
     - Verify installation: `git --version`
- **Visual Studio Code**
     - Download from [code.visualstudio.com](https://code.visualstudio.com/)
  **VSCode Extensions**
     - ESLint - Useed for JavaScript linting
     - Prettier - Used for code formatting 
     - Jest - Used for unit testing

-    *Note* If you are using a different editor, you will still need to follow the formatting
     from Prettier and ESLint.

- **React Developer Tools**
     - [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
     - [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

## Getting Started Locally

1. **Clone the repository**
```bash
     git clone https://github.com/COS420-F25/TeamD
     cd TeamD
```
2.  **Update Environment Variables **
```bash   
     Access the README.md in the team drive for more information
```
3. **Install dependencies**

```bash
     cd skillshow
     npm install
     npm install -g firebase-tools
     cd functions
     npm install
     npm install firebase-admin
     cd ..
     firebase login
     > yes
     > yes
     > Sign into Maine.edu account
```

4. **Start the development server**
```bash
     cd functions
     npm run build
     cd skillshow
     firebase emulators:start --only functions
     * In another terminal, from the skillshow directory*
     npm run start
```
     The firebase emulator can be accesed at `http://127.0.0.1:4000/firestore/default/data`
     The app should open in your browser at `http://localhost:3000`

## Available npm Scripts

     See `/skillshow/README.md` for all available npm scripts

## Testing with Jest

skillshow uses Jest for testing

- Run tests: `npm run test` 
     'a' will run all tests
     'f' will run failed tests
     'q' to quit

- VScode has a GUI that can be used as well

     New tests should add to the /skillshow/tests directory.
     New tests should take the form of `feature.test.tsx`.

## Required Workflow

1. Pull the latest changes from main: `git checkout main && git pull`
2. Create a new branch for your feature: `git checkout -b <feature-name>`
3. Make your changes and commit regularly
     Commits should be...
     - made to a feature branch
     - accompanied by a commit message
     - free from failed tests and lints
4. Write tests for new any new functionality
5. Push your branch: `git push -u origin <feature-name>`
6. Create a pull request
