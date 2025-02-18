import { pgTable ,serial, text, primaryKey,timestamp,varchar ,integer,pgEnum} from "drizzle-orm/pg-core"

export const userSystemEnum  = pgEnum("user_system_enum" ,["system","user"]); // enum restricts a variable to have predefined values

export const chats = pgTable("chats" ,{
    id : serial("id").primaryKey(),     //syntax -- type(name).attributes
    pdfName : text("pdf_name").notNull(),
    pdfUrl :text("pdf_url").notNull(),
    createdAt : timestamp("created_at").notNull().defaultNow(),
    userId : varchar("user_id", {length :256}).notNull(),
    filekey : text("file_key").notNull()
});

export const messages = pgTable("messages", {
    id : serial("id").primaryKey(),
    chatId : integer("chat_id").references(()=>chats.id).notNull(),
    content : text("content").notNull,
    createdAt : timestamp("created_at").notNull().defaultNow(),
    role : userSystemEnum("role").notNull()
});

