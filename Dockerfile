FROM jenkins/jenkins:lts-jdk11
FROM node:14.19.1

WORKDIR /app
COPY package.json ./
  
RUN  useradd -m admin && echo "admin:admin" |  chpasswd
RUN yarn install

COPY . .
CMD ["yarn", "start"]
 