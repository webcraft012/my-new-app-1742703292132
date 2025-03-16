ALTER TABLE `editors` RENAME COLUMN "created_at" TO "createdAt";--> statement-breakpoint
ALTER TABLE `editors` RENAME COLUMN "updated_at" TO "updatedAt";--> statement-breakpoint
CREATE TABLE `applications` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`name` text NOT NULL,
	`repoUrl` text NOT NULL,
	`sandboxId` text,
	`description` text,
	`userId` text NOT NULL,
	`previewUrl` text,
	`sandboxProvider` text NOT NULL,
	`metadata` text,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer
);
