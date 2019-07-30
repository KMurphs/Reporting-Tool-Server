FROM node:8.12.0-alpine
RUN mkdir -p /server
ADD package.json /server
WORKDIR /server
RUN npm install --production
EXPOSE 5000
CMD ["npm", "run", "start"]
ADD . /server