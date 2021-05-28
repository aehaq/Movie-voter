# Movie-voter

An app that lets you add and vote on movies


This app uses hoodie (http://hood.ie) as an open source alternative to firebase. Hoodie provides offline-first data storage and allows syncing to a database (not yet added). 


## Running

### Regular Method

#### Database
The database is CouchDB. I honestly havent tried setting it up standalone and just use docker. The slightly custom image in this repo automatically configures the database as standalone (not a cluster) since the latest version doesnt do this automatically.

#### Frontend

Once the database is running you may need to set some variables (either in the environment or in `package.json`) as outlined [here](http://docs.hood.ie/en/latest/guides/configuration.html) to tell the frontend about the database

Then open a terminal in the project directory folder and do either `npm install` or `yarn install` depending on your preference. then run `nom start` or `yarn start`. This will start a development server for the app frontend

You should see:
```
Your Hoodie app has started on: http://localhost:8080
Stop server with control + c
```

Now visit http://localhost:8080 in a web browser.

### Docker

1. Build the database image
```bash
cd db
docker build -t vote-db .
cd ../
```
2. Build the frontend image

```bash
docker build -t vote .
```
3. start them both up together using `docker- compose up`
4. Now visit http://localhost:8080 in a web browser.

## My Goal

To be able to run this app in a docker environment and create a multi-user movie voting experience.

### TODO's
- [ ] restrict votes to a certain number per user/device
- [ ] Dockerize
  - [ ] storage volume for hoodie data and/or couchdb data