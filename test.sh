#! /bin/sh

docker-compose up -d
# list-topics will wait until kafka starts
echo "Waiting for Kafka"
./list-topics.sh 1> /dev/null
./node.sh npm test
docker-compose down
