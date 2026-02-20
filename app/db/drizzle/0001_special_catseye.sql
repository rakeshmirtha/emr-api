CREATE TABLE "room" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"roomLocation" text NOT NULL,
	"roomTypeId" integer NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_roomTypeId_roomType_id_fk" FOREIGN KEY ("roomTypeId") REFERENCES "public"."roomType"("id") ON DELETE no action ON UPDATE no action;