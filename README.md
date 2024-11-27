﻿# Tetris-game

![image](https://github.com/user-attachments/assets/76dd1cc6-4462-4644-9e0b-f09909ca19e1)

## 1. หลักการพัฒนา
เกม Tetris นี้ถูกพัฒนาขึ้นโดยใช้ Vite+React, TypeScript, Bun และ Elysia ในการพัฒนาโดยจุดสำคัญของเกม Tetris นี้มีดังนี้
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
- เพิ่มระดับ Level ทุก 10 แถว
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
│   │   │   ├── About.tsx         # แสดงหน้า about
│   │   │   ├── Auth.tsx          # ระบบ Google Sign-in
│   │   │   ├── GameBoard.tsx     # แสดงผลเกม
│   │   │   ├── HighScores.tsx    # แสดงคะแนนสูงสุด
│   │   │   ├── NextPiece.tsx     # แสดงบล็อกถัดไป
│   │   │   └── ScoreModal.tsx    # Modal บันทึกคะแนน
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
#### 1. getPlayerIP() : ทำหน้าที่ค้นหา Public IP Address ของผู้เล่น
API:
```
URL: https://api.ipify.org?format=json
```
Return:
```
{
  "ip": "Your IP Address"
}
```
ตัวอย่าง Code:
```typescript
const getPlayerIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return '0.0.0.0';
  }
};
```
#### 2. getFlagUrl(countryCode: string) : ทำหน้าที่ดึงรูปธงชาติโดยใช้ countryCode เช่น th, us
API:
```
URL: https://flagcdn.com/w40/${score.country_code.toLowerCase()}.png
```
Return:
```
รูปภาพธงชาติ  เช่น
countryCode = th
https://flagcdn.com/w40/th.png
countryCode = us
https://flagcdn.com/w40/us.png

```
ตัวอย่าง Code:
```typescript
<Flag 
  src={`https://flagcdn.com/w40/${score.country_code.toLowerCase()}.png`}
  alt={score.country_code}
  title={score.country_code}
  onError={(e) => {
    // ถ้าโหลดธงไม่สำเร็จ ใช้ธง UN แทน
    (e.target as HTMLImageElement).src = 'https://flagcdn.com/w40/un.png';
  }}
/>
```

### F. Firebase Authentication API คือ บริการที่ช่วยให้นักพัฒนาสามารถเพิ่มฟีเจอร์การยืนยันตัวตน (Authentication) ให้กับแอปพลิเคชันได้อย่างง่ายดายและปลอดภัย โดยรองรับหลายวิธีการล็อกอิน เช่น การใช้อีเมลและรหัสผ่าน, บัญชีโซเชียลมีเดีย เป็นต้น
#### โครงสร้าง FirebaseConfig
```typescript
interface FirebaseConfig {
  apiKey: string; // คีย์ API ที่ใช้สำหรับระบุและอนุญาตให้แอปของคุณเชื่อมต่อกับ Firebase
  authDomain: string; // โดเมนที่ใช้สำหรับ Firebase Authentication
  projectId: string; // รหัสโปรเจกต์ของ Firebase
  storageBucket: string; // URL ของ Google Cloud Storage ที่เชื่อมโยงกับ Firebase
  messagingId: int; // (น่าจะเป็น messagingSenderId) ใช้สำหรับ Firebase Cloud Messaging
  appId: string; // ID ที่ใช้ระบุแอปพลิเคชันใน Firebase
  measurementId: string; // (เลือกได้) ใช้สำหรับการติดตามข้อมูลผ่าน Google Analytics (สำหรับเว็บ)
}
```
#### ตัวอย่างค่าคอนฟิก FirebaseConfig
```typescript
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD***************XJKSz", // ตัวอย่างคีย์ API
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijk",
  measurementId: "G-ABCDEFGH"
};

// เริ่มต้น Firebase
const app = initializeApp(firebaseConfig);
```
_* Project นี้ใช้ .env เพื่อความปลอดภัยแทนการใส่ค่า firebaseConfig ในโค้ด_

#### ตัวอย่างโค้ดวิธีการใช้งาน Firebase Authentication API
```typescript
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';

  const signIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

```

## 3. Build & Deploy
### 1. Clone Project ใช้คำสั่ง
```sh
$ sudo git clone https://github.com/natnon007/tetris-game.git
```
### 2. ตั้งค่า Firebase Authentication
สร้างไฟล์ .env ใน ./tetris-game/frontend/ และเพิ่มข้อมูลลงในไฟล์ .env ดังนี้
```typescript
VITE_FIREBASE_API_KEY = YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN = YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID = YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET = YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID = YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID = YOUR_APP_ID
VITE_FIREBASE_MEASUREMENT_ID = YOUR_MEASUREMENT_ID
```
วิธีได้รับค่าจาก FIREBASE สำหรับใสในไฟล์ .env
```plaintext
1. ไปที่ https://console.firebase.google.com/
2. สร้างโปรเจคใหม่
3. ไปที่ Authentication -> Sign-in method
4. เปิดใช้งาน Google provider
5. เพิ่ม domain ที่อนุญาต (localhost สำหรับ development)
```
### 3. แก้ไขค่า VITE_BACKEND_URL ใน docker-compose.yml ใช้คำสั่ง (ข้ามข้อนี้ถ้าใช้ localhost)
```typescript
1. cd tetris-game/
2. sudo nano docker-compose.yml
3. ใส่ URL ของ Backend
4. ctrl+x, กด y เพื่อบันทึก
```
### 4. เริ่มการทำงาน ใช้คำสั่ง
```sh
$ sudo docker-compose up --build -d
```
### 5. กรณีหยุดการทำงาน ใช้คำสั่ง
```sh
$ sudo docker-compose down
```
หรือ
```sh
$ sudo docker-compose down -v
```

## Demo site
http://ec2-3-7-254-26.ap-south-1.compute.amazonaws.com:5173/

## About
<a href="https://grad.dpu.ac.th/" target="_blank">
    <img src="https://github.com/user-attachments/assets/d2b40ab8-9f43-4618-879c-3027e43c5dd5" alt="dpu" width="160" />
</a>
<a href="https://cite.dpu.ac.th/" target="_blank">
    <img src="https://github.com/user-attachments/assets/74eebfd7-722e-451b-8e2a-69804c2155ab" alt="cite" width="160" />
</a><br><br>
Project นี้เป็นส่วนหนึ่งของวิชา CT648 - วิศวกรรมเว็บและคลาวด์<br>
หลักสูตรวิศวกรรมศาสตรมหาบัณฑิต สาขาวิศวกรรมคอมพิวเตอร์<br>
วิทยาลัยวิศวกรรมศาสตร์และเทคโนโลยี มหาวิทยาลัยธุรกิจบัณฑิตย์<br>
นักศึกษาผู้พัฒนา: ณัฐนนท์ แสงจันทร์ ID: 66130537<br>
<a href="https://cite.dpu.ac.th/ct/master-ct/research_chaiyaporn.html" target="_blank">
    <img src="https://github.com/user-attachments/assets/607199c1-9426-4ebd-89f6-a8bfe342f26f" alt="advisor" width="160" />
</a><br>
อาจารย์ที่ปรีกษา: ผู้ช่วยศาสตราจารย์ ดร.ชัยพร เขมะภาตะพันธ์<br>
<a href="https://github.com/natnon007/tetris-game" target="_blank">
    <img src="https://github.com/user-attachments/assets/53b496c6-6244-4eb6-b209-84fdc9350df3" alt="github" width="100"  />
</a><br>
