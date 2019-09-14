#! /bin/sh

docker run --network=host --rm -it -v `pwd`:/workspace -w /workspace node:10.16 $@
