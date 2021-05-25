# Movie-voter

An app that lets you add and vote on movies


This app uses hoodie (http://hood.ie) as an open source alternative to firebase. Hoodie provides offline-first data storage and allows syncing to a database (not yet added). 


## Running

open a terminal in the `hoodie` folder and do either `npm install` or `yarn install` depending on your preference. then run `nom start` or `yarn start`.

you should see:
```
Your Hoodie app has started on: http://localhost:8080
Stop server with control + c
```

Now open `index.html` in a web browser.


## building with docker

```bash
docker build -t movie-voter .
cd hoodie
docker build -t movie-hoodie .
cd ../
```

## My Goal

To be able to run this app in a docker environment and create a multi-user movie voting experience.

### TODO's
- [ ] restrict votes to a certain number per user/device (maybe add a login system)
- [ ] add a proper database for sharing data between users
- [ ] Dockerize
  - [ ] set up couchdb image
  - [ ] fix port numbers
  - [ ] create docker-compose.yml
  - [ ] storage volume for hoodie data and/or couchdb data