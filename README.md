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
│   │   │   └── ScoreModal.tsx    # Modal บันทึกคะแนน
│   │   │
│   │   ├── hooks/                # Custom React hooks
│   │   │   └── useGameLogic.ts   # Logic การเล่นเกม
│   │   │
│   │   ├── services/             # External services
│   │   │   └── api.ts            # API calls
│   │   │
│   │   ├── types.ts              # TypeScript type definitions
│   │   ├── constants.ts          # ค่าคงที่ต่างๆ
│   │   ├── App.tsx               # Main component
│   │   └── main.tsx              # Entry point
│   │
│   ├── index.html                # HTML template
│   ├── package.json              # Frontend dependencies
│   ├── tsconfig.json             # TypeScript config
│   └── vite.config.ts            # Vite configuration
│
├── backend/                      # Backend application
│   ├── src/
│   │   ├── index.ts              # Main entry point & GraphQL server
│   │   └── db.ts                 # Database connection & queries
│   │
│   ├── package.json              # Backend dependencies
│   └── tsconfig.json             # TypeScript config
│
└── docker-compose.yml            # Docker composition file
```

## 2. API ที่สำคัญ
  
## 3. วิธี Deploy

## 4. About
<a href="https://grad.dpu.ac.th/">
    <img src="https://github.com/user-attachments/assets/d2b40ab8-9f43-4618-879c-3027e43c5dd5" alt="dpu" width="160" />
</a>
<a href="https://cite.dpu.ac.th/">
    <img src="https://github.com/user-attachments/assets/74eebfd7-722e-451b-8e2a-69804c2155ab" alt="cite" width="160" />
</a><br><br>
Source Code นี้เป็นส่วนหนึ่งของวิชา CT648 - วิศวกรรมเว็บและคลาวด์<br>
หลักสูตรวิศวกรรมศาสตรมหาบัณฑิต สาขาวิศวกรรมคอมพิวเตอร์<br>
วิทยาลัยวิศวกรรมศาสตร์และเทคโนโลยี มหาวิทยาลัยธุรกิจบัณฑิตย์<br>
นักศึกษา: ณัฐนนท์ แสงจันทร์ ID: 66130537<br>
อาจารย์ที่ปรีกษา: ผู้ช่วยศาสตราจารย์ ดร.ชัยพร เขมะภาตะพันธ์<br>

