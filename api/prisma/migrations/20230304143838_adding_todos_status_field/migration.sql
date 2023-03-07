/*
  Warnings:

  - Added the required column `status` to the `todos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "todos" ADD COLUMN     "status" BOOLEAN NOT NULL;
