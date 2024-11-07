﻿# tetris-game

docker-compose up --build -d

![image](https://github.com/user-attachments/assets/ff8c5eb4-4904-43fa-8287-ef9c0d3d6747)


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
