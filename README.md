# tetris-game

docker-compose up --build -d

![image](https://github.com/user-attachments/assets/51d06cae-23bf-4a7d-aa45-ebd2edc030a6)

## 1. หลักการพัฒนา
### A. การจัดโครงสร้างโปรเจค (Project Structure)
```plaintext
tetris-game/                      # Root directory
│
├── frontend/                     # Frontend application
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── GameBoard.tsx     # แสดงบอร์ดเกม
│   │   │   ├── HighScores.tsx    # แสดงคะแนนสูงสุด
│   │   │   ├── NextPiece.tsx     # แสดงบล็อกถัดไป
│   │   │   ├── ScoreModal.tsx    # Modal บันทึกคะแนน
│   │   │   └── Auth.tsx          # ระบบ Google Sign-in
│   │   │
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useGameLogic.ts   # Game mechanics
│   │   │   └── useAuth.ts        # Authentication logic
│   │   │
│   │   ├── services/             # External services
│   │   │   └── api.ts            # GraphQL client
│   │   │
│   │   ├── config/               # Configurations
│   │   │   └── firebase.ts       # Firebase setup
│   │   │
│   │   ├── types.ts              # TypeScript types
│   │   ├── constants.ts          # Game constants
│   │   ├── App.tsx               # Main component
│   │   └── main.tsx              # Entry point
│   │
│   ├── .env                      # Environment variables
│   ├── index.html                # HTML template
│   ├── package.json              # Frontend dependencies
│   ├── tsconfig.json             # TypeScript config
│   └── vite.config.ts            # Vite configuration
│
├── backend/                      # Backend application
│   ├── src/
│   │   ├── index.ts              # Main entry & GraphQL server
│   │   └── db.ts                 # Database connection
│   │
│   ├── package.json              # Backend dependencies
│   └── tsconfig.json             # TypeScript config
│
└── docker-compose.yml            # Docker composition
```
### B. System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend (React + TypeScript)"
        Game[Game Component]
        Auth[Auth Component]
        Score[Score Component]
        GameLogic[Game Logic Hook]
        AuthHook[Auth Hook]
        APIService[API Service]
    end

    subgraph "Backend (Bun + Elysia + GraphQL)"
        GQLServer[GraphQL Server]
        DBConn[Database Connection]
        Resolvers[GraphQL Resolvers]
    end

    subgraph "Database (PostgreSQL)"
        DB[(Scores Table)]
    end

    subgraph "External Services"
        Firebase[Firebase Auth]
        IPApi[IP API]
        CountryApi[Country API]
        FlagCDN[Flag CDN]
    end

    %% Frontend Flow
    Game --> GameLogic
    Game --> Score
    Auth --> AuthHook
    Score --> APIService
    AuthHook --> Firebase
    APIService --> GQLServer

    %% Backend Flow
    GQLServer --> Resolvers
    Resolvers --> DBConn
    Resolvers --> IPApi
    Resolvers --> CountryApi
    DBConn --> DB

    %% Auth Flow
    AuthHook --> Firebase
    Firebase --> Google[Google OAuth]

    %% External API Flow
    Score --> FlagCDN

    style Game fill:#f9f,stroke:#333,stroke-width:2px
    style Firebase fill:#FFA000,stroke:#333,stroke-width:2px
    style DB fill:#336791,stroke:#333,stroke-width:2px
```

### C. Main Flow Sequence Diagram
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant FB as Firebase
    participant B as Backend
    participant DB as Database
    participant E as External APIs

    %% Authentication Flow
    U->>F: Click Sign In
    F->>FB: Request Google Sign In
    FB->>U: Google Login Page
    U->>FB: Authenticate
    FB->>F: Return User Info
    F->>F: Update Auth State

    %% Game Flow
    U->>F: Play Game
    F->>F: Update Game State
    F->>F: Calculate Score

    %% Score Submission
    U->>F: Game Over
    F->>E: Get IP Address
    E->>F: Return IP
    F->>B: Submit Score (GraphQL)
    B->>E: Get Country from IP
    E->>B: Return Country
    B->>DB: Save Score
    DB->>B: Return Result
    B->>F: Return Updated High Scores

    %% High Scores Display
    F->>B: Request High Scores
    B->>DB: Query Top 5 Scores
    DB->>B: Return Scores
    B->>F: Return Formatted Scores
    F->>E: Request Flag Icons
    E->>F: Return Flags
    F->>U: Display High Scores
```

## 2. API ที่สำคัญ
  
## 3. วิธี Deploy

## 4. About
<a href="https://grad.dpu.ac.th/" target="_blank">
    <img src="https://github.com/user-attachments/assets/d2b40ab8-9f43-4618-879c-3027e43c5dd5" alt="dpu" width="160" />
</a>
<a href="https://cite.dpu.ac.th/" target="_blank">
    <img src="https://github.com/user-attachments/assets/74eebfd7-722e-451b-8e2a-69804c2155ab" alt="cite" width="160" />
</a><br><br>
Source Code นี้เป็นส่วนหนึ่งของวิชา CT648 - วิศวกรรมเว็บและคลาวด์<br>
หลักสูตรวิศวกรรมศาสตรมหาบัณฑิต สาขาวิศวกรรมคอมพิวเตอร์<br>
วิทยาลัยวิศวกรรมศาสตร์และเทคโนโลยี มหาวิทยาลัยธุรกิจบัณฑิตย์<br>
นักศึกษา: ณัฐนนท์ แสงจันทร์ ID: 66130537<br>
<a href="https://cite.dpu.ac.th/ct/master-ct/research_chaiyaporn.html">
    <img src="https://github.com/user-attachments/assets/607199c1-9426-4ebd-89f6-a8bfe342f26f" alt="advisor" width="160" />
</a><br>
อาจารย์ที่ปรีกษา: ผู้ช่วยศาสตราจารย์ ดร.ชัยพร เขมะภาตะพันธ์<br>

