#!/bin/sh

set -e

npx prisma db push --force-reset --skip-generate
npx prisma db seed

HOSTNAME="0.0.0.0" node server.js
