# Running the project
Run project with docker:`docker compose up`

# Notes

I picked tRPC stack with Prisma as a database ORM. 
In future tRPC allow seamless frontend integration with 100% type safety.
Prisma is very well recommended library for working with databases.

Before request handled by routes it's getting validated with Zod, which allow not to worry about invalid data getting submitted.

You can test the API using the `curl`, I put the examples into `packages/backend/api.sh`.
