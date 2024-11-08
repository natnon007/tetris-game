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

