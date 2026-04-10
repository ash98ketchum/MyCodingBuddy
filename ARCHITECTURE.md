# 🏛️ MyCodingBuddy Architecture Documentation

This document provides a visual representation of the MyCodingBuddy project's architecture, data model, and core logic.

---

## 🚀 1. System & Microservice Architecture
The system uses a decoupled, event-driven architecture to handle heavy code execution tasks without blocking the main API thread.

```mermaid
graph TD
    subgraph Frontend_Layer ["Client Side (React + Vite)"]
        UI["React SPA"]
        Monaco["Monaco Code Editor"]
        Zustand["Zustand State"]
    end

    subgraph API_Layer ["Backend API (Express.js)"]
        API["REST API Server"]
        Auth["JWT Auth Middleware"]
        Controllers["Request Controllers"]
    end

    subgraph Data_Layer ["Persistence & Messaging"]
        DB[(PostgreSQL + Prisma)]
        Redis[(Redis Cache & Queue)]
    end

    subgraph Worker_Layer ["Background Workers"]
        Worker["Judge Worker (Bull)"]
        Executor["Code Executor"]
    end

    subgraph External_Layer ["Code Execution Engine"]
        Judge0["Judge0 API / Self-Hosted"]
    end

    %% Connections
    UI <--> API
    API <--> DB
    API -- "Push Jobs" --> Redis
    Redis -- "Pull Jobs" --> Worker
    Worker <--> Judge0
    Worker -- "Update Status" --> DB
    API -- "Fetch Results" --> DB
```

---

## 📊 2. Entity Relationship Diagram (ERD)
The database is structured to support users, complex problem definitions, contests, and detailed submission tracking.

```mermaid
erDiagram
    USER ||--o{ SUBMISSION : "makes"
    USER ||--o{ PROBLEM : "creates"
    USER ||--o{ DISCUSSION : "posts"
    USER ||--o{ COMMENT : "writes"
    USER ||--o{ CONTEST_PARTICIPANT : "joins"
    
    PROBLEM ||--o{ TESTCASE : "defines"
    PROBLEM ||--o{ SUBMISSION : "has"
    PROBLEM ||--o{ CONTEST_PROBLEM : "included_in"
    PROBLEM ||--o{ DISCUSSION : "has_discussion"
    
    CONTEST ||--o{ CONTEST_PROBLEM : "contains"
    CONTEST ||--o{ CONTEST_PARTICIPANT : "has_members"
    CONTEST ||--o{ SUBMISSION : "manages"
    CONTEST ||--o{ CONTEST_ANNOUNCEMENT : "broadcasts"

    COLLEGE ||--o{ COLLEGE_ADMIN : "managed_by"
    COLLEGE ||--o{ COLLEGE_STUDENT : "enrolled"
    COLLEGE ||--o{ COLLEGE_PROBLEM : "assigned"
    
    USER {
        string id PK
        string username
        string email
        string password
        int rating
        string role
        boolean isPremium
    }

    PROBLEM {
        string id PK
        string title
        string slug
        string difficulty
        int rating
        string[] tags
        int timeLimit
        int memoryLimit
    }

    SUBMISSION {
        string id PK
        string userId FK
        string problemId FK
        string verdict
        int executionTime
        int memoryUsed
        int score
        json testResults
    }

    TESTCASE {
        string id PK
        string problemId FK
        string input
        string expectedOutput
        boolean isHidden
    }

    CONTEST {
        string id PK
        string title
        datetime startTime
        datetime endTime
        string status
    }
```

---

## 🔄 3. Code Submission Flow (Sequence)
Detailed flow showing the asynchronous lifecycle of a code submission.

```mermaid
sequenceDiagram
    participant User as 👤 Developer
    participant Frontend as 💻 UI (React)
    participant API as ⚙️ Backend API
    participant DB as 🗄️ PostgreSQL
    participant Redis as 🧠 Redis/Bull
    participant Worker as 👷 Background Worker
    participant J0 as 🚀 Judge0 API

    User->>Frontend: Clicks "Submit Code"
    Frontend->>API: POST /api/submissions {code, lang, problemId}
    API->>DB: Create Submission (Verdict: QUEUED)
    API->>Redis: Push Job {submissionId, ...}
    API-->>Frontend: 201 Created (submissionId)
    
    loop Polling
        Frontend->>API: GET /api/submissions/:id/status
        API->>DB: Check Verdict
        DB-->>API: Verdict: QUEUED / PENDING
        API-->>Frontend: {status: PENDING}
    end

    Note over Worker, Redis: Worker picks up job
    Worker->>J0: POST /submissions/batch
    J0-->>Worker: Batch Tokens
    
    loop Every 1.5s (Internal Polling)
        Worker->>J0: GET /submissions/batch/:tokens
        J0-->>Worker: Execution Results (Time, Memory, Stdout)
    end

    Worker->>Worker: Evaluate Results against TestCases
    Worker->>DB: Update Submission (Verdict, Score, Results)
    Worker->>DB: Update User Rating & Streak

    Frontend->>API: GET /api/submissions/:id/status
    API->>DB: Check Verdict
    DB-->>API: Verdict: ACCEPTED
    API-->>Frontend: {status: ACCEPTED, results: [...]}
    Frontend->>User: Show "Success" & Fireworks 🎆
```

---

## 🏗️ 4. UML Class Diagram (Backend Services)
Simplified representation of the core application logic structure.

```mermaid
classDiagram
    class AuthController {
        +register(req, res)
        +login(req, res)
        +logout(req, res)
    }

    class ProblemController {
        +getAllProblems(req, res)
        +getProblemById(req, res)
        +createProblem(req, res)
    }

    class SubmissionController {
        +submitCode(req, res)
        +getSubmissionStatus(req, res)
        +getLeaderboard(req, res)
    }

    class JudgeService {
        +addSubmissionToQueue(jobData)
        +submissionQueue: Queue
        +resultCheckQueue: Queue
    }

    class JudgeWorker {
        +processSubmission(job)
        +pollResults(job)
    }

    class PrismaClient {
        +user
        +problem
        +submission
        +contest
    }

    SubmissionController --> JudgeService : depends on
    JudgeService --> PrismaClient : uses
    JudgeWorker --> PrismaClient : updates
    AuthController --> PrismaClient : uses
    ProblemController --> PrismaClient : uses
```
