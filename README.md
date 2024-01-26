# iceday

examination project 2024 - hockey calendar app

---

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Before beginning, you need to set up a Firebase project. Go to the console > Add Project. Enter a name, and opt out of Google Analytics. Wait for the project to be set up. Choose to register an app to use with the project by clicking on the web icon. Enter a name. Under the next heading, Add Firebase SDK, you will receive the information you need to populate the .env.local to get the environment variables required. See `sample.env.local`.
Once your app is created, you set up the Authentication. Providers used are email/password and Google. Next, you set up Firestore Database and Storage.

To install the dependencies, `npm install`, followed by starting up the development server with `npm run dev`.

Open [http://localhost:3000](http://localhost:3000) with your browser. If you've set up Firebase properly, you should be able to register a new account and login. To explore the admin options, you will have to go into your Firebase console -> Firebase Database, find the users collection, and for your chosen user, change `roles: "user"` to `roles: "admin"`.

## Documentation

See the system design [in the project folder](_project/README.md).
