[README.md](https://github.com/user-attachments/files/28487405/README.md)
# Running the Application Locally

This project uses Supabase to host the backend services and PostgreSQL database, including authentication, data storage, and server-side database functions.

If you want to run the application locally for edits:

1. Clone the repository:

   ```bash
   git clone https://github.com/RealHostCS/talent-match
   ```

2. Open the project in Visual Studio Code.

3. Open the terminal in the project folder.

4. Install the project dependencies:

   ```bash
   npm install
   ```

5. Create a `.env` file using `.env.example` as a guide.

   The project needs Supabase environment variables:

   ```bash
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

6. Start the local development server:

   ```bash
   npm run dev
   ```

Done. The app will run locally, and most code changes will appear instantly while the development server is running.

## Updating the Live Website

To update the live website, run:

```bash
npm run build
```

Then deploy the generated `dist` folder using the hosting platform.

You do not need to worry about deployment when making local edits. Just let the project owner know if you make changes that should be added to the live site.
