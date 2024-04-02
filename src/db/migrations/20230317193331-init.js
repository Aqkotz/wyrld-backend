'use strict';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bcrypt = require('bcrypt');

module.exports = {
  async up(db) {
    // Write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});

    /**
       * User Data
       */
    const users = [
      {
        _id: 'a05742a3-0b8c-4fc4-98a3-640e55d8f2ab',
        email: 'unverified@gmail.com',
        password: await bcrypt.hash('12345', 10),
        name: 'Unverified',
        role: 'UNVERIFIED',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: '68b0d858-9e75-49b0-902e-2b587bd9a996',
        email: 'user@gmail.com',
        password: await bcrypt.hash('12345', 10),
        name: 'User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: '62da2543-bf07-4b1a-9d45-a531493d37d9',
        email: 'admin@gmail.com',
        password: await bcrypt.hash('12345', 10),
        name: 'Admin',
        role: 'ADMIN',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await Promise.all(
      users.map(async (user) => {
        try {
          console.log(users);
          await db.collection('users').insert(user);
        } catch (e) {
          console.log(e);
        }
      }));

    /**
      * Resource Data
      */
    const resources = [
      {
        _id: '5c0e8d61-9fc0-4803-ab48-cf1b8168b764',
        title: 'The Grapes of Wrath',
        description: 'John Steinbeck',
        value: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: '05a5ab10-5ca0-426e-8091-c0800c26215b',
        title: 'The Great Gatsby',
        description: 'F. Scott Fitzgerald',
        value: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: '575e8b36-9cb6-4098-9620-cd0ba1c3e585',
        title: 'Macbeth',
        description: 'William Shakespeare',
        value: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        _id: '909dee79-ac3f-49ff-9182-441b06de6a86',
        title: 'Heart of Darkness',
        description: 'Joseph Conrad',
        value: 15,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    const resourceIds = [];
    await Promise.all(
      resources.map(async (resource) => {
        try {
          console.log(resources);
          const res = await db.collection('resources').insert(resource);
          resourceIds.push(res.insertedId);
        } catch (e) {
          console.log(e);
        }
      }));

    /**
      * Item Data
      */
    const items = [
      {
        resourceId: resourceIds[0],
        name: 'Item Name A',
        description: 'Description Name A',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        resourceId: resourceIds[1],
        name: 'Item Name B',
        description: 'Description Name B',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await Promise.all(
      items.map(async (item) => {
        try {
          console.log(items);
          await db.collection('items').insert(item);
        } catch (e) {
          console.log(e);
        }
      }));
  },

  async down(db) {
    // Write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.collection('users').drop();
    await db.collection('items').drop();
    await db.collection('resources').drop();
  },
};
