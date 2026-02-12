CREATE TABLE "roomType" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "roomType_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL
);
