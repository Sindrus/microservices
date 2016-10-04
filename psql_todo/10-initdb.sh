#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE todo;
    \c todo
    CREATE TABLE todo (todo_id serial PRIMARY KEY, note varchar(128), done bool, createdon timestamp);
EOSQL
