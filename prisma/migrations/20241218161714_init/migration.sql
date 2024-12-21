-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('3구', '4구');

-- CreateTable
CREATE TABLE "bi_user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phonenum" VARCHAR(20),
    "userAbility" INTEGER NOT NULL,
    "preferGame" "GameType" NOT NULL DEFAULT '4구',
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoutAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bi_game" (
    "id" SERIAL NOT NULL,
    "gameType" "GameType" NOT NULL,
    "description" TEXT,
    "gameAverage" TEXT,
    "gameHighrun" INTEGER NOT NULL,
    "gameInning" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bi_club" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "userId" INTEGER NOT NULL,
    "isPossible" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_club_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bi_clubmember" (
    "clubId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_clubmember_pkey" PRIMARY KEY ("clubId","userId")
);

-- CreateTable
CREATE TABLE "bi_location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "phone" VARCHAR(20),
    "timeStart" TIMESTAMP(3) NOT NULL,
    "timeEnd" TIMESTAMP(3) NOT NULL,
    "threeBall" INTEGER NOT NULL,
    "fourBall" INTEGER NOT NULL,
    "tableType" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bi_user_email_key" ON "bi_user"("email");

-- AddForeignKey
ALTER TABLE "bi_club" ADD CONSTRAINT "bi_club_userId_fkey" FOREIGN KEY ("userId") REFERENCES "bi_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bi_clubmember" ADD CONSTRAINT "bi_clubmember_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "bi_club"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bi_clubmember" ADD CONSTRAINT "bi_clubmember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "bi_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
