# Tetris-game

![image](https://github.com/user-attachments/assets/76dd1cc6-4462-4644-9e0b-f09909ca19e1)

## 1. หลักการพัฒนา
เกม Tetris นี้ถูกพัฒนาขึ้นโดยใช้ Vite+React, TypeScript, Bun และ Elysia ในการพัฒนาโดยจุดสำคัญของเกม Tetris นี้มีดังนี้
### 1.1. ระบบเกม
#### 1. บล็อก Tetris
```plaintext
const TETROMINOES = {
  I, J, L, O, S, T, Z  // บล็อกพื้นฐาน 7 แบบ
};
```
ใช้ array ในการกำหนดรูปแบบของบล็อก Tetris แต่ละชนิด โดยตัวเลข 0 และ 1 แทนรูปร่างของบล็อก
โค้ดตัวอย่าง
```typescript
export const TETROMINOES: Record<TetrominoType, number[][][]> = {
  I: [
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]],
  ],
  J: [
    [[1, 0, 0], [1, 1, 1]],
    [[1, 1], [1, 0], [1, 0]],
    [[1, 1, 1], [0, 0, 1]],
    [[0, 1], [0, 1], [1, 1]],
  ],
  L: [
    [[0, 0, 1], [1, 1, 1]],
    [[1, 0], [1, 0], [1, 1]],
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1], [0, 1], [0, 1]],
  ],
  O: [
    [[1, 1], [1, 1]],
  ],
  S: [
    [[0, 1, 1], [1, 1, 0]],
    [[1, 0], [1, 1], [0, 1]],
  ],
  T: [
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0], [1, 1], [1, 0]],
    [[1, 1, 1], [0, 1, 0]],
    [[0, 1], [1, 1], [0, 1]],
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1], [1, 1], [1, 0]],
  ],
};
```
โดยที่:
  - 1 แทนส่วนที่มีบล็อก (แสดงเป็นสี)
  - 0 แทนส่วนที่ว่าง (โปร่งใส)
  - แต่ละบล็อกมีหลายแบบตามการหมุน
  - ชื่อของบล็อกมาจากรูปร่างที่คล้ายตัวอักษร I, J, L, O, S, T, Z

#### 2. การควบคุมการเคลื่อนที่ของบล็อก
##### 2.1 เลื่อนซ้าย/ขวา (moveLeft, moveRight)
```typescript
// การเลื่อนจะต้องเช็คว่าสามารถเลื่อนได้หรือไม่
const [y, x] = currentPiece.position;

// เลื่อนซ้าย: ลด x ลง 1
if (isValidMove(y, x - 1, pieceMatrix)) {
  setCurrentPiece({
    ...currentPiece,
    position: [y, x - 1]
  });
}

// เลื่อนขวา: เพิ่ม x ขึ้น 1
if (isValidMove(y, x + 1, pieceMatrix)) {
  setCurrentPiece({
    ...currentPiece,
    position: [y, x + 1]
  });
}
```
##### 2.2 เลื่อนลง (moveDown)
```typescript
// ถ้าเลื่อนลงได้: เพิ่ม y ขึ้น 1
if (isValidMove(y + 1, x, pieceMatrix)) {
  setCurrentPiece({
    ...currentPiece,
    position: [y + 1, x]
  });
} else {
  // ถ้าเลื่อนลงไม่ได้:
  // 1. ล็อคบล็อกไว้กับกระดาน
  // 2. เช็คแถวที่เต็ม
  // 3. สร้างบล็อกใหม่
  lockPiece();
  checkLines();
  spawnNewPiece();
}
```
##### 2.3 หมุน (rotate)
```typescript
// การหมุนจะเปลี่ยน rotation ไปเรื่อยๆ โดยใช้ modulo
const newRotation = (rotation + 1) % variations.length;

// ลองหมุนในตำแหน่งปัจจุบัน
if (isValidMove(y, x, newPieceMatrix)) {
  setCurrentPiece({
    ...currentPiece,
    rotation: newRotation
  });
  return;
}

// ถ้าหมุนไม่ได้ ลอง wall kick (เลื่อนออกจากกำแพง)
// ลองเลื่อนซ้าย
if (isValidMove(y, x - 1, newPieceMatrix)) {
  setCurrentPiece({
    ...currentPiece,
    position: [y, x - 1],
    rotation: newRotation
  });
  return;
}

// ลองเลื่อนขวา
if (isValidMove(y, x + 1, newPieceMatrix)) {
  setCurrentPiece({
    ...currentPiece,
    position: [y, x + 1],
    rotation: newRotation
  });
}
```
##### 2.4 Hard Drop (ทิ้งลงทันที)
```typescript
// หาตำแหน่งต่ำสุดที่บล็อกสามารถตกได้
let dropDistance = 0;
while (isValidMove(y + dropDistance + 1, x, pieceMatrix)) {
  dropDistance++;
}

// วางบล็อกที่ตำแหน่งต่ำสุด
const newY = y + dropDistance;

// ล็อคบล็อก
lockPiece(newY, x);

// เพิ่มคะแนนพิเศษตามระยะที่ตก
setScore(score + (dropDistance * 2));

// เช็คแถวและสร้างบล็อกใหม่
checkLines();
spawnNewPiece();
```

#### 3. การตรวจสอบการเคลื่อนที่ (isValidMove)
- ตรวจสอบขอบบอร์ด
- ตรวจสอบการชนกับบล็อกอื่น
```typescript
const isValidMove = (newY: number, newX: number, matrix: number[][]) => {
  // เช็คทุกช่องของบล็อก
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      if (matrix[y][x]) { // ถ้ามีบล็อกในตำแหน่งนี้
        // เช็คว่าอยู่นอกกระดานหรือไม่
        if (
          newY + y >= BOARD_HEIGHT || // เกินขอบล่าง
          newX + x < 0 ||            // เกินขอบซ้าย
          newX + x >= BOARD_WIDTH || // เกินขอบขวา
          (newY + y >= 0 && board[newY + y][newX + x].filled) // ชนบล็อกอื่น
        ) {
          return false;
        }
      }
    }
  }
  return true;
};
```

### 1.2. ระบบคะแนน
```plaintext
1. การให้คะแนน
- เคลียร์แถว: score += (lines * 100 * level)
- Hard Drop: score += ((dropDistance) * 2)

2. ระดับความยาก
- เพิ่มระดับ Level ทุก 10 แถว
```
### 1.3. จุดเด่นในการพัฒนา
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
1. React
- เป็นไลบรารี JavaScript สำหรับสร้างส่วนติดต่อผู้ใช้ (UI)
- ใช้สร้างหน้าเว็บแบบ Single Page Application โดยแบ่งหน้าเว็บเป็นส่วนๆ (Components) ทำให้จัดการง่าย

2. TypeScript
- คือภาษาโปรแกรมมิ่งที่เพิ่มระบบ Type เข้าไปใน JavaScript
- ใช้เพื่อช่วยลดข้อผิดพลาดในการเขียนโค้ด ทำให้เขียนโค้ดได้ปลอดภัยขึ้น และมีเครื่องมือช่วยเขียนโค้ดที่ดีกว่า

3. Vite
- คือเครื่องมือสำหรับพัฒนาและสร้างเว็บแอพ
- ช่วยทำให้การพัฒนาเว็บเร็วขึ้น มีระบบ hot reload และสร้างไฟล์สำหรับนำขึ้น production

4. Styled-components
- คือไลบรารีสำหรับเขียน CSS ใน JavaScript
- ช่วยจัดการสไตล์ของ component แต่ละตัว ทำให้สไตล์ไม่ปนกัน และสามารถเปลี่ยนสไตล์ตาม props ได้

// Authentication
1. Firebase Auth
- คือระบบยืนตัวตนของ Firebase
- ใช้จัดการการล็อกอินด้วย Google โดยไม่ต้องเขียนระบบเอง

2. Firebase SDK
- คือชุดเครื่องมือสำหรับใช้งาน Firebase
- ใช้เชื่อมต่อกับบริการต่างๆ ของ Firebase เช่น Authentication, Database

// API Communication
1. GraphQL API
- คือภาษาสำหรับเรียกข้อมูลจาก API
- ใช้ดึงข้อมูลจาก Backend โดยระบุข้อมูลที่ต้องการ

2. Fetch API
- คือ API มาตรฐานสำหรับเรียกข้อมูลผ่าน HTTP
- ใช้ส่งคำขอไปยังเซิร์ฟเวอร์ เช่น ดึง IP address ของผู้ใช้
```
#### 2. Backend + Database เทคโนโลยีที่ใช้
```plaintext
// Core Technologies
1. Bun
- คือตัวรันโค้ด JavaScript รุ่นใหม่
- ใช้รันโค้ด Backend ได้เร็วกว่า Node.js และมีฟีเจอร์ที่สะดวกกว่า

2. Elysia
- คือเฟรมเวิร์คสำหรับสร้าง Web Server บน Bun
- ใช้จัดการ HTTP requests และสร้าง API endpoints

3. TypeScript (Backend)
- คือภาษาโปรแกรมมิ่งที่เพิ่มระบบ Type เข้าไปใน JavaScript เหมือนที่ใช้ใน Frontend
- ทำให้โค้ด Backend มีความปลอดภัยและจัดการง่ายขึ้น

// API Layer
1. GraphQL
- คือภาษาสำหรับออกแบบ API
- ใช้สร้างจุดเชื่อมต่อเดียวที่ Frontend สามารถเรียกข้อมูลได้หลากหลายรูปแบบ

2. GraphQL Yoga
- คือเซิร์ฟเวอร์สำหรับรัน GraphQL
- ใช้จัดการคำขอ GraphQL และส่งข้อมูลกลับไปยัง Frontend

// Database
1. PostgreSQL
- คือเป็นฐานข้อมูลแบบ Relational
- ใช้สำหรับเก็บข้อมูลทั้งหมดของระบบ เช่น คะแนน ข้อมูลผู้เล่น
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
CREATE TABLE ns_scores (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  score INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  country_code VARCHAR(2) DEFAULT 'UN'
);
```

## 2. APIs ที่ใช้งาน

#### 1. getPlayerIP() : ทำหน้าที่ค้นหา Public IP Address ของผู้เล่น
**API:**
```
URL: https://api.ipify.org?format=json
```
**Return:**
```
{
  "ip": "Your IP Address"
}
```
**ตัวอย่าง Code:**
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
**API:**
```
URL: https://flagcdn.com/w40/${score.country_code.toLowerCase()}.png
```
**Return:**
```
รูปภาพธงชาติ  เช่น
countryCode = th
https://flagcdn.com/w40/th.png
countryCode = us
https://flagcdn.com/w40/us.png

```
**ตัวอย่าง Code:**
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
    <img src="https://github.com/user-attachments/assets/b0e1a401-48bf-42de-a0aa-2f389e5e33cb" alt="github" width="160"  />
</a><br>
