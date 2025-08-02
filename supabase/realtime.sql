-- Enable Realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
ALTER PUBLICATION supabase_realtime ADD TABLE voice_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE voice_messages;
