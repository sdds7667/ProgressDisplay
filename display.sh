#!/bin/bash
make

cd ./build
ls
source venv/bin/activate
if [ "$1" == "--fresh" ]; then
    rm data.pickle
fi
flask run --port 8000
