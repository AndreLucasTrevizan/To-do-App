# To do App

A simple to do app.

<img src='./frontend/src/assets/video.gif' /><br />

> API

#### Stacks

<ul>
  <li>NodeJs</li>
  <li>Express</li>
  <li>Prisma ORM</li>
  <li>Postgres SQL</li>
</ul>

#### Envs

Inside the api folder create a new <strong>.env</strong> file and put the following envs inside: 

<ul>
  <li>PORT</li>
  <li>DATABASE_URL</li>
  <li>JWT_SECRET</li>
  <li>PRIMARY_EMAIL -> Is necessary to send an email with the verification code when user forgot his password.</li>
  <li>PRIMARY_EMAIL_PASSWORD -> Your primary email password</li>
</ul>

Run <strong>yarn install</strong> or <strong>npm install</strong> to install all the dependencies and afterwards <strong>npx prisma migrate dev</strong> to create the database models, with all of it done, just run <strong>yarn dev</strong> and you're ready to use the <strong>API</strong>.

> Frontend

Main Stack: <strong>Next.js</strong>

Just run <strong>yarn install</strong> and you're ready to use the frontend, access: <strong>http://localhost:3000</strong>

> Mobile

Built with Expo, so you're going to need Expo installed so run <strong>npm i -g @expo/cli</strong> if you don't have Expo installed. Now, run <strong>yarn install</strong> or <strong>npm install</strong> to install the package.json dependencies.

You need to change the API Address inside <strong>mobile/src/services/api.ts</strong> to your local IP Address. e. g. <strong>192.168.0.1:3333</strong>

Run <strong>expo start</strong>

Press <strong>a</strong> to open the app in a local emulator or open the Expo Go App in your smartphone and scan the QR Code.
