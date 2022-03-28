# Northcoders News API

## Background

This project builds an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

## Notes for developers cloning this repository

The projects .gitignore includes .env.\* paths, so these instructions explain what files you must add in order to successfully connect to the two Postgres databases locally with the necessary environment variables.

There are two databases in this project, one for real looking dev data and another for simpler test data.

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment: nc_news_test and nc_news, respectively. You should double check that these .env files are .gitignored.

You have also been provided with a db folder with some data, a setup.sql file and a seeds folder:

1. topicData
2. articleData
3. userData
4. commentData
