# CRUD Template - Backend - MongoDB

This repository is an optional backend starter pack for new DALI React projects. Installation and setup instructions are included below. You should eventually customize this README file with project-specific documentation.

## Designs
[Screenshot description]

[Link to the project Figma]()

[2-4 screenshots from the app]

## Architecture
### Tech Stack
  - [Express](https://expressjs.com/)
  - [MongoDB](https://www.mongodb.com/)
  - [Mongoose ODM](https://mongoosejs.com/)
  - [ts-mongoose](https://www.npmjs.com/package/ts-mongoose)
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
    |   └── db                  # MongoDB database definitions
    |     └── migrations        # initialize tables and upload default data
    |     └── models            # defines structure of MongoDB collections
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

1. Clone repo and `yarn install`
2. Create [MongoDB Atlas database](https://www.mongodb.com/atlas/database)
3. Set up SendGrid API (for email validation)
   - Information about SendGrid API keys: https://docs.sendgrid.com/ui/account-and-settings/api-keys
4. Set up Amazon AWS s3 bucket (for photo storage)
   - https://cs52.me/assignments/sa/s3-upload/
5. Create a `.env` file in the root directory
  - Should be in the following format:
  - ```
    AUTH_SECRET='*secret assortment of characters used for encryption*'
    PORT=*insert desired backend server port here*
    MONGODB_URI=mongodb+srv://...
    MONGODB_DB_NAME=
    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    S3_BUCKET_NAME=
    SENDGRID_EMAIL=
    SENDGRID_API_KEY=
    ```
6. Run `yarn migrate-mongo up` to apply migrations and seeding to DB.
7. App should be ready for use now
  - `yarn start` to run in production mode
  - `yarn run dev` to run with hot reloading

#### Linting

ESLint is set up in this project. To keep code clean, always remember to run `yarn run lint` and fix any lint problems before merging into master.

#### Unit Testing

Jest unit testing is set up for the controllers, routers, and services. Remember to run `yarn test` and fix any breaking changes that might've occured. 
  - You can also run just an individual test file with `yarn test -- *filename*`

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
