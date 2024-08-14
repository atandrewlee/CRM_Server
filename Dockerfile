# Dockerfile

FROM node:22-alpine
RUN apk update && apk add tzdata
ENV TZ="America/New_York"
RUN date
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY / .
RUN npm install
EXPOSE 3000
CMD [ "npm", "run", "start-no-env-output" ]