PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_editors` (
	`id` text PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`state` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
INSERT INTO `__new_editors`("id", "name", "description", "state", "created_at", "updated_at") SELECT "id", "name", "description", "state", "created_at", "updated_at" FROM `editors`;--> statement-breakpoint
DROP TABLE `editors`;--> statement-breakpoint
ALTER TABLE `__new_editors` RENAME TO `editors`;--> statement-breakpoint
PRAGMA foreign_keys=ON;