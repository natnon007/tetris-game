﻿# Tetris-game

docker-compose up --build -d

![image](https://github.com/user-attachments/assets/51d06cae-23bf-4a7d-aa45-ebd2edc030a6)

## 1. หลักการพัฒนา
เกม Tetris นี้ถูกพัฒนาขึ้นโดยใช้ React, TypeScript, Bun และ Elysia ในการพัฒนาโดยจุดสำคัญของเกม Tetris นี้มีดังนี้
### a. หัวใจสำคัญของเกม
```plaintext
1. บล็อก Tetris
const TETROMINOES = {
  I, J, L, O, S, T, Z  // บล็อกพื้นฐาน 7 แบบ
};

2. การเคลื่อนที่
- เลื่อนซ้าย/ขวา (moveLeft, moveRight)
- เลื่อนลง (moveDown)
- หมุน (rotate)
- Hard Drop (hardDrop)

3. ระบบตรวจสอบการชน
isValidMove(y: number, x: number, pieceMatrix: number[][]) 
- ตรวจสอบขอบบอร์ด
- ตรวจสอบการชนกับบล็อกอื่น
```
### b. ระบบคะแนน
```plaintext
1. การให้คะแนน
- เคลียร์แถว: score += (lines * 100 * level)
- Hard Drop: score += ((dropDistance) * 2)

2. ระดับความยาก
- เพิ่มระดับทุก 10 แถว
- ความเร็วเพิ่มตามระดับ
```
### c. จุดเด่นในการพัฒนา
```plaintext
1. แยกส่วนการทำงานระหว่าง Game Logic และ UI อย่างชัดเจนทำให้ง่ายต่อการทดสอบและบำรุงรักษา
2. แยก Game State และ Display State
3. ยืนยันตัวตนผ่าน Firebase ด้วย Google Sign-in
4. มีการเก็บประวัติคะแนนของผู้เล่น
5. แสดงคะแนนสูงสุด 5 อันดับ ทำให้รองรับการแข่งขันผ่านระบบ High Scores
6. มีการระบุประเทศของผู้เล่นโดยเก็บในรูปแบบ Country Code เช่น US, TH etc. ทำให้รองรับการแข่งขันในระดับประเทศ
7. รองรับการขยายระบบในอนาคต
```

### เทคโนโลยีที่ใช้ แบ่งออกเป็น 2 ส่วน ดังนี้
#### 1. Frontend เทคโนโลยีที่ใช้
```plaintext
// Core Technologies
- React                // JavaScript library สำหรับสร้าง UI
- TypeScript           // Typed JavaScript
- Vite                 // Build tool และ development server
- Styled-components    // CSS-in-JS library

// Authentication
- Firebase Auth        // ระบบ Google Sign-in
- Firebase SDK         // Firebase JavaScript SDK

// API Communication
- GraphQL API          // ใช้สื่อสารกับ Backend
- Fetch API            // เรียกใช้ External APIs
```
#### 2. Backend + Database เทคโนโลยีที่ใช้
```plaintext
// Core Technologies
- Bun                 // JavaScript runtime
- Elysia              // Web framework สำหรับ Bun
- TypeScript          // Type safety

// API Layer
- GraphQL             // Query language
- GraphQL Yoga        // GraphQL server implementation

// Database
- PostgreSQL          // Relational database
```

### โครงสร้างเกมและ Diagram
#### 1. โครงสร้างโปรเจค (Project Structure)
```plaintext
tetris-game/                      # Root directory
│
├── frontend/                     # Frontend application
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── GameBoard.tsx     # แสดงผลเกม
│   │   │   ├── HighScores.tsx    # แสดงคะแนนสูงสุด
│   │   │   ├── NextPiece.tsx     # แสดงบล็อกถัดไป
│   │   │   ├── ScoreModal.tsx    # Modal บันทึกคะแนน
│   │   │   └── Auth.tsx          # ระบบ Google Sign-in
│   │   │
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useGameLogic.ts   # Logic การเล่นเกม
│   │   │   └── useAuth.ts        # Authentication logic
│   │   │
│   │   ├── services/             # External services
│   │   │   └── api.ts            # GraphQL APIs + External APIs
│   │   │
│   │   ├── config/               # Configurations
│   │   │   └── firebase.ts       # Firebase setup
│   │   │
│   │   ├── types.ts              # TypeScript types
│   │   ├── constants.ts          # เก็บบล็อกพื้นฐานทั้ง 7 แบบ
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
#### 2. System Architecture Diagram
![Tetris-System Architecture Diagram-2024-11-08-064000](https://github.com/user-attachments/assets/107bca38-43e6-4fdb-8f95-6eaff885cdf4)

#### 3. Main Flow Sequence Diagram
![Tetris-Main Flow Sequence Diagram-2024-11-08-064256](https://github.com/user-attachments/assets/cbd6beba-974f-44ab-a54c-7d727d79a442)

#### 4. Database Design
```sql
-- Scores Table
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  country_code VARCHAR(2) DEFAULT 'UN'
);
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
  moveLeft(): void
  moveRight(): void
  moveDown(): void
  rotate(): void
  hardDrop(): void
  togglePause(): void
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
**Demo:** http://ec2-3-7-254-26.ap-south-1.compute.amazonaws.com:5173/

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

