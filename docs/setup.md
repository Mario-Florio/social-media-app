# Setup
The following is a guide for setting up the application on a local machine. For a guide on the use of the application, please see the [*User Manual*](https://www.github.com/mario-florio/social-media-app/docs/user-manual.md).

- [Setup](#setup)
    - [Backend](#backend)
    - [Frontend](#frontend)

This guide will cover the following sections:
- [Backend](#backend)
- [Frontend](#frontend)

### Required Tools
- [Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [MongoDB database](https://www.mongodb.com/resources/products/fundamentals/create-database)

## Backend
In the *backend* directory, run:
```bash
npm install
```

### Environmentals
Create a file ```./backend/.env``` with the variables:
- [```PORT```](#port)
- [```HOST_NAME```](#host_name)
- [```UPLOADS``` *optional*](#uploads)
- [```SECRET```](#secret)
- [```MONGODBURL```](#mongodburl)

#### ```PORT```
The *port variable* is simply a reference to the port number the backend will serve from. This variable will ultimately effect the [*host name variable*](#host_name) and the *frontends* [*proxy variable*](#frontend). 

Any available port will work——simply declare port as a string (e.g. ```"8000"```).

#### ```HOST_NAME```
The *host name variable* refers to the host name of the server (e.g. ```http://localhost:8000```, ```192.168.0.0/16:80```, ```www.yourdomain.com```, etc.). It is used by the [*getPhotoUrl*](https://github.com/Mario-Florio/social-media-app/blob/main/backend/database/methods/__utils__/getPhotoUrl.js) function to create a url for the client (e.g. the *frontend*). These urls allow the client to reach photo uploads stored on the server.

That considered, any host name which the client can use to reach the server will be supported, whether that be a *localhost*, a private IP address for a private network, or a public facing domain name. **Note: It should not include a final *forward slash*.**

#### ```UPLOADS``` *optional*
The *uploads variable* represents the path from the root of the *backend directory* to the *uploads directory* where image uploads are stored. Declaration is optional and by default, this variable will resolve to ```./uploads/```.

If specification of uploads is desired, the *uploads variable* should be formated as follows:

```./[path to desired folder]/```

where "." resolves to the root of the *backend directory*.

#### ```SECRET```
*Secret* is a reference to *secret key* and is used for *signing* [JSON Web Tokens](https://jwt.io/introduction/). The signature is used to insure the integrity of the token, thus it should remain secret.

A randomly generated string will be enough to get the application running, but a more intelligent key generation may be used if security is a particular concern.

#### ```MONGODBURL```
The *mongodburl variable* is a reference to the [MongoDB Connection String](https://www.mongodb.com/docs/v6.3/reference/connection-string/) that will be used to connect the server to the database. The connection string can be as is used for the *mongodburl variable*.

### Running Server
In the *backend* directory, run:
```bash
npm run start
```

Upon successful launch, the terminal should output:
```
Listening on port [insert PORT value]
Database connected
```

#### Developer Server
For a developer server using [*nodemon*](), run:
```bash
npm run devstart
```

## Frontend
In the *frontend* directory, run:
```bash
npm install
```

### Environmentals
The frontend requires definition of a *proxy variable*——```VITE_PROXY```.

Create file ```./frontend/.env```:
```env
VITE_PROXY = "[insert host name]/api"
```

...where "[insert host name]" refers to the host name which the backend api is accessible through (likely equivalent to the [*backends host name variable*](#host_name)).

This variable is used for configuration on the *axios* object (see *[./frontend/src/index.jsx](https://github.com/Mario-Florio/social-media-app/blob/main/frontend/src/index.jsx), line 10*). This axios object will be used to make subsequent calls to the backend.

### Running Client
##### (Note: *Backend* server must be running prior to starting *frontend*. For instructions on setting up the backend, see [Backend](#backend).)
In the *frontend* directory, run:
```bash
npm run start
```
