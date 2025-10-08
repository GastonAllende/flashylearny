# Supabase Setup Instructions

## Phase 2: Database Schema Setup

Follow these steps to set up your Supabase database for FlashyLearny.

---

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: **wtlrnhuhnfzuctgunhdn**
3. Click on **SQL Editor** in the left sidebar

---

## Step 2: Run the Migration Script

1. Click **New Query** button
2. Copy the entire contents of `supabase-migration.sql` file
3. Paste it into the SQL Editor
4. Click **Run** (or press `Ctrl/Cmd + Enter`)

### Expected Output

You should see a success message and a table showing:

```
table_name     | column_count
---------------|-------------
cards          | 7
decks          | 6
progress       | 9
user_profiles  | 9
```

---

## Step 3: Verify Tables Were Created

In the Supabase Dashboard:

1. Click **Table Editor** in the left sidebar
2. You should see 4 new tables:
   - ✅ `user_profiles` - User subscription info
   - ✅ `decks` - User flashcard decks
   - ✅ `cards` - Flashcards
   - ✅ `progress` - Learning progress tracking

---

## Step 4: Verify Row-Level Security (RLS)

1. Click on any table (e.g., `decks`)
2. Click the **Policies** tab at the top
3. You should see policies like:
   - ✅ Users can view own decks
   - ✅ Users can insert own decks
   - ✅ Users can update own decks
   - ✅ Users can delete own decks

---

## What Was Created?

### Tables

#### 1. `user_profiles`
- Stores user tier (free/pro), Stripe IDs, subscription status
- Automatically created when a user signs up (via trigger)

#### 2. `decks`
- Cloud version of flashcard decks
- Each deck belongs to a user (`user_id`)
- Includes category field for organization

#### 3. `cards`
- Cloud version of flashcards
- Linked to decks and users
- Contains question and answer

#### 4. `progress`
- Learning progress for each card
- Tracks status (NEW, LEARNING, MASTERED)
- Records review statistics

### Security Features

✅ **Row-Level Security (RLS)** - Users can only access their own data
✅ **Foreign Key Constraints** - Cascade deletes maintain data integrity
✅ **Indexes** - Optimized for fast queries
✅ **Automatic Timestamps** - `updated_at` auto-updates on changes
✅ **Auto Profile Creation** - New users get a profile automatically

---

## Step 5: Test the Setup

### Option A: Using Supabase Dashboard

1. Go to **Table Editor** → `user_profiles`
2. Click **Insert** → **Insert row**
3. Try to insert a row (should work for your user)
4. Try to view rows (should only see your own data)

### Option B: Using the App

1. Make sure your `.env.local` is configured
2. Start the dev server: `npm run dev`
3. Visit http://localhost:3000
4. Click **Sign up** and create a test account
5. Check Supabase **Table Editor** → `user_profiles`
6. You should see your new user with `tier: 'free'`

---

## Troubleshooting

### Error: "extension uuid-ossp does not exist"
- Go to **Database** → **Extensions** in Supabase
- Search for `uuid-ossp` and enable it
- Re-run the migration

### Error: "permission denied for schema public"
- Make sure you're using the **SQL Editor** in Supabase Dashboard
- Don't run this locally - it must run on Supabase

### RLS Policies Not Working
- Verify tables show as "RLS enabled" in Table Editor
- Check that policies exist in the Policies tab
- Make sure you're authenticated when testing

### Profile Not Created on Signup
- Check **Database** → **Functions** → `handle_new_user` exists
- Check **Database** → **Triggers** → `on_auth_user_created` exists
- Try signing up with a new test email

---

## Next Steps

After the database is set up, we'll move to:

- **Phase 3**: Subscription limits and tier enforcement
- **Phase 4**: Stripe payment integration
- **Phase 5**: Cloud sync between IndexedDB and Supabase

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- FlashyLearny Issue Tracker: (create GitHub issues)
