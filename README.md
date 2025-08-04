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

### 3. Configure Discord OAuth

1. In your Supabase dashboard, go to Authentication > Providers
2. Enable Discord provider
3. Go to Discord Developer Portal (https://discord.com/developers/applications)
4. Create a new application
5. Go to OAuth2 settings
6. Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
7. For local development, also add: `http://localhost:54321/auth/v1/callback`
8. Copy the Client ID and Client Secret to your Supabase Discord provider settings

### 4. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=add yours
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=add yours

SUPABASE_SERVICE_ROLE_KEY=add yours

# Google Generative AI Configuration
GOOGLE_API_KEY=add yours

# Mongo DB
DB_PASSWORD=add yours
MONGODB_URI=add yours
```

### 5. Run the application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application or whatever port is listed in the terminal.

## Authentication Flow

1. User clicks "Sign In" on the landing page or tries to access protected route
2. Redirected to `/auth` with Discord authentication
3. After successful authentication, redirected to `/app` (main notes interface)
4. User data and avatar fetched from Discord profile
