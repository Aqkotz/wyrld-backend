# CRUD Template - Backend - Prisma

This repository is an optional backend starter pack for new DALI React projects. Installation and setup instructions are included below. You should eventually customize this README file with project-specific documentation.

## How To Extend This Template
See the template repo's Wiki page.

## Designs
[Screenshot description]

[Link to the project Figma]()

[2-4 screenshots from the app]

## Architecture
### Tech Stack
  - [Express](https://expressjs.com/)
  - [Prisma ORM](https://www.prisma.io/)
  - [Passport.js](https://www.passportjs.org/)
  - [axios](https://github.com/axios/axios)
  - [TypeScript](https://www.typescriptlang.org/docs/)

#### External Packages
- [aws-sdk](https://yarnpkg.com/package/aws-sdk)
- [@sendgrid/mail](https://docs.sendgrid.com/for-developers/sending-email/quickstart-nodejs)
- [Add any other notable external packages here]

### Style
[Describe notable code style conventions]

We are using [typically a configuration like [CS52's React-Native ESLint Configuration](https://gist.github.com/timofei7/c8df5cc69f44127afb48f5d1dffb6c84) or [CS52's ES6 and Node ESLint Configuration](https://gist.github.com/timofei7/21ac43d41e506429495c7368f0b40cc7)]

### Data Models
[Brief description of typical data models.]

[Detailed description should be moved to the repo's Wiki page]

### Directory Structure

    .
    ├── ...         
    ├── src                    
    |   └── auth                # JWT middleware
    |   └── controllers         # dispatch input; output
    |   └── db                  # Prisma database definitions
    |   └── errors              # internal error handling
    |   └── routers             # route url endpoint
    |     └── __tests__         # test cases for routers
    |   └── services            # handles database queries and related functionality
    |     └── __tests__         # test cases for services
    |   └── util                # util functions, usually used by services
    |   └── validation          # validates input w/ joi
    |   └── server.ts           # starting point of server

For more detailed documentation on our file structure and specific functions in the code, feel free to check the project files themselves.

## Setup

For this setup, we will use MongoDB as the database Prisma operates upon. It should be relatively straightforward to use a different database (like Postgres) with the same code, if you so desire.

1. Clone repo and `yarn install`
2. Create [MongoDB Atlas database](https://www.mongodb.com/atlas/database)
3. Set up SendGrid API (for email validation)
   - Information about SendGrid API keys: https://docs.sendgrid.com/ui/account-and-settings/api-keys
4. Set up Amazon AWS s3 bucket (for photo storage)
   - https://brunchlabs.notion.site/ECSA-Uploading-images-to-S3-88be408bf5eb4aa987b7bea211258291
5. Create a `.env` file in the root directory, according to the format specified by `.env.example`
6. Run `yarn prisma db seed` to apply seeding to DB.
7. App should be ready for use now
  - `yarn start` to run in production mode
  - `yarn run dev` to run with hot reloading

#### Linting

ESLint is set up in this project. To keep code clean, always remember to run `yarn run lint` and fix any lint problems before merging into master.

#### Unit / Integration Testing

TBD

## Deployment
[Where is the app deployed? i.e. Expo, Surge, TestFlight etc.]

[What are the steps to re-deploy the project with any new changes?]

[How does one get access to the deployed project?]

## Authors
* Firstname Lastname 'YY, role

## Acknowledgments
We would like to thank [anyone you would like to acknowledge] for [what you would like to acknowledge them for].

---
Designed and developed by [@DALI Lab](https://github.com/dali-lab)

### Template

- Eric Lu '25

Additional credit goes to Adam McQuilkin '22, Ziray Hao '22, Jack Keane '22, Thomas Monfre '21 for developing the original DALI CRUD Template Backend, which this starter pack was evolved from.
