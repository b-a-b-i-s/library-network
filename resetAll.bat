docker compose -f docker-compose-mysql.yml stop
docker compose -f docker-compose-mysql.yml kill
docker compose -f docker-compose-mysql.yml rm -f
docker volume rm library-network_mysql-data
docker compose -f docker-compose-mysql.yml up -d

docker compose stop
docker compose kill
docker compose rm -f
docker compose up -d --build
docker compose logs -f