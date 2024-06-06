/*
  Warnings:

  - You are about to drop the column `title` on the `Survey` table. All the data in the column will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_surveyId_fkey";

-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "title",
ADD COLUMN     "topic" VARCHAR(255) NOT NULL DEFAULT 'question';

-- DropTable
DROP TABLE "Question";

-- DropEnum
DROP TYPE "AnswerType";
