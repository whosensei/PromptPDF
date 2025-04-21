import { relations } from "drizzle-orm";
import { pgTable ,serial, text, primaryKey,timestamp,varchar ,integer,pgEnum} from "drizzle-orm/pg-core"

export const userSystemEnum  = pgEnum("user_system_enum" ,["system","user"]); // enum restricts a variable to have predefined values

export const user = pgTable("users",{
    id : serial("id").primaryKey(),
    username:text("name").notNull(),
    email: text("email").notNull(),
    password : text("password").notNull()
})

export const chats = pgTable("chats" ,{
    id : serial("id").primaryKey(),   
    userId : integer("userId").references(()=>user.id).notNull(),  
    pdfName : text("pdf_name").notNull(),
    pdfUrl :text("pdf_url").notNull(),
    createdAt : timestamp("created_at").notNull().defaultNow(),
    filekey : text("file_key").notNull()
});

export const messages = pgTable("messages", {
    id : serial("id").primaryKey(),
    chatId : integer("chat_id").references(()=>chats.id).notNull(),
    userId : integer("userId").references(()=>user.id).notNull(),
    content : text("content").notNull(),
    createdAt : timestamp("created_at").notNull().defaultNow(),
    role : userSystemEnum("role").notNull()
});


export const userRelations = relations(user, ({many})=>({
    chats:many(chats)
}))

export const chatsRelations = relations(chats,({one, many})=>({
    User:one(user,{
        fields:[chats.userId],
        references:[user.id]
    }),
    messages:many(messages)
}))
