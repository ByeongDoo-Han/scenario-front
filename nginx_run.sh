#!/bin/bash

docker run -d --name scenario-nginx \
  --network scenario-net \
  -p 80:80 nginx:latest
