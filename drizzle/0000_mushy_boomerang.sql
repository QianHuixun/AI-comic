CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) DEFAULT '用户',
	"age" integer DEFAULT 0 NOT NULL,
	"email" varchar(255),
	"passWord" varchar(255) NOT NULL,
	"phoneNumber" varchar(11) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
