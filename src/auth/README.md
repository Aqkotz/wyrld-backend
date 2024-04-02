# Authorization Middleware

## Authorization Overview

As a reminder, there are two major elements to any application security plan:
authentication and authorization. Authentication is the process of verifying the
identity of a given user (i.e. username and password, 2FA, etc...), and authorization is determining what that user should be allowed to do.

In this template, we use username and password authentication, and we use JWT tokens
to persist this authentication state. JWT tokens can prove to the server that the user
is who they say they are once they have been properly authenticated.

Once we determine the identity of a user, we still need to maintain limits on what they
should be able to do and access within the application. For example, user one shouldn't
be able to delete user two's account unless user one has the proper authentication level
(e.g. user one is an admin). Likewise, user two shouldn't be able to access user one's
personal information without permission. We control this access through authorization
measures.

## Scoping

One common method to determine what users can access and modify within applications
is scoping. Scoping is an authorization strategy that assigns users one or more roles
within an application (e.g. `USER`, `ADMIN`, etc...) and then validates on each request
that the user making the request has the required scope as required by the route.

Scoping can also include roles that are "subscopes" of other roles. For , we
can consider the `USER` scope a subscope of the `ADMIN` scope, since being an
`ADMIN` user means the user can perform all activities a user with the `USER`
scope can in addition to other `ADMIN`-specific activities (e.g. modifying
other users' documents). Within this template we have implemented two scopes
`USER` and `ADMIN`, where the `USER` scope is a subscope of the `ADMIN` scope.
These scopes can be found in the `src/authentication/scopes.ts` file.

Once the scopes for the application have been determined, each route can then
specify which minimum scope it requires to perform certain actions. For example
fetching all users is something that only `ADMIN`-scoped users should be able
to do, whereas creating a new resource can be done by `USER`-scoped users.

> **IMPORTANT:** Scopes do not completely remove the need for user role checks within
> application controllers. For example, in a medical application a `DOCTOR`-scoped user
> will be able to access the data _some_ of `USER`-scoped users, but only when the
> `USER`-scoped user is a patient of the `DOCTOR`-scoped user. This check will need
> to be done within the controller and will likely not be taken care of within the
> application middleware.

## Offered Middlewares

This template offers two general-purpose authorization middlewares and two specialized
authorization middlewares not intended for use on most routes. These middlewares are
listed below.

- requireScope
- requireSelf
- requireAuth [specialized]
- requireSignin [specialized]

<!-- TODO HOW TO ATTACH TO ROUTERS -->

### requireScope

```typescript
const requireScope: (scope: ScopeNames) => Express.RequestHandler
```

```typescript
router.route('/')
  .get(
    requireScope('ADMIN'),
    userController.getAllUsers,
  );
```

The `requireScope` middleware takes in a minimum required scope, and will only allow
access to the protected route when the user has a scope that is or is a superscope of
the specified minimum required scope. Otherwise, the middleware will reject the request
with a `403 Forbidden` response.

This middleware is intended for general-purpse use when only users with certain minimum
scopes should be able to access the protected route.

### requireSelf

```typescript
const requireSelf: (adminScope: ScopeNames) => Express.RequestHandler
```

```typescript
router.route('/:id')
  .patch(
    requireScope('USER'),
    requireSelf('ADMIN'),
    validator.body(UpdateUserSchema),
    userController.updateUser,
  );
```

The `requireSelf` middleware takes in an admin-level scope, and will only allow access
to the protected route if the `req.params.id` value equals the `user.id` value of the
authenticated user or that the requesting user has at least the admin-level scope
specified. Otherwise, the middleware will reject the request with a `403 Forbidden`
response.

This middleware is intended for use on user-specific routes where `USER`-scoped
users should only be able to edit their own user document, while still allowing
`ADMIN`-scoped users to edit all `USER`-scoped users' documents.

> **Note:** This middleware requires that the `req.user` field exist within
> the incoming request object. This can be ensured by calling either the `requireAuth`
> or `requireScope` middleware on the protected route before calling the `requireSelf`
> middleware.

### requireAuth [specialized]

```typescript
const requireAuth: Express.RequestHandler
```

```typescript
router.route('/jwt-signin')
  .get(
    requireAuth,
    authController.jwtSignIn,
  );
```

The `requireAuth` middlware does not take any configuration and will only allow access
to the protected route if **any** valid user is making the request. Otherwise, the
middleware will reject the request with a `401 Unauthorized` response.

This middleware is intended for use on routes that are scope-indifferent, such as
returning the user document belonging to the authenticated user as in the example above.

> :warning: **IMPORTANT** :warning: This middlware contains a subset of the functionality contained within
> the `requireScope` middleware. This middleware is designed for very specific use cases
> and should generally be considered dangerous. Incorrect use can lead to major
> breakdowns within the application's authorization layer and could potentially
> lead to permission elevation exploits.

### requireSignin [specialized]

```typescript
const requireSignin: Express.RequestHandler
```

```typescript
router.route('/signin')
  .post(
    requireSignin,
    authController.signInUser,
  );
```

The `requireSignin` middleware does not take any configuration and will require that
any incoming requests contain the `req.body.email` and `req.body.password` fields.
Otherwise, the middleware will reject the request with a `400 Bad Request` response.

This middleware is **only** intended for use on signin routes which require specific
fields to be included within the incoming request. Note that this middleware contains
a subset of the functionality contained within the validation framework of this template
and is likely to be deprecated in the future.

> **Note:** This middleware will only funciton with HTTP methods supporting a `req.body`
> field (e.g. `POST`, `PUT`, `PATCH`, `DELETE`)
