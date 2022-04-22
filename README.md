# bedi
better experiment data interface

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Motivation

The goal is to create a type-safe, maintainable, and easily deployable application to manage experiments data.

The previous application consisted of an Angular frontend and an Express backend. The Angular frontend used Angular, and therefore **no one**, not even the ones who made it, understood how to extend it without creating a mess. The Express backend was written in Javascript and without promises, resulting in an error-prone callback hell.

I opted to combine integrate the backend using Next.js's API routes, because the frontend and backend have always and will continue to be tightly coupled. The backend will never serve any other clients. This reduces unnecessary duplicated work e.g. types, routing.


## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## File Browser UI
https://github.com/uptick/react-keyed-file-browser

An interesting alternative is https://github.com/TimboKZ/Chonky, but it doesn't support filetree view


# Mongoose

## Schemas

All model fields are either required or have a sensible default. No field should be in an undefined state ever, which reduces potential errors and simplifies types because we can trust that all fields exist.

Some fields are technically immutable, like `createdAt` or `dateCreated`, but I opted not to force it since there is no point. Nothing is going to update those fields, and there is no real danger/attack vector.

Generally, I opted to avoid settings which will never come into effect. For example, setting `trim: true` on name fields which come from user input, but not anything computed like `prefixPath`.


# Misc.

## Primsa
I originally wanted to try Prisma, but it doesn't work for us, since each experiment has a unique collection containing all its data. This doesn't allow for a static schema that Prisma needs. There are potential workarounds including running `prisma migrate` everytime an experiment is created, but that is hacky and cumbersome.