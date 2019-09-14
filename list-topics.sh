#! /bin/sh

docker run -it --rm \
    --network kafka-node-example_kafka-test \
    bitnami/kafka:2.3.0 kafka-topics.sh --list --zookeeper zookeeper:2181
