/*
  Warnings:

  - A unique constraint covering the columns `[week,year]` on the table `WeeklyStar` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `week` to the `WeeklyStar` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `WeeklyStar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WeeklyStar" ADD COLUMN     "week" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WeeklyStar_week_year_key" ON "WeeklyStar"("week", "year");
