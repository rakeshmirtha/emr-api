import { pgTable, varchar, text, boolean, integer } from "drizzle-orm/pg-core";

export const visitClassificationTable = pgTable("visit_classification", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
});
