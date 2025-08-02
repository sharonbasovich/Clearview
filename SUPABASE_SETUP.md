# Supabase CLI Configuration

To set up Supabase CLI for your project:

## 1. Install Supabase CLI
```bash
brew install supabase/tap/supabase
```
Or alternatively with npm:
```bash
npm install -g @supabase/cli
```

## 2. Initialize Supabase in your project
```bash
supabase init
```

## 3. Link to your existing project
```bash
supabase link --project-ref rgyedbkuhaiinzdtosdi
```

## 4. Pull existing schema (if any)
```bash
supabase db pull
```

## 5. Apply new migrations
```bash
supabase db push
```

## Your project details:
- Project URL: https://rgyedbkuhaiinzdtosdi.supabase.co
- Project Ref: rgyedbkuhaiinzdtosdi

## Database Schema Files Created:
- `supabase/notes_schema.sql` - Notes storage
- `supabase/voice_chat_schema.sql` - Voice chat history
- `supabase/realtime.sql` - Real-time features

## ✅ Database Status:
**SETUP COMPLETE!** The database migration was successfully applied and the following tables are ready:
- ✅ `notes` - For storing user notes
- ✅ `voice_conversations` - For voice chat sessions  
- ✅ `voice_messages` - For individual messages in conversations

## ✅ CLI Status:
**CLI WORKING!** Remote project connection established:
- ✅ Project linked: `rgyedbkuhaiinzdtosdi` (Default project)
- ✅ Migrations applied: 2 migrations successfully deployed
- ✅ Region: East US (North Virginia)

## Working with Remote Project:

**Check remote project status:**
```bash
supabase projects list
```

**Check migration status:**
```bash
supabase migration list
```

**Direct database connection:**
```bash
# Set password environment variable
export PGPASSWORD="@jtXv/ktH5+EBM2"
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"

# Connect to remote database
psql -h aws-0-us-east-1.pooler.supabase.com -p 6543 -U postgres.rgyedbkuhaiinzdtosdi -d postgres
```

**Note:** 
- `supabase status` is for local development containers (not needed for remote projects)
- Use `supabase projects list` to see your remote projects
- Your remote database is fully functional and ready to use!
