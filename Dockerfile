#base image
FROM node:10.17

#set working dir
WORKDIR /app

#add app node mod to path
ENV PATH /app/node_modules/.bin:$PATH

#install and casche app cependencies
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install -g --silent react-scripts@3.3.0
RUN npm install -g serve

COPY build/ /app

CMD ["serve", "-l","7500", "-s", "/app"]