# [Dmytro Skliarenko](mailto:sklyarenkodmitry@gmail.com) wefox frontend challenge

* The project was written on _TypeScript_, using _SASS_ for styles;
* _React-router_ is used for routing;
* _axios_ for fetching data from backend;
* Longitude and latitude showed on _react-simple-maps_
* Redux is not used since IMO it's a bit redundant here
* _@testing-library_ with _jest_ are used for tests, _msw_ for mocking API


## How to run API server
* Pull image: `docker pull wefoxgroup/wg-web-challenge:latest`
* Start the server API: `docker run --rm -p 3000:3000 wefoxgroup/wg-web-challenge`

## How to run frontend locally
* Install dependencies `npm i`
* Run application `npm start`
* Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

## How to run frontend with Docker
* Build the image `docker build . -t dmytro-skliarenko-wefox-tech-assignment`
* Run the application `docker run -p 3001:3001 -d dmytro-skliarenko-wefox-tech-assignment`
* Open [http://localhost:3001](http://localhost:3001) to view it in the browser.
