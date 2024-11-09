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
![Tetris-System Architecture Diagram-2024-11-08-064000](https://github.com/user-attachments/assets/107bca38-43e6-4fdb-8f95-6eaff885cdf4)

### C. Main Flow Sequence Diagram
![Tetris-Main Flow Sequence Diagram-2024-11-08-064256](https://github.com/user-attachments/assets/cbd6beba-974f-44ab-a54c-7d727d79a442)

### A. การแบ่งส่วนการทำงาน (Separation of Concerns)
1. Frontend
```typescript
- Components/        // UI Components
  - GameBoard       // แสดงบอร์ดเกม
  - NextPiece       // แสดงบล็อกถัดไป
  - HighScores      // แสดงคะแนนสูงสุด
  - ScoreModal      // บันทึกคะแนน
  - Auth            // ระบบ Google Sign-in

- Hooks/            // Business Logic
  - useGameLogic    // Logic เกม
  - useAuth         // Logic Authentication

- Services/         // External Communications
  - api.ts         // GraphQL client

- Config/           // Configurations
  - firebase.ts    // Firebase setup
```

2. Backend
```typescript
- GraphQL Server    // API Endpoint
- Database Layer    // Data Persistence
- External Services // Third-party APIs
```

### B. State Management
```typescript
1. Game State:
- board: Cell[][]          // สถานะบอร์ด
- currentPiece: Piece      // บล็อกปัจจุบัน
- nextPiece: Piece        // บล็อกถัดไป
- score: number          // คะแนน
- level: number         // ระดับ

2. Auth State:
- user: User | null    // ข้อมูลผู้ใช้
- isAuthenticated: boolean
```

### C. Database Design
```sql
-- Scores Table
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  country_code VARCHAR(2) DEFAULT 'UN'
);

-- Indexes
CREATE INDEX idx_scores_ranking ON scores (score DESC, created_at ASC);
```

### D. Container Architecture
```yaml
services:
  frontend:  # React Application
  backend:   # GraphQL Server
  database:  # PostgreSQL
```

### E. Security
```typescript
1. Authentication:
- Google OAuth
- Firebase Auth

2. Data Validation:
- Input sanitization
- Type checking

3. Error Handling:
- Try-catch blocks
- Error boundaries
```

### F. Performance Optimization
```typescript
1. Frontend:
- Memoization
- Efficient re-rendering
- Asset optimization

2. Backend:
- Connection pooling
- Query optimization
- Caching strategies
```

## 2. API ที่สำคัญ
### A. Game Core APIs
```typescript
interface GameLogicAPI {
  // State
  board: Cell[][]
  score: number
  level: number
  gameOver: boolean
  
  // Actions
  startGame(): void
  moveDown(): void
  rotate(): void
  hardDrop(): void
}
```

### B. Authentication APIs
```typescript
interface AuthAPI {
  user: User | null
  signIn(): Promise<void>
  signOut(): Promise<void>
}
```

### C. GraphQL APIs
```graphql
# Queries
query GetHighScores {
  highScores(limit: Int): [Score!]!
}

# Mutations
mutation SubmitScore {
  submitScore(
    player_name: String!
    score: Int!
    ip: String!
  ): Score!
}
```

### D. Database APIs
```typescript
interface DatabaseAPI {
  getHighScores(limit: number): Promise<Score[]>
  insertScore(data: ScoreData): Promise<Score>
  updateRanks(): Promise<void>
}
```

### E. External Service APIs
```typescript
// IP & Location APIs
interface LocationAPI {
  getPlayerIP(): Promise<string>
  getCountryFromIP(ip: string): Promise<string>
}

// Flag CDN API
getFlagUrl(countryCode: string): string
```

### F. User Interface APIs
```typescript
// Component Props
interface GameBoardProps {
  board: Cell[][]
}

interface ScoreModalProps {
  score: number
  onSubmitted(): void
}
```

### G. Type Definitions
```typescript
interface Cell {
  type: TetrominoType | null
  filled: boolean
}

type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z'

interface Score {
  id: string
  player_name: string
  score: number
  rank: number
  country_code: string
}
```

### H. Firebase Config API
```typescript
interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  appId: string
}
```

### I. Error Handling APIs
```typescript
interface ErrorHandler {
  handleGameError(error: Error): void
  handleAuthError(error: Error): void
  handleAPIError(error: Error): void
}
```
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

