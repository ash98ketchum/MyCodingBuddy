CREATE MATERIALIZED VIEW college_student_summary AS
SELECT
  cs."id" AS student_id,
  cs."collegeId" AS college_id,
  COUNT(csa."id") FILTER (WHERE csa."isAccepted" = true) AS total_solved,
  COUNT(csa."id") AS total_attempts,
  AVG(csa."executionTime") AS avg_execution_time,
  MAX(csa."createdAt") AS last_active_at
FROM "CollegeStudent" cs
LEFT JOIN "CollegeSubmissionAnalytics" csa ON csa."studentId" = cs."id"
GROUP BY cs."id", cs."collegeId";

CREATE UNIQUE INDEX ON college_student_summary (student_id);