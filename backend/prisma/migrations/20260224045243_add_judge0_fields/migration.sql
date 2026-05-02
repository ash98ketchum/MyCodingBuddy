-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "compileOutput" TEXT,
ADD COLUMN     "judge0Token" TEXT,
ADD COLUMN     "stderr" TEXT,
ADD COLUMN     "stdout" TEXT;
