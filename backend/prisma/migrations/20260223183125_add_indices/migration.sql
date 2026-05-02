-- CreateIndex
CREATE INDEX "CollegeAssignment_collegeId_studentId_status_idx" ON "CollegeAssignment"("collegeId", "studentId", "status");

-- CreateIndex
CREATE INDEX "CollegeStudent_collegeId_email_idx" ON "CollegeStudent"("collegeId", "email");

-- CreateIndex
CREATE INDEX "CollegeSubmissionAnalytics_studentId_isAccepted_idx" ON "CollegeSubmissionAnalytics"("studentId", "isAccepted");

-- CreateIndex
CREATE INDEX "CollegeSubmissionAnalytics_problemId_studentId_idx" ON "CollegeSubmissionAnalytics"("problemId", "studentId");
