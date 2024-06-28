#!/bin/bash

npx prisma db push  --force-reset
npx prisma db seed
HOSTNAME="0.0.0.0" node server.js
