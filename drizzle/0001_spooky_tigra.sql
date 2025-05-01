ALTER TABLE "users" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "users" CASCADE;--> statement-breakpoint
ALTER TABLE "chats" DROP CONSTRAINT "chats_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "messages" DROP CONSTRAINT "messages_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "chats" ADD COLUMN "user_id" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "chats" DROP COLUMN "userId";--> statement-breakpoint
ALTER TABLE "messages" DROP COLUMN "userId";