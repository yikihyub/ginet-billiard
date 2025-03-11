-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "ownerdb";

-- CreateEnum
CREATE TYPE "public"."GameType" AS ENUM ('3구', '4구');

-- CreateEnum
CREATE TYPE "public"."game_type_enum" AS ENUM ('THREE_BALL', 'FOUR_BALL', 'POCKET_BALL');

-- CreateEnum
CREATE TYPE "public"."match_request_type_enum" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."match_status" AS ENUM ('PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'EVALUATE', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."match_status_enum" AS ENUM ('COMPLETED', 'ONGOING', 'CANCELED');

-- CreateEnum
CREATE TYPE "public"."request_status" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "public"."MatchType" AS ENUM ('ONE_VS_ONE', 'TWO_VS_TWO');

-- CreateTable
CREATE TABLE "public"."bi_user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255),
    "phonenum" VARCHAR(20),
    "preferGame" "public"."GameType" NOT NULL DEFAULT '4구',
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoutAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address" VARCHAR,
    "agree_location" BOOLEAN NOT NULL DEFAULT false,
    "agree_marketing" BOOLEAN,
    "agree_marketing_privacy" BOOLEAN,
    "agree_privacy" BOOLEAN NOT NULL DEFAULT false,
    "agree_terms" BOOLEAN NOT NULL DEFAULT false,
    "agreed_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "favorite_store_ids" INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    "latitude" REAL,
    "location" TEXT,
    "longitude" REAL,
    "mb_id" VARCHAR,
    "mb_login_ip" VARCHAR,
    "mb_memo_cnt" INTEGER,
    "mb_today_login" DATE,
    "play_style" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferred_age_group" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferred_gender" TEXT NOT NULL DEFAULT '',
    "preferred_skill_level" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferred_time" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "profile_image" VARCHAR(255),
    "provider" VARCHAR(20),
    "push_auth" TEXT,
    "push_enabled" BOOLEAN DEFAULT false,
    "push_endpoint" TEXT,
    "push_p256dh" TEXT,
    "social_id" VARCHAR(100),
    "user_four_ability" INTEGER,
    "user_three_ability" INTEGER NOT NULL,

    CONSTRAINT "bi_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bi_game" (
    "id" SERIAL NOT NULL,
    "gameType" "public"."GameType" NOT NULL,
    "description" TEXT,
    "gameAverage" TEXT,
    "gameHighrun" INTEGER NOT NULL,
    "gameInning" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bi_club" (
    "club_contact_email" VARCHAR(100),
    "club_contact_phone" VARCHAR(20),
    "club_created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "club_description" TEXT,
    "club_founding_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "club_id" SERIAL NOT NULL,
    "club_location" VARCHAR(100) NOT NULL,
    "club_max_members" INTEGER DEFAULT 50,
    "club_name" VARCHAR(100) NOT NULL,
    "club_now_members" INTEGER DEFAULT 1,
    "club_owner_id" VARCHAR NOT NULL,
    "club_place_address" TEXT,
    "club_place_name" VARCHAR(100),
    "club_regular_day" VARCHAR(50),
    "club_rules" TEXT[],
    "club_type" VARCHAR,
    "club_updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_club_pkey" PRIMARY KEY ("club_id")
);

-- CreateTable
CREATE TABLE "public"."bi_location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "phone" VARCHAR(20),
    "timeStart" TIMESTAMP(3) NOT NULL,
    "timeEnd" TIMESTAMP(3) NOT NULL,
    "threeBall" INTEGER NOT NULL,
    "fourBall" INTEGER NOT NULL,
    "tableType" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ownerdb"."bi_admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "last_login" TIMESTAMP(6),

    CONSTRAINT "bi_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ownerdb"."bi_maintenance_record" (
    "id" SERIAL NOT NULL,
    "table_id" INTEGER NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "checked_by" TEXT NOT NULL,

    CONSTRAINT "bi_maintenance_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ownerdb"."bi_member" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "join_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "visits" INTEGER DEFAULT 0,
    "total_spent" INTEGER DEFAULT 0,
    "point" INTEGER DEFAULT 0,
    "last_visit" TIMESTAMP(6),

    CONSTRAINT "bi_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ownerdb"."bi_reservations" (
    "id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "table_number" INTEGER NOT NULL,
    "customer_name" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "reservation_date" DATE NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
    "status" VARCHAR(20) DEFAULT 'confirmed',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "bi_id" VARCHAR,

    CONSTRAINT "bi_reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ownerdb"."bi_setting" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ownerdb"."bi_store" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "business_no" TEXT,
    "owner_name" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "open_time" TEXT,
    "close_time" TEXT,
    "comment" VARCHAR,
    "hourly_rate" INTEGER,
    "per_minute" INTEGER,
    "least_rate" INTEGER,
    "open_yoil" TEXT,
    "bi_id" VARCHAR,
    "has_table" INTEGER,
    "directions" VARCHAR,
    "parking_type" VARCHAR,
    "parking_capacity" INTEGER,
    "parking_note" VARCHAR,
    "weekend_rate" INTEGER,
    "brand" VARCHAR,
    "facilities" VARCHAR,
    "saturday_open" VARCHAR,
    "saturday_close" VARCHAR,
    "sunday_open" VARCHAR,
    "sunday_close" VARCHAR,
    "regular_holiday" TEXT,
    "created_at" DATE,
    "updated_at" DATE,
    "phone_store" VARCHAR,
    "coord_x" VARCHAR,
    "coord_y" VARCHAR,
    "register_id" VARCHAR,
    "geom" geometry,

    CONSTRAINT "bi_store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ownerdb"."bi_table" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "hourly_rate" INTEGER NOT NULL,
    "bi_id" VARCHAR NOT NULL,
    "table_no" INTEGER,
    "x" DOUBLE PRECISION DEFAULT 50,
    "y" DOUBLE PRECISION DEFAULT 50,
    "width" DOUBLE PRECISION DEFAULT 120,
    "height" DOUBLE PRECISION DEFAULT 60,
    "rotation" INTEGER,

    CONSTRAINT "bi_table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ownerdb"."bi_usage_history" (
    "id" SERIAL NOT NULL,
    "member_id" INTEGER NOT NULL,
    "table_id" INTEGER NOT NULL,
    "date" TIMESTAMP(6) NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "bi_usage_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bi_match" (
    "match_id" SERIAL NOT NULL,
    "player1_id" VARCHAR,
    "player2_id" VARCHAR,
    "match_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "location" VARCHAR(255),
    "player1_score" INTEGER,
    "player2_score" INTEGER,
    "winner_id" VARCHAR,
    "loser_id" VARCHAR,
    "player1_dama" DECIMAL(5,2),
    "player2_dama" DECIMAL(5,2),
    "match_duration" INTEGER,
    "request_status" "public"."request_status",
    "request_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "response_date" TIMESTAMP(6),
    "preferred_date" TIMESTAMP(6),
    "message" VARCHAR(500),
    "cancel_reason" VARCHAR(200),
    "cancelled_by" VARCHAR,
    "is_notified" BOOLEAN DEFAULT false,
    "notification_date" TIMESTAMP(6),
    "match_status" "public"."match_status" DEFAULT 'PENDING',
    "game_type" "public"."game_type_enum",

    CONSTRAINT "matches_pkey" PRIMARY KEY ("match_id")
);

-- CreateTable
CREATE TABLE "public"."bi_match_request" (
    "request_id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "requester_id" VARCHAR NOT NULL,
    "recipient_id" VARCHAR NOT NULL,
    "request_status" VARCHAR(10) DEFAULT 'PENDING',
    "request_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "response_date" TIMESTAMP(6),
    "preferred_date" TIMESTAMP(6),
    "message" VARCHAR(500),
    "game_type" VARCHAR(10),
    "location" VARCHAR(255),
    "is_notified" BOOLEAN DEFAULT false,

    CONSTRAINT "bi_match_request_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "public"."bi_match_dispute" (
    "dispute_id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "reporter_id" VARCHAR NOT NULL,
    "dispute_type" VARCHAR(50),
    "description" TEXT,
    "evidence_urls" TEXT[],
    "status" VARCHAR(20) DEFAULT 'PENDING',
    "resolved_by" VARCHAR,
    "resolved_at" TIMESTAMP(6),
    "resolution_note" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_match_dispute_pkey" PRIMARY KEY ("dispute_id")
);

-- CreateTable
CREATE TABLE "public"."bi_match_evaluation" (
    "evaluation_id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "evaluator_id" VARCHAR NOT NULL,
    "target_id" VARCHAR NOT NULL,
    "manner_rating" INTEGER,
    "skill_rating" INTEGER,
    "skill_accuracy_rating" INTEGER,
    "comment" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "is_anonymous" BOOLEAN DEFAULT false,
    "reported" BOOLEAN DEFAULT false,

    CONSTRAINT "bi_match_evaluation_pkey" PRIMARY KEY ("evaluation_id")
);

-- CreateTable
CREATE TABLE "public"."bi_match_result" (
    "result_id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "winner_id" VARCHAR NOT NULL,
    "loser_id" VARCHAR NOT NULL,
    "winner_score" INTEGER NOT NULL,
    "loser_score" INTEGER NOT NULL,
    "game_duration" INTEGER,
    "verified_by" VARCHAR(20) DEFAULT 'PENDING',
    "verified_at" TIMESTAMP(6),
    "owner_id" VARCHAR,
    "player1_confirm" BOOLEAN DEFAULT false,
    "player2_confirm" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "status" VARCHAR(20) DEFAULT 'PENDING',

    CONSTRAINT "bi_match_result_pkey" PRIMARY KEY ("result_id")
);

-- CreateTable
CREATE TABLE "public"."bi_alert" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "type" VARCHAR(50),
    "status" VARCHAR(20) DEFAULT 'unread',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(6),
    "category" VARCHAR(50),
    "data" JSONB,

    CONSTRAINT "bi_alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bi_alert_log" (
    "id" SERIAL NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "user_id" INTEGER,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "additional_data" JSONB,

    CONSTRAINT "bi_alert_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bi_match_reg" (
    "id" SERIAL NOT NULL,
    "match_type" "public"."MatchType" NOT NULL DEFAULT 'ONE_VS_ONE',
    "game_type" "public"."game_type_enum" NOT NULL DEFAULT 'FOUR_BALL',
    "creator_id" INTEGER NOT NULL,
    "status" "public"."match_status" NOT NULL DEFAULT 'PENDING',
    "player_count" INTEGER NOT NULL,
    "current_players" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "billiard_place" VARCHAR,
    "match_date" TIMESTAMP(6),

    CONSTRAINT "bi_match_reg_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bi_match_participant" (
    "id" SERIAL NOT NULL,
    "match_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "team" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_match_participant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bi_favorites" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "place_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bi_recent_search" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "search_term" VARCHAR(255) NOT NULL,
    "place_id" INTEGER,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_recent_search_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bi_recent_visit" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "place_id" INTEGER NOT NULL,
    "visit_date" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_recent_visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bi_chat_room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bi_chat_room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bi_message" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "chat_room_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bi_chat_room_participants" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "bi_chat_room_participants_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."bi_message_read_by" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "bi_message_read_by_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."bi_message_read" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "read_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chat_room_id" VARCHAR NOT NULL,

    CONSTRAINT "bi_message_read_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bi_club_announcement" (
    "club_announcement_id" SERIAL NOT NULL,
    "club_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR NOT NULL,

    CONSTRAINT "bi_club_announcement_pkey" PRIMARY KEY ("club_announcement_id")
);

-- CreateTable
CREATE TABLE "public"."bi_club_gallery" (
    "club_gallery_id" SERIAL NOT NULL,
    "club_id" INTEGER NOT NULL,
    "club_gallery_image_url" TEXT NOT NULL,
    "club_gallery_description" VARCHAR(200),
    "uploaded_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" VARCHAR NOT NULL,

    CONSTRAINT "bi_club_gallery_pkey" PRIMARY KEY ("club_gallery_id")
);

-- CreateTable
CREATE TABLE "public"."bi_club_join_request" (
    "request_id" SERIAL NOT NULL,
    "club_id" INTEGER NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "status" VARCHAR(20) DEFAULT 'pending',
    "requested_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bi_club_join_request_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "public"."bi_club_member" (
    "club_id" INTEGER NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "is_staff" BOOLEAN DEFAULT false,
    "staff_role" VARCHAR(50),
    "joined_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "member_permission_level" VARCHAR(20) DEFAULT 'member',

    CONSTRAINT "bi_club_member_pkey" PRIMARY KEY ("club_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."bi_club_schedule" (
    "club_schedule_id" SERIAL NOT NULL,
    "club_id" INTEGER NOT NULL,
    "club_schedule_title" VARCHAR(100) NOT NULL,
    "club_schedule_description" TEXT,
    "club_schedule_location" VARCHAR(100),
    "club_schedule_start_time" TIMESTAMP(6) NOT NULL,
    "club_schedule_end_time" TIMESTAMP(6),
    "club_schedule_is_competition" BOOLEAN DEFAULT false,

    CONSTRAINT "bi_club_schedule_pkey" PRIMARY KEY ("club_schedule_id")
);

-- CreateTable
CREATE TABLE "public"."bi_club_schedule_participants" (
    "club_schedule_id" INTEGER NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "status" VARCHAR(20) DEFAULT 'pending',

    CONSTRAINT "bi_club_schedule_participants_pkey" PRIMARY KEY ("club_schedule_id","user_id")
);

-- CreateTable
CREATE TABLE "public"."bi_club_tag" (
    "club_tag_id" SERIAL NOT NULL,
    "club_id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "bi_club_tag_pkey" PRIMARY KEY ("club_tag_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bi_user_email_key" ON "public"."bi_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bi_user_mb_id_unique" ON "public"."bi_user"("mb_id");

-- CreateIndex
CREATE UNIQUE INDEX "unique_social_id_provider" ON "public"."bi_user"("social_id", "provider");

-- CreateIndex
CREATE UNIQUE INDEX "bi_admin_email_key" ON "ownerdb"."bi_admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "bi_member_phone_key" ON "ownerdb"."bi_member"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "bi_setting_key_key" ON "ownerdb"."bi_setting"("key");

-- CreateIndex
CREATE UNIQUE INDEX "unique_bi_id" ON "ownerdb"."bi_store"("bi_id");

-- CreateIndex
CREATE INDEX "idx_bi_store_geom" ON "ownerdb"."bi_store" USING GIST ("geom");

-- CreateIndex
CREATE UNIQUE INDEX "bi_match_participant_match_id_user_id_key" ON "public"."bi_match_participant"("match_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bi_favorites_user_id_place_id_key" ON "public"."bi_favorites"("user_id", "place_id");

-- CreateIndex
CREATE INDEX "idx_user_visited" ON "public"."bi_recent_visit"("user_id", "visit_date" DESC);

-- CreateIndex
CREATE INDEX "bi_chat_room_participants_B_index" ON "public"."bi_chat_room_participants"("B");

-- CreateIndex
CREATE INDEX "bi_message_read_by_B_index" ON "public"."bi_message_read_by"("B");

-- CreateIndex
CREATE INDEX "bi_message_read_user_idx" ON "public"."bi_message_read"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bi_message_read_message_user_unique" ON "public"."bi_message_read"("message_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."bi_club" ADD CONSTRAINT "bi_club_club_owner_id_fkey" FOREIGN KEY ("club_owner_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ownerdb"."bi_maintenance_record" ADD CONSTRAINT "bi_maintenance_record_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "ownerdb"."bi_table"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ownerdb"."bi_reservations" ADD CONSTRAINT "bi_reservations_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "ownerdb"."bi_store"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ownerdb"."bi_usage_history" ADD CONSTRAINT "bi_usage_history_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "ownerdb"."bi_member"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ownerdb"."bi_usage_history" ADD CONSTRAINT "bi_usage_history_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "ownerdb"."bi_table"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match" ADD CONSTRAINT "matches_loser_id_fkey" FOREIGN KEY ("loser_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match" ADD CONSTRAINT "matches_player1_id_fkey" FOREIGN KEY ("player1_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match" ADD CONSTRAINT "matches_player2_id_fkey" FOREIGN KEY ("player2_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match" ADD CONSTRAINT "matches_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_request" ADD CONSTRAINT "bi_match_request_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."bi_match"("match_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_request" ADD CONSTRAINT "bi_match_request_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_request" ADD CONSTRAINT "bi_match_request_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_dispute" ADD CONSTRAINT "bi_match_dispute_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."bi_match"("match_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_dispute" ADD CONSTRAINT "bi_match_dispute_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_dispute" ADD CONSTRAINT "bi_match_dispute_resolved_by_fkey" FOREIGN KEY ("resolved_by") REFERENCES "public"."bi_user"("mb_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_evaluation" ADD CONSTRAINT "bi_match_evaluation_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_evaluation" ADD CONSTRAINT "bi_match_evaluation_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."bi_match"("match_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_evaluation" ADD CONSTRAINT "bi_match_evaluation_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_result" ADD CONSTRAINT "bi_match_result_loser_id_fkey" FOREIGN KEY ("loser_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_result" ADD CONSTRAINT "bi_match_result_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."bi_match"("match_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_result" ADD CONSTRAINT "bi_match_result_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_result" ADD CONSTRAINT "bi_match_result_winner_id_fkey" FOREIGN KEY ("winner_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_alert" ADD CONSTRAINT "bi_alert_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."bi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_alert_log" ADD CONSTRAINT "bi_alert_log_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."bi_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_match_reg" ADD CONSTRAINT "bi_match_reg_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."bi_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bi_match_participant" ADD CONSTRAINT "bi_match_participant_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "public"."bi_match_reg"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bi_match_participant" ADD CONSTRAINT "bi_match_participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."bi_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bi_favorites" ADD CONSTRAINT "fk_bi_favorites_store" FOREIGN KEY ("place_id") REFERENCES "ownerdb"."bi_store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_recent_search" ADD CONSTRAINT "fk_bi_recent_search_store" FOREIGN KEY ("place_id") REFERENCES "ownerdb"."bi_store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_recent_visit" ADD CONSTRAINT "fk_bi_recent_visit_store" FOREIGN KEY ("place_id") REFERENCES "ownerdb"."bi_store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_message" ADD CONSTRAINT "bi_message_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "public"."bi_chat_room"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_message" ADD CONSTRAINT "bi_message_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_chat_room_participants" ADD CONSTRAINT "bi_chat_room_participants_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."bi_chat_room"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_chat_room_participants" ADD CONSTRAINT "bi_chat_room_participants_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."bi_user"("mb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_message_read_by" ADD CONSTRAINT "bi_message_read_by_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."bi_message"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_message_read_by" ADD CONSTRAINT "bi_message_read_by_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."bi_user"("mb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_message_read" ADD CONSTRAINT "bi_message_read_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "public"."bi_message"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_message_read" ADD CONSTRAINT "bi_message_read_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_club_announcement" ADD CONSTRAINT "bi_club_announcement_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."bi_club"("club_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_club_announcement" ADD CONSTRAINT "bi_club_announcement_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."bi_user"("mb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_club_gallery" ADD CONSTRAINT "bi_club_gallery_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."bi_club"("club_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_club_gallery" ADD CONSTRAINT "bi_club_gallery_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "public"."bi_user"("mb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_club_join_request" ADD CONSTRAINT "bi_club_join_request_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."bi_club"("club_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_club_join_request" ADD CONSTRAINT "bi_club_join_request_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_club_member" ADD CONSTRAINT "bi_club_member_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."bi_club"("club_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_club_member" ADD CONSTRAINT "bi_club_member_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_club_schedule" ADD CONSTRAINT "bi_club_schedule_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."bi_club"("club_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_club_schedule_participants" ADD CONSTRAINT "bi_club_schedule_participants_club_schedule_id_fkey" FOREIGN KEY ("club_schedule_id") REFERENCES "public"."bi_club_schedule"("club_schedule_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_club_schedule_participants" ADD CONSTRAINT "bi_club_schedule_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."bi_user"("mb_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."bi_club_tag" ADD CONSTRAINT "bi_club_tag_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "public"."bi_club"("club_id") ON DELETE CASCADE ON UPDATE NO ACTION;
