#base image
FROM node:10.17

#set working dir
WORKDIR /app

#add app node mod to path
ENV PATH /app/node_modules/.bin:$PATH

#install and casche app cependencies
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@3.3.0 -g --silent

COPY build/ /app