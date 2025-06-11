/*
  Warnings:

  - You are about to drop the column `youtubeUrl` on the `VideoReview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VideoReview" DROP COLUMN "youtubeUrl",
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "thumbnailUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "VideoReview_likes_idx" ON "VideoReview"("likes");
