# Next.js Web Application Template

A modern, production-ready starter template for building web applications with Next.js 15, TypeScript, Supabase, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database & Auth:** Supabase
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form + Zod
- **Code Quality:** ESLint & Prettier
- **Deployment:** Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Supabase account and project

### Installation

1. Clone or download this template:

```bash
git clone <your-repo-url> my-app
cd my-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Features

### Authentication

- Email/password authentication with Supabase
- Protected routes and middleware
- Login and registration forms with validation
- User session management

### UI Components

- Pre-configured shadcn/ui components
- Responsive design with Tailwind CSS
- Dark mode support
- Accessible and customizable components

### Form Handling

- Type-safe forms with React Hook Form
- Zod schema validation
- Error handling and user feedback
- Sample login and registration forms

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Pre-configured rules and settings

## Project Structure

```
webapp-template/
├── app/                     # Next.js app directory
│   ├── (auth)/             # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/        # Protected routes
│   │   └── dashboard/
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── auth/               # Authentication components
│   └── forms/              # Form components
├── lib/                    # Utility functions
│   ├── supabase/          # Supabase client setup
│   ├── validations/       # Zod schemas
│   └── utils.ts           # Helper functions
├── types/                  # TypeScript types
└── middleware.ts          # Next.js middleware
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript compiler check
```

## Supabase Setup

### Database Schema

Create a `profiles` table in your Supabase project:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  PRIMARY KEY (id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create a trigger to create a profile on signup
CREATE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### Authentication Setup

1. Enable Email Authentication in your Supabase dashboard
2. Configure email templates (optional)
3. Set up redirect URLs for your production domain

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Environment Variables

For production, ensure you set:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Customization

### Adding New Components

Install additional shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

### Styling

- Modify `tailwind.config.ts` for custom theme configuration
- Edit `app/globals.css` for global styles
- Update CSS variables for theming

### Forms

Create new form schemas in `lib/validations/`:

- Define Zod schemas for validation
- Export TypeScript types
- Use in components with React Hook Form

## Security Best Practices

- Never commit `.env.local` file
- Use Row Level Security (RLS) in Supabase
- Validate all user inputs
- Implement proper error handling
- Keep dependencies updated

## License

MIT

## Support

For issues and questions, please refer to the documentation of the individual technologies used in this template:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
