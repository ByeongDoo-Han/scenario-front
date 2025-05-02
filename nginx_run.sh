#!/bin/bash

docker run -d --name scenario-nginx \
  --network scenario-net \
  -p 80:80 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v $(pwd)/dist:/usr/share/nginx/html:ro nginx
