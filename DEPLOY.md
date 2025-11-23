# How to Deploy to Vercel

To share this website with your family anywhere in the world, you need to deploy it to the cloud. **Vercel** is the best free option for this.

## Prerequisites
1.  A **GitHub** account.
2.  A **Vercel** account (you can sign up with GitHub).

## Steps

### 1. Push to GitHub
First, we need to put your code on GitHub.
1.  Create a new repository on [GitHub.com](https://github.com/new) named `italy-trip`.
2.  Run these commands in your terminal (I can help you run them if you want):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/italy-trip.git
    git push -u origin main
    ```

### 2. Deploy on Vercel
1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `italy-trip` repository.
4.  **IMPORTANT**: In the "Environment Variables" section, you don't strictly need to add anything because I hardcoded the Supabase keys in `src/lib/supabase.js` for simplicity.
    *   *Note: In a professional app, we would use environment variables, but for this family trip app, hardcoding is fine and easier.*
5.  Click **Deploy**.

### 3. Share the Link
Vercel will give you a link like `https://italy-trip-xi.vercel.app`.
Send this link to your family! They can now see the itinerary and even make edits if you gave them the link.

## Real-Time Updates
Since we connected **Supabase**, if you edit a plan on your laptop, your family will see the change on their phone when they refresh the page!
