FROM node:18

WORKDIR /code

ENV MYSQL_HOST="db"
# ENV MYSQL_USER="VFnQWe9CBu"
# ENV MYSQL_PASSWORD="h9zzTIpFFn"
# ENV MYSQL_DATABASE="VFnQWe9CBu"
# ENV MYSQL_PORT=3306
# ENV REDIS_URL="redis://:pfb8d54f2db09ce7547061df7ac5f9a1e7deecefbeebcab505bf7eee6e9ea31ad@ec2-54-77-84-198.eu-west-1.compute.amazonaws.com:18230"
# ENV ADMINUSERNAME="admin"
# ENV ADMINPASSWORD="admin"
# ENV PORT 80
# ENV SESSION_SECRET="thisisasecretsesionhahahahha"
# ENV NODE_ENV="development"

COPY package.json /code/package.json

RUN npm install

COPY . /code

RUN chmod +x wait-for-it.sh

CMD [ "./wait-for-it.sh" , "db:3306" , "--strict" , "--timeout=300" , "--" , "node", "src/bin/www" ]