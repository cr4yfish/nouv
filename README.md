# Nouv - learn better
The learning app that helps you learn anything you want.

<a href="https://www.reddit.com/r/nouv_app/" target="_blank">r/nouv_app on Reddit</a>



<div style="width: 100%; display: flex; justify-content: center; gap: 1rem;">
    <img src="https://i.imgur.com/ZI5MVWV.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/jlW9KwP.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/ELax4dC.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/9BdqEjB.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/MR2U4bb.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/qSPt5SL.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/jWbhecS.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/jkz577X.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/1kLMd45.png" style="height: 500px; width: auto;" >
    <img src="https://i.imgur.com/7fMMwSs.png" style="height: 500px; width: auto;" >
</div>

## TL;DR
Duolingo but for any subject and community-driven.

## Description
This is a project to help people learn better. Its main feature is the ability to create and share courses.
The point being that you can learn anything you want, and you can help others learn what you know.

The main reason for this project is that I would love to have an App like Duolingo but for university subjects, and since I'd have to create a nice way of adding content to it anyway, I thought why not make it a platform for everyone to use, I thought why not make it a platform for everyone to use - so here we are.

## Hero Features
- Create & Share Courses, Levels & Questions
- AI Helper for answering questions
- AI Course Sections & Levels creation from source documents (PDF)
- Leaderboard with Rank System
- Streak and XP System
- Level Scroller with Progression System and Sections

## Stack
* Next.js
* Supabase
* TailwindCSS
* NextUI
* Shadcn
* Vercel AI SDK
* Gemini
* Mistral/NVIDIA Nemo

## Roadmap
I tried ordering stuff in a logical order, but I might still jump around a bit.

Features marked with a question mark are not yet decided on, and might be dropped.

### MVP Features
- [x] Basic Level interaction
- [x] Level Scroller
- [x] Auth System
- [x] Course subscription system
- [x] Basic Level creation
- [x] Basic Level editing
- [x] Basic Course creation
- [x] Basic Course Editing
    - [x] General info
    - [x] Change order of Levels 
- [x] Data aquisition on questions & levels
    - [x] Add accuracy system for questions & topics
    - [x] Add XP system
    - [x] Track & Show streaks
    - [x] Basic UI for level complete, using that data
- [x] Basic Creation for user accounts & profiles (I manually create them in the database right now)
- [x] Very basic welcome/login page 
- [x] Basic UI for Profiles
    - [x] Basic Edit Profile
    - [x] Basic Settings (cloud saved)
- [x] Leaderboard (global for now)
- [x] Implement Rank system
    - [x] Leaderboard per rank
    - [x] Rank up system (individual)
- [x] New-user Flow
    - [x] Onboarding      
- [x] Implement Course Sections
    - [x] Viewing course sections
    - [x] Creating course sections
    - [x] Editing course sections
    - [x] Adjust other systems to use course sections
        - [x] Level Scroller
        - [x] Level Creation
- [x] Community Features 1
    - [ ] ~~Image upload support~~ - Will add later
    - [ ] ~~Adding more optional info fields~~ - Might add later
    - [x] Viewing other user profiles
    - [x] Rating System
        - [x] Courses
        - [x] Levels 
        - [ ] ~~Questions~~ - Too Granular
- [x] Recurring questions in levels when questions are answered wrong
- [ ] Data Features 1
    - [x] Training mode on low confidence questions
    - [x] Stats about users & learning
    - [x] Weekly/Monthly streak/xp goals
    - [ ] ~~Weekly rank ups~~ - Might add later
    - [ ] Achievements - WIP
- [x] PWA features 
    - [x] App installation popup support (depends on Browser)
    - [x] Notification System
    - [x] Better caching
    - [x] Offline Mode
    - [ ] ~~Manual download of Courses?~~ - idk if that's useful
- [ ] Anon views
    - [ ] Anon view of courses
    - [ ] Demo mode for onboarding
- [x] Community Features 2
    - [x] Following other users
    - [x] Friend Battles    

### Beta Features
- [ ] Redesign UI & Refactor Code
    - [ ] Improve UI/UX - WIP
    - [ ] Add animations
    - [x] Move as much as possible to Server Rendering
- [x] Buy a domain

### Future Features
- [ ] Course Collaboration  
- [ ] Friend Quests
- [ ] Importing Levels & Questions from other sources
    - [ ] Anki decks
    - [x] Website Scraper (only works on server-rendered websites)
- [ ] Security features
    - [ ] Cloudflare
    - [ ] Captcha for user sign ups
    - [ ] Add Email Verification
- [ ] Privacy Settings
    - [ ] Private Courses
    - [ ] Private User Profiles
- [ ] Localization? - Only if there are enough users to justify it
    - [ ] Multi-language support
    - [ ] Multi-language Courses
- [ ] Institutional Accounts?    

### AI features
- [x] Creating Levels & Questions from Document uploads using AI
    - [x] PDF
    - [x] Website URL (only works on server-rendered websites)
    - [ ] ~~Image uploads~~ - Might add later
    - [ ] ~~Plain text~~ - idk if that's useful
- [x] AI explanation for questions
- [ ] Personalized Teacher AI per course
- [ ] ~~AI Helper for creating questions & levels (mostly for writing help)~~ - Just use the first feature

## Open Source & Contributions
This project is 100% open source. 
Please don't judge my code too harshly, I'm on a tight schedule and I'm doing my best.

If you want to contribute, please do. I'm happy to accept any help I can get.
Easiest way is to test the app and report bugs, but if you want to help with code, that's great too.
