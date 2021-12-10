CREATE TABLE "questions" (
	"id" serial NOT NULL,
	"question" TEXT NOT NULL UNIQUE,
	"asked_by_id" integer NOT NULL,
	"submitted" timestamp with time zone NOT NULL DEFAULT 'now()',
	"score" integer NOT NULL DEFAULT '1',
	"answer" TEXT,
	"answered_by_id" integer,
	"answered_at" timestamp with time zone,
	CONSTRAINT "questions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "students" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL UNIQUE,
	"class_id" integer NOT NULL,
	"token" uuid NOT NULL UNIQUE,
	CONSTRAINT "students_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "classes" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL UNIQUE,
	CONSTRAINT "classes_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "tags" (
	"id" serial NOT NULL,
	"name" varchar(255) NOT NULL UNIQUE,
	CONSTRAINT "tags_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "questions_and_tags" (
	"id" serial NOT NULL,
	"question_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "questions_and_tags_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



ALTER TABLE "questions" ADD CONSTRAINT "questions_fk0" FOREIGN KEY ("student_id") REFERENCES "students"("id");
ALTER TABLE "questions" ADD CONSTRAINT "questions_fk1" FOREIGN KEY ("answered_by_id") REFERENCES "students"("id");

ALTER TABLE "questions" ADD CONSTRAINT "questions_ck0" CHECK ("asked_by_id" <> "answered_by_id");

ALTER TABLE "students" ADD CONSTRAINT "students_fk0" FOREIGN KEY ("class_id") REFERENCES "classes"("id");

ALTER TABLE "questions_and_tags" ADD CONSTRAINT "questions_and_tags_fk0" FOREIGN KEY ("question_od") REFERENCES "questions"("id");
ALTER TABLE "questions_and_tags" ADD CONSTRAINT "questions_and_tags_fk1" FOREIGN KEY ("tag_id") REFERENCES "tags"("id");
