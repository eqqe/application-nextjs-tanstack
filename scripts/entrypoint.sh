#!/bin/sh

set -e

# Todo: replace with prisma migrate deploy
npx prisma db push --force-reset --skip-generate
npx prisma db seed

HOSTNAME="0.0.0.0" node server.js
