-- AlterTable
ALTER TABLE "TutorProfile" ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalSessionsCompleted" INTEGER NOT NULL DEFAULT 0;
