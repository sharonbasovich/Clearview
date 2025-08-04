# Clearview
A note-taking app that uses AI to subtly question and prompt you as you write to make your journals more introspective. Additionally, Clearview is designed with accessibility in mind. This means a UI with legible fonts and bright contrasting colours, the ability to record and read journals using speech-to-text and text-to-speech, and suggestions for beginners. Clearview is built using React, Tailwind, Next.js, Material UI, and Shadcn for the frontend and Supabase, MongoDB, and Gemini for the backend.

## Test it out!
Go to [super-big.tech](https://super-big.tech) to test it out

## Features

- Beautiful UI using Shadcn and Material UI
- Rich text editing with TipTap
- Discord open authentication using Supabase
- Responsive design usin GSAP and Three
- Tag system for filtering journals
- Search for journals by contents

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/sharonbasovich/Clearview.git
cd clearview
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project settings > API
3. Copy your project URL and anon key

### 3. Configure Discord OAuth in Supabase

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Discord provider
3. Go to Discord Developer Portal (https://discord.com/developers/applications)
4. Create a new application
5. Go to OAuth2 settings
6. Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
7. For local development, also add: `http://localhost:54321/auth/v1/callback`
8. Copy the Client ID and Client Secret to your Supabase Discord provider settings

### 4. Set up MongoDB

1. Create a MongoDB Atlas cluster at [mongodb.com](https://mongodb.com)
2. Create a database user and get your connection string
3. Whitelist your IP address or use 0.0.0.0/0 for development

### 5. Get Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create an API key for Gemini
3. Copy the API key for environment variables

### 6. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key

# Google Generative AI Configuration
GOOGLE_API_KEY=your_google_ai_api_key

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Discord OAuth (for NextAuth fallback - optional)
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# NextAuth Configuration (if needed)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key
```

### 7. Run the application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

### 8. Additional Setup (Optional)

#### Supabase CLI Setup
If you want to use Supabase CLI for database management:

```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Initialize Supabase in your project
supabase init

# Link to your existing project
supabase link --project-ref your_project_reference

# Pull existing schema
supabase db pull
```

## Authentication Flow

1. User clicks "Sign In" on the landing page or tries to access protected route
2. Redirected to `/auth` with Discord authentication
3. After successful authentication, redirected to `/app` (main notes interface)
4. User data and avatar fetched from Discord profile
