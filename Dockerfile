FROM node:18

WORKDIR /code

COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json

RUN npm ci --omit=dev

COPY . /code

RUN chmod +x wait-for-it.sh

CMD [ "./wait-for-it.sh" , "db:3306" , "--strict" , "--timeout=300" , "--" , "node", "src/bin/www" ]