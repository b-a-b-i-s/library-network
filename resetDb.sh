docker compose -f docker-compose-mysql.yml stop
docker compose -f docker-compose-mysql.yml kill
docker compose -f docker-compose-mysql.yml rm -f
docker volume rm library-network_mysql-data
docker compose -f docker-compose-mysql.yml up -d
docker compose -f docker-compose-mysql.yml logs -f
