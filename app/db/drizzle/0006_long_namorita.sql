CREATE TABLE "clinician_schedule" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clinician_schedule_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"clinician_id" integer NOT NULL,
	"slot_in_minute" integer NOT NULL,
	"slot_from_date" varchar(10) NOT NULL,
	"slot_to_date" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clinician_slot" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "clinician_slot_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"schedule_id" integer NOT NULL,
	"rota_id" integer NOT NULL,
	"clinician_slot_date" varchar(10) NOT NULL,
	"clinician_slot_start_time" time NOT NULL,
	"clinician_slot_end_time" time NOT NULL,
	"slot_status" varchar(50) DEFAULT 'available' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointment_reason" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "appointment_reason" RENAME COLUMN "isDeleted" TO "is_deleted";--> statement-breakpoint
ALTER TABLE "appointment_status" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "appointment_status" RENAME COLUMN "isDeleted" TO "is_deleted";--> statement-breakpoint
ALTER TABLE "appointment_type" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "appointment_type" RENAME COLUMN "isDeleted" TO "is_deleted";--> statement-breakpoint
ALTER TABLE "clinicians" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "clinicians" RENAME COLUMN "isDeleted" TO "is_deleted";--> statement-breakpoint
ALTER TABLE "room_type" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "room_type" RENAME COLUMN "isDeleted" TO "is_deleted";--> statement-breakpoint
ALTER TABLE "room" RENAME COLUMN "roomLocation" TO "room_location";--> statement-breakpoint
ALTER TABLE "room" RENAME COLUMN "roomTypeId" TO "room_type_id";--> statement-breakpoint
ALTER TABLE "room" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "room" RENAME COLUMN "isDeleted" TO "is_deleted";--> statement-breakpoint
ALTER TABLE "rota_management" RENAME COLUMN "fromTime" TO "from_time";--> statement-breakpoint
ALTER TABLE "rota_management" RENAME COLUMN "toTime" TO "to_time";--> statement-breakpoint
ALTER TABLE "rota_management" RENAME COLUMN "isActive" TO "is_active";--> statement-breakpoint
ALTER TABLE "rota_management" RENAME COLUMN "isDeleted" TO "is_deleted";--> statement-breakpoint
ALTER TABLE "room" DROP CONSTRAINT "room_roomTypeId_room_type_id_fk";
--> statement-breakpoint
ALTER TABLE "appointment_mode" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "appointment_mode" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "clinician_schedule" ADD CONSTRAINT "clinician_schedule_clinician_id_clinicians_id_fk" FOREIGN KEY ("clinician_id") REFERENCES "public"."clinicians"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinician_slot" ADD CONSTRAINT "clinician_slot_schedule_id_clinician_schedule_id_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."clinician_schedule"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clinician_slot" ADD CONSTRAINT "clinician_slot_rota_id_rota_management_id_fk" FOREIGN KEY ("rota_id") REFERENCES "public"."rota_management"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "room" ADD CONSTRAINT "room_room_type_id_room_type_id_fk" FOREIGN KEY ("room_type_id") REFERENCES "public"."room_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_mode" DROP COLUMN "isActive";--> statement-breakpoint
ALTER TABLE "appointment_mode" DROP COLUMN "isDeleted";