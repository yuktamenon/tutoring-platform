-- CreateTable
CREATE TABLE "LearningPath" (
    "id" SERIAL NOT NULL,
    "fromSubjectId" INTEGER NOT NULL,
    "toSubjectId" INTEGER NOT NULL,

    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_fromSubjectId_toSubjectId_key" ON "LearningPath"("fromSubjectId", "toSubjectId");

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_fromSubjectId_fkey" FOREIGN KEY ("fromSubjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningPath" ADD CONSTRAINT "LearningPath_toSubjectId_fkey" FOREIGN KEY ("toSubjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
