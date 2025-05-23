#!/bin/bash

docker buildx build --load --platform linux/amd64 -t scenario-frontend:latest . 
