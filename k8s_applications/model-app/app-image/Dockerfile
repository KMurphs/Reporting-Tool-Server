FROM node:8.12.0-alpine

ENV PORT=5000 

ENV REDIS_PORT=6379
ENV REDIS_DB_HOST=dbs_temp
ENV REDIS_DB_PASSWORD=52F6F45612444B372B117DCCDC45A

ENV MYSQL_PORT=3306
ENV MYSQL_DB_USER=tester
ENV MYSQL_DB_HOST=dbs_temp
ENV MYSQL_DB_NAME=test_schema
ENV MYSQL_DB_PASSWORD=Tester321!

ENV LOG_LEVEL_FILE=info
ENV LOG_LEVEL_CONSOLE=debug

RUN apk update && apk add bash
RUN npm install pm2 -g


RUN mkdir -p /server
ADD . /server
WORKDIR /server
RUN npm install --production


EXPOSE 5000


# CMD ["npm", "run", "start"]
# CMD [ "pm2-runtime", "npm", "--", "start" ]
# CMD [ "pm2-runtime", "node", "index.js" ]
CMD [ "pm2-runtime", "index.js" ]






# docker build -t cloud.canister.io:5000/kmurphs/reporting-model:latest -f k8s_applications\model-app\app-image\Dockerfile k8s_applications\model-app\
# docker run --name model_app --net=testnetwork -p 5001:5000 cloud.canister.io:5000/kmurphs/reporting-model