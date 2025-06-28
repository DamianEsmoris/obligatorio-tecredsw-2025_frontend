#!/bin/sh

if [ -n "${REPO_URL}" ]; then
    pushd $(pwd)
    cd /var/www/html
    git clone --depth=1 ${REPO_URL} /var/www/html
    popd
fi

httpd -D FOREGROUND
