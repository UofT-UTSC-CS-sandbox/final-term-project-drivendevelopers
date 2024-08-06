#!/bin/bash

# Variables
DOCKER_IMAGE=htheva/eduprodigi:latest
CONTAINER_NAME=eduprodigi_container

# Stop and remove existing container if it exists
if [ $(docker ps -q -f name=$CONTAINER_NAME) ]; then
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Pull the latest image from Docker Hub
docker pull $DOCKER_IMAGE

# Run the container
docker run -d -p 3000:3000 --name $CONTAINER_NAME $DOCKER_IMAGE
