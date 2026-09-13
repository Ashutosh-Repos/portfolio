CREATE TABLE `gallery` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`cover_media_id` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`cover_media_id`) REFERENCES `media_item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `gallery_slug_unique` ON `gallery` (`slug`);--> statement-breakpoint
CREATE TABLE `gallery_item` (
	`id` text PRIMARY KEY NOT NULL,
	`gallery_id` text NOT NULL,
	`media_id` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`caption_override` text,
	FOREIGN KEY (`gallery_id`) REFERENCES `gallery`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media_item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `media_item` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`mime_type` text NOT NULL,
	`byte_size` integer NOT NULL,
	`width` integer,
	`height` integer,
	`blurhash` text,
	`alt_text` text,
	`caption` text,
	`storage_key` text NOT NULL,
	`public_url` text NOT NULL,
	`exif_json` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_item_storage_key_unique` ON `media_item` (`storage_key`);--> statement-breakpoint
CREATE TABLE `media_relation` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`media_id` text NOT NULL,
	`role` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`media_id`) REFERENCES `media_item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`headline` text NOT NULL,
	`bio` text NOT NULL,
	`current_focus` text,
	`location` text,
	`availability_status` text,
	`social_links_json` text,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `education` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`institution` text NOT NULL,
	`degree` text NOT NULL,
	`field_of_study` text NOT NULL,
	`grade_or_cgpa` text,
	`location` text,
	`start_date` text NOT NULL,
	`end_date` text,
	`is_current` integer DEFAULT false NOT NULL,
	`description` text,
	`highlights_json` text,
	`links_json` text,
	`logo_media_id` text,
	`gallery_id` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`logo_media_id`) REFERENCES `media_item`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`gallery_id`) REFERENCES `gallery`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `education_slug_unique` ON `education` (`slug`);--> statement-breakpoint
CREATE TABLE `experience` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`company` text NOT NULL,
	`role` text NOT NULL,
	`employment_type` text NOT NULL,
	`location` text,
	`location_type` text DEFAULT 'remote' NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`is_current` integer DEFAULT false NOT NULL,
	`description` text,
	`responsibilities_json` text,
	`achievements_json` text,
	`technologies_json` text,
	`story_markdown` text,
	`company_url` text,
	`logo_media_id` text,
	`logo_url` text,
	`gallery_id` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`logo_media_id`) REFERENCES `media_item`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`gallery_id`) REFERENCES `gallery`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `experience_slug_unique` ON `experience` (`slug`);--> statement-breakpoint
CREATE TABLE `external_activity_snapshot` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`metric_type` text NOT NULL,
	`payload_json` text NOT NULL,
	`synced_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `github_repo_snapshot` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`full_name` text NOT NULL,
	`description` text,
	`stars` integer DEFAULT 0 NOT NULL,
	`forks` integer DEFAULT 0 NOT NULL,
	`open_issues` integer DEFAULT 0 NOT NULL,
	`primary_language` text,
	`languages_json` text,
	`latest_commit_sha` text,
	`latest_commit_at` integer,
	`is_pinned` integer DEFAULT false NOT NULL,
	`repo_url` text NOT NULL,
	`homepage_url` text,
	`topics_json` text,
	`synced_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `github_repo_snapshot_full_name_unique` ON `github_repo_snapshot` (`full_name`);--> statement-breakpoint
CREATE TABLE `integration_provider` (
	`provider_key` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`account_identifier` text NOT NULL,
	`sync_frequency_hours` integer DEFAULT 6 NOT NULL,
	`last_synced_at` integer,
	`sync_status` text DEFAULT 'idle' NOT NULL,
	`last_error` text,
	`metadata_json` text
);
--> statement-breakpoint
CREATE TABLE `project` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`tagline` text NOT NULL,
	`description` text NOT NULL,
	`case_study_markdown` text,
	`status` text DEFAULT 'active' NOT NULL,
	`featured_priority` integer,
	`demo_url` text,
	`package_url` text,
	`github_repo_id` text,
	`override_github_data` integer DEFAULT false NOT NULL,
	`technologies_json` text,
	`architecture_json` text,
	`lessons_learned_markdown` text,
	`cover_media_id` text,
	`cover_image_url` text,
	`gallery_id` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`github_repo_id`) REFERENCES `github_repo_snapshot`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cover_media_id`) REFERENCES `media_item`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`gallery_id`) REFERENCES `gallery`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `project_slug_unique` ON `project` (`slug`);--> statement-breakpoint
CREATE TABLE `tag` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tag_name_unique` ON `tag` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `tag_slug_unique` ON `tag` (`slug`);--> statement-breakpoint
CREATE TABLE `writing` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`excerpt` text NOT NULL,
	`content_markdown` text NOT NULL,
	`type` text NOT NULL,
	`status` text DEFAULT 'published' NOT NULL,
	`published_at` integer,
	`updated_at` integer NOT NULL,
	`reading_time_minutes` integer DEFAULT 1 NOT NULL,
	`canonical_url` text,
	`cover_media_id` text,
	`cover_image_url` text,
	`gallery_id` text,
	`citations_json` text,
	`related_writing_ids_json` text,
	`tags_json` text,
	FOREIGN KEY (`cover_media_id`) REFERENCES `media_item`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`gallery_id`) REFERENCES `gallery`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `writing_slug_unique` ON `writing` (`slug`);--> statement-breakpoint
CREATE TABLE `writing_tag` (
	`writing_id` text NOT NULL,
	`tag_id` text NOT NULL,
	FOREIGN KEY (`writing_id`) REFERENCES `writing`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `achievement` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`issuer` text NOT NULL,
	`category` text NOT NULL,
	`date_awarded` text NOT NULL,
	`credential_url` text,
	`description` text,
	`media_id` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`media_id`) REFERENCES `media_item`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `achievement_slug_unique` ON `achievement` (`slug`);--> statement-breakpoint
CREATE TABLE `skill` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`proficiency_tier` text DEFAULT 'proficient' NOT NULL,
	`years_of_experience` integer,
	`icon_slug` text,
	`is_featured` integer DEFAULT false NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `skill_slug_unique` ON `skill` (`slug`);--> statement-breakpoint
CREATE TABLE `media_entry` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`type` text NOT NULL,
	`external_provider` text,
	`external_id` text,
	`title` text NOT NULL,
	`release_year` integer,
	`genres_json` text,
	`creators_json` text,
	`poster_url` text,
	`backdrop_url` text,
	`my_rating` real,
	`watch_status` text DEFAULT 'completed' NOT NULL,
	`consumed_at` text,
	`personal_review` text,
	`favorite_characters_json` text,
	`favorite_scenes_json` text,
	`quotes_json` text,
	`tier` text,
	`gallery_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`gallery_id`) REFERENCES `gallery`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `media_entry_slug_unique` ON `media_entry` (`slug`);