#!/bin/sh

set -e

# Todo: replace with prisma migrate deploy
npx prisma migrate deploy
npx prisma db seed

HOSTNAME="0.0.0.0" node server.js
