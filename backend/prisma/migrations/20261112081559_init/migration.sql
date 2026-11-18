/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `notificationsEnabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `telegramChatId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `telegramLinkedAt` on the `User` table. All the data in the column will be lost.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `CommandIdempotency` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InviteToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Obstacle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Robot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Simulation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Station` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Warehouse` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WarehouseMembership` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'VIEWER');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_actorId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_taskId_fkey";

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "InviteToken" DROP CONSTRAINT "InviteToken_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "Obstacle" DROP CONSTRAINT "Obstacle_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Robot" DROP CONSTRAINT "Robot_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "Simulation" DROP CONSTRAINT "Simulation_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "Station" DROP CONSTRAINT "Station_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_fromStationId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_robotId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_toStationId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_warehouseId_fkey";

-- DropForeignKey
ALTER TABLE "WarehouseMembership" DROP CONSTRAINT "WarehouseMembership_userId_fkey";

-- DropForeignKey
ALTER TABLE "WarehouseMembership" DROP CONSTRAINT "WarehouseMembership_warehouseId_fkey";

-- DropIndex
DROP INDEX "User_email_idx";

-- DropIndex
DROP INDEX "User_telegramChatId_key";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "notificationsEnabled",
DROP COLUMN "passwordHash",
DROP COLUMN "telegramChatId",
DROP COLUMN "telegramLinkedAt",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "CommandIdempotency";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "InviteToken";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Obstacle";

-- DropTable
DROP TABLE "RefreshToken";

-- DropTable
DROP TABLE "Robot";

-- DropTable
DROP TABLE "Simulation";

-- DropTable
DROP TABLE "Station";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "Warehouse";

-- DropTable
DROP TABLE "WarehouseMembership";

-- DropEnum
DROP TYPE "EventType";

-- DropEnum
DROP TYPE "RobotState";

-- DropEnum
DROP TYPE "SimulationStatus";

-- DropEnum
DROP TYPE "TaskStatus";

-- DropEnum
DROP TYPE "WarehouseRole";
