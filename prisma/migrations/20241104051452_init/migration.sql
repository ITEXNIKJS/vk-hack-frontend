-- CreateEnum
CREATE TYPE "MESSAGE_TYPES" AS ENUM ('TEXT', 'IMAGE');

-- CreateEnum
CREATE TYPE "MESSAGE_SENDER" AS ENUM ('USER', 'AI');

-- CreateTable
CREATE TABLE "Chats" (
    "id" TEXT NOT NULL,
    "session_id" TEXT,
    "username" TEXT NOT NULL,
    "github_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "sender" "MESSAGE_SENDER" NOT NULL,
    "type" "MESSAGE_TYPES" NOT NULL,
    "chat_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chats_session_id_key" ON "Chats"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "Chats_github_url_key" ON "Chats"("github_url");

-- CreateIndex
CREATE INDEX "Chats_username_github_url_session_id_idx" ON "Chats"("username", "github_url", "session_id");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
