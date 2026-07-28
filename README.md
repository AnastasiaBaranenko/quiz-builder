# quiz-builder-

## Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Database

The project uses SQLite with Prisma.

Initialize the database:

```bash
npx prisma generate
npx prisma db push
```

## Sample quiz

Open the application, click "Create a quiz", fill in the form, and submit it. The quiz will appear on the dashboard.
