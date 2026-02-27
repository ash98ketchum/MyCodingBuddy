-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('JAVASCRIPT', 'PYTHON', 'JAVA', 'CPP', 'C');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('FREE', 'PREMIUM', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Verdict" AS ENUM ('PENDING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILATION_ERROR');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'EXPIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fullName" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "planType" "PlanType" NOT NULL DEFAULT 'FREE',
    "rating" INTEGER,
    "streak" INTEGER,
    "lastSolvedAt" TIMESTAMP(3),
    "avatar" TEXT,
    "bio" TEXT,
    "country" TEXT,
    "organization" TEXT,
    "githubUrl" TEXT,
    "linkedinUrl" TEXT,
    "websiteUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "premiumExpiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Problem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 1200,
    "tags" TEXT[],
    "sampleInput" TEXT NOT NULL,
    "sampleOutput" TEXT NOT NULL,
    "explanation" TEXT,
    "constraints" TEXT,
    "timeLimit" INTEGER NOT NULL DEFAULT 2000,
    "memoryLimit" INTEGER NOT NULL DEFAULT 256,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "acceptedCount" INTEGER NOT NULL DEFAULT 0,
    "submissionCount" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestCase" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "isSample" BOOLEAN NOT NULL DEFAULT false,
    "points" INTEGER NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "contestId" TEXT,
    "code" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "verdict" "Verdict" NOT NULL DEFAULT 'PENDING',
    "executionTime" INTEGER,
    "memoryUsed" INTEGER,
    "score" INTEGER NOT NULL DEFAULT 0,
    "testCasesPassed" INTEGER NOT NULL DEFAULT 0,
    "totalTestCases" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "testResults" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "ratingChange" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContestProblem" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 100,

    CONSTRAINT "ContestProblem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContestParticipant" (
    "id" TEXT NOT NULL,
    "contestId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "penalty" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "ratingChange" INTEGER NOT NULL DEFAULT 0,
    "problemsSolved" INTEGER NOT NULL DEFAULT 0,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContestParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discussion" (
    "id" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discussion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "discussionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "discussionId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "planType" "PlanType" NOT NULL,
    "transactionId" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramStudent" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "programId" TEXT NOT NULL DEFAULT 'COLLEGE_2026',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyAssignment" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "College" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "College_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegeAdmin" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollegeAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegeProblem" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollegeProblem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegeStudent" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "section" TEXT,
    "rollNumber" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollegeStudent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegeAssignment" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),

    CONSTRAINT "CollegeAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegeSubmissionAnalytics" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "problemId" TEXT NOT NULL,
    "submissionId" TEXT,
    "isAccepted" BOOLEAN NOT NULL DEFAULT false,
    "executionTime" INTEGER,
    "memoryUsed" INTEGER,
    "attemptCount" INTEGER NOT NULL DEFAULT 1,
    "codeQuality" TEXT,
    "approachRating" TEXT,
    "cheatingFlag" BOOLEAN NOT NULL DEFAULT false,
    "tabSwitches" INTEGER NOT NULL DEFAULT 0,
    "pastedCode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollegeSubmissionAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentAnalytics" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "totalSolved" INTEGER NOT NULL DEFAULT 0,
    "totalAttempts" INTEGER NOT NULL DEFAULT 0,
    "avgSolveTime" INTEGER NOT NULL DEFAULT 0,
    "difficultyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "consistencyScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "attemptEfficiency" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "plagiarismCount" INTEGER NOT NULL DEFAULT 0,
    "integrityScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "lastActiveAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIStudentReport" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "strengths" TEXT[],
    "weaknesses" TEXT[],
    "improvementPlan" TEXT NOT NULL,
    "recommendedDiff" "Difficulty" NOT NULL DEFAULT 'EASY',
    "integrityContext" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIStudentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollegeInvitation" (
    "id" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CollegeInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_rating_idx" ON "User"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "Problem_slug_key" ON "Problem"("slug");

-- CreateIndex
CREATE INDEX "Problem_difficulty_idx" ON "Problem"("difficulty");

-- CreateIndex
CREATE INDEX "Problem_rating_idx" ON "Problem"("rating");

-- CreateIndex
CREATE INDEX "Problem_createdById_idx" ON "Problem"("createdById");

-- CreateIndex
CREATE INDEX "TestCase_problemId_idx" ON "TestCase"("problemId");

-- CreateIndex
CREATE INDEX "Submission_userId_createdAt_idx" ON "Submission"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Submission_problemId_idx" ON "Submission"("problemId");

-- CreateIndex
CREATE INDEX "Submission_contestId_idx" ON "Submission"("contestId");

-- CreateIndex
CREATE INDEX "Submission_verdict_idx" ON "Submission"("verdict");

-- CreateIndex
CREATE UNIQUE INDEX "Contest_slug_key" ON "Contest"("slug");

-- CreateIndex
CREATE INDEX "Contest_startTime_idx" ON "Contest"("startTime");

-- CreateIndex
CREATE INDEX "Contest_slug_idx" ON "Contest"("slug");

-- CreateIndex
CREATE INDEX "ContestProblem_contestId_idx" ON "ContestProblem"("contestId");

-- CreateIndex
CREATE UNIQUE INDEX "ContestProblem_contestId_problemId_key" ON "ContestProblem"("contestId", "problemId");

-- CreateIndex
CREATE INDEX "ContestParticipant_contestId_score_idx" ON "ContestParticipant"("contestId", "score");

-- CreateIndex
CREATE UNIQUE INDEX "ContestParticipant_contestId_userId_key" ON "ContestParticipant"("contestId", "userId");

-- CreateIndex
CREATE INDEX "Discussion_userId_idx" ON "Discussion"("userId");

-- CreateIndex
CREATE INDEX "Discussion_problemId_idx" ON "Discussion"("problemId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_discussionId_idx" ON "Comment"("discussionId");

-- CreateIndex
CREATE INDEX "Vote_discussionId_idx" ON "Vote"("discussionId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_discussionId_key" ON "Vote"("userId", "discussionId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_transactionId_idx" ON "Payment"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramStudent_email_key" ON "ProgramStudent"("email");

-- CreateIndex
CREATE INDEX "ProgramStudent_email_idx" ON "ProgramStudent"("email");

-- CreateIndex
CREATE INDEX "ProgramStudent_programId_idx" ON "ProgramStudent"("programId");

-- CreateIndex
CREATE INDEX "DailyAssignment_programId_idx" ON "DailyAssignment"("programId");

-- CreateIndex
CREATE INDEX "DailyAssignment_studentId_idx" ON "DailyAssignment"("studentId");

-- CreateIndex
CREATE INDEX "DailyAssignment_problemId_idx" ON "DailyAssignment"("problemId");

-- CreateIndex
CREATE INDEX "DailyAssignment_date_idx" ON "DailyAssignment"("date");

-- CreateIndex
CREATE UNIQUE INDEX "College_domain_key" ON "College"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "CollegeAdmin_userId_key" ON "CollegeAdmin"("userId");

-- CreateIndex
CREATE INDEX "CollegeAdmin_collegeId_idx" ON "CollegeAdmin"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "CollegeProblem_collegeId_problemId_key" ON "CollegeProblem"("collegeId", "problemId");

-- CreateIndex
CREATE UNIQUE INDEX "CollegeStudent_email_key" ON "CollegeStudent"("email");

-- CreateIndex
CREATE INDEX "CollegeStudent_collegeId_idx" ON "CollegeStudent"("collegeId");

-- CreateIndex
CREATE INDEX "CollegeStudent_email_idx" ON "CollegeStudent"("email");

-- CreateIndex
CREATE INDEX "CollegeAssignment_collegeId_idx" ON "CollegeAssignment"("collegeId");

-- CreateIndex
CREATE INDEX "CollegeAssignment_studentId_idx" ON "CollegeAssignment"("studentId");

-- CreateIndex
CREATE INDEX "CollegeAssignment_problemId_idx" ON "CollegeAssignment"("problemId");

-- CreateIndex
CREATE INDEX "CollegeSubmissionAnalytics_studentId_idx" ON "CollegeSubmissionAnalytics"("studentId");

-- CreateIndex
CREATE INDEX "CollegeSubmissionAnalytics_problemId_idx" ON "CollegeSubmissionAnalytics"("problemId");

-- CreateIndex
CREATE INDEX "CollegeSubmissionAnalytics_isAccepted_idx" ON "CollegeSubmissionAnalytics"("isAccepted");

-- CreateIndex
CREATE UNIQUE INDEX "StudentAnalytics_studentId_key" ON "StudentAnalytics"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "AIStudentReport_studentId_key" ON "AIStudentReport"("studentId");

-- CreateIndex
CREATE UNIQUE INDEX "CollegeInvitation_token_key" ON "CollegeInvitation"("token");

-- CreateIndex
CREATE INDEX "CollegeInvitation_collegeId_idx" ON "CollegeInvitation"("collegeId");

-- CreateIndex
CREATE INDEX "CollegeInvitation_email_idx" ON "CollegeInvitation"("email");

-- CreateIndex
CREATE INDEX "CollegeInvitation_token_idx" ON "CollegeInvitation"("token");

-- AddForeignKey
ALTER TABLE "Problem" ADD CONSTRAINT "Problem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestProblem" ADD CONSTRAINT "ContestProblem_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestProblem" ADD CONSTRAINT "ContestProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestParticipant" ADD CONSTRAINT "ContestParticipant_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "Contest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestParticipant" ADD CONSTRAINT "ContestParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_discussionId_fkey" FOREIGN KEY ("discussionId") REFERENCES "Discussion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyAssignment" ADD CONSTRAINT "DailyAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "ProgramStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyAssignment" ADD CONSTRAINT "DailyAssignment_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeAdmin" ADD CONSTRAINT "CollegeAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeAdmin" ADD CONSTRAINT "CollegeAdmin_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeProblem" ADD CONSTRAINT "CollegeProblem_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeProblem" ADD CONSTRAINT "CollegeProblem_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeStudent" ADD CONSTRAINT "CollegeStudent_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeAssignment" ADD CONSTRAINT "CollegeAssignment_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeAssignment" ADD CONSTRAINT "CollegeAssignment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "CollegeStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeSubmissionAnalytics" ADD CONSTRAINT "CollegeSubmissionAnalytics_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "CollegeStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentAnalytics" ADD CONSTRAINT "StudentAnalytics_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "CollegeStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIStudentReport" ADD CONSTRAINT "AIStudentReport_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "CollegeStudent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollegeInvitation" ADD CONSTRAINT "CollegeInvitation_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE CASCADE ON UPDATE CASCADE;
