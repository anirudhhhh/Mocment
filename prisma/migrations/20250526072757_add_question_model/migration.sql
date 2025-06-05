/*
  Warnings:

  - You are about to drop the column `category` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `thumbsDown` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `thumbsUp` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Reply` table. All the data in the column will be lost.
  - The `likes` column on the `Reply` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `declaredAt` on the `WeeklyStar` table. All the data in the column will be lost.
  - You are about to drop the column `week` on the `WeeklyStar` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `WeeklyStar` table. All the data in the column will be lost.
  - Added the required column `content` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Reply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Reply` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `WeeklyStar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "category",
DROP COLUMN "text",
DROP COLUMN "thumbsDown",
DROP COLUMN "thumbsUp",
ADD COLUMN     "categories" TEXT[],
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "showName" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Reply" DROP COLUMN "text",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "likes",
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WeeklyStar" DROP COLUMN "declaredAt",
DROP COLUMN "week",
DROP COLUMN "year",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "Question_userId_idx" ON "Question"("userId");

-- CreateIndex
CREATE INDEX "Reply_questionId_idx" ON "Reply"("questionId");

-- CreateIndex
CREATE INDEX "Reply_userId_idx" ON "Reply"("userId");
