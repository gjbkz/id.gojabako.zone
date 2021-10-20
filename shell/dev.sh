#!/bin/sh
export AWS_PROFILE=id.gojabako.zone
npm run build:aws --workspace=@id.gojabako.zone/aws || exit 1
npm run dev --workspace=@id.gojabako.zone/webui
