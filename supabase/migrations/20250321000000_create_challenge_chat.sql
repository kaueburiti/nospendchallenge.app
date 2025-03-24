-- Create challenge chat messages table
CREATE TABLE IF NOT EXISTS "public"."challenge_chat_messages" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "challenge_id" bigint NOT NULL,
  "profile_id" uuid NOT NULL,
  "message" text NOT NULL,
  "created_at" timestamp with time zone NOT NULL DEFAULT now(),
  "updated_at" timestamp with time zone DEFAULT now(),
  
  PRIMARY KEY ("id"),
  CONSTRAINT "challenge_chat_messages_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges" ("id") ON DELETE CASCADE,
  CONSTRAINT "challenge_chat_messages_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles" ("id") ON DELETE CASCADE
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS "challenge_chat_messages_challenge_id_idx" ON "public"."challenge_chat_messages" ("challenge_id");
CREATE INDEX IF NOT EXISTS "challenge_chat_messages_profile_id_idx" ON "public"."challenge_chat_messages" ("profile_id");
CREATE INDEX IF NOT EXISTS "challenge_chat_messages_created_at_idx" ON "public"."challenge_chat_messages" ("created_at");

-- Add RLS policies for challenge chat messages
ALTER TABLE "public"."challenge_chat_messages" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read messages only for challenges they participate in
CREATE POLICY "Can read challenge chat messages if participant" ON "public"."challenge_chat_messages"
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM "public"."challenge_participants"
    WHERE "challenge_participants"."challenge_id" = "challenge_chat_messages"."challenge_id"
    AND "challenge_participants"."user_id" = auth.uid()
  )
);

-- Create policy to allow users to insert messages only for challenges they participate in
CREATE POLICY "Can insert challenge chat messages if participant" ON "public"."challenge_chat_messages"
FOR INSERT
WITH CHECK (
  "profile_id" = auth.uid()
  AND
  EXISTS (
    SELECT 1
    FROM "public"."challenge_participants"
    WHERE "challenge_participants"."challenge_id" = "challenge_chat_messages"."challenge_id"
    AND "challenge_participants"."user_id" = auth.uid()
  )
);

-- Create policy to allow users to update only their own messages
CREATE POLICY "Can update own challenge chat messages" ON "public"."challenge_chat_messages"
FOR UPDATE
USING ("profile_id" = auth.uid())
WITH CHECK ("profile_id" = auth.uid());

-- Create policy to allow users to delete only their own messages
CREATE POLICY "Can delete own challenge chat messages" ON "public"."challenge_chat_messages"
FOR DELETE
USING ("profile_id" = auth.uid());

-- Add function for updated_at trigger
CREATE OR REPLACE FUNCTION "public"."handle_updated_at"()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at column
CREATE TRIGGER "set_challenge_chat_messages_updated_at"
BEFORE UPDATE ON "public"."challenge_chat_messages"
FOR EACH ROW
EXECUTE FUNCTION "public"."handle_updated_at"();

-- Grant usage for authenticated users
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT ALL ON "public"."challenge_chat_messages" TO "authenticated";

-- Skip this if the sequence doesn't exist or isn't needed
-- GRANT USAGE ON SEQUENCE "public"."challenge_chat_messages_id_seq" TO "authenticated";

COMMENT ON TABLE "public"."challenge_chat_messages" IS 'Stores chat messages for challenges'; 