#!/bin/sh
export AWS_PROFILE=id.gojabako.zone
npm run build:aws || exit 1
npm run dev
