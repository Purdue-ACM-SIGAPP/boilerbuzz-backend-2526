# Boilerbuzz Backend

Express + TypeScript API for Boilerbuzz.

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Server base URL: `http://localhost:3000`

Swagger UI: `http://localhost:3000/api-docs`

## Build

```bash
npm run build
npm start
```

## API Routes

All routes are mounted under `/api`.

- `GET /api` health message
- `GET /api/poster` list posters
- `GET /api/poster/:id` get poster by id
- `POST /api/poster` create poster
- `PUT /api/poster/:id` update poster
- `DELETE /api/poster/:id` delete poster
- `POST /api/posters/search` search posters by tag/date

- `GET /api/club` list clubs
- `GET /api/club/:id` get club by id
- `POST /api/club` create club
- `PUT /api/club/:id` update club
- `DELETE /api/club/:id` delete club

- `GET /api/user` list users
- `GET /api/user/:id` get user data
- `POST /api/user` create user
- `POST /api/user/:id` no-op settings update placeholder
- `DELETE /api/user/:id` delete user data

- `GET /api/user/settings` list user settings
- `GET /api/user/settings/:id` get user settings by user id
- `POST /api/user/settings` create user settings
- `DELETE /api/user/settings/:id` delete user settings

- `POST /api/userClub/create` create club and assign admin
- `POST /api/userClub/invite` invite admin to club
- `DELETE /api/userClub/remove` remove admin from club

- `POST /api/userPosterBookmarks` create bookmark
- `GET /api/userPosterBookmarks/:userId` list bookmarks for user
- `GET /api/userPosterBookmarks/:userId/:posterId` get specific bookmark
- `DELETE /api/userPosterBookmarks/:userId/:posterId` delete bookmark

## Database Scripts

Schema scripts are under `src/scripts/`.

Recommended order for fresh setup:

1. `create_user_table.sql`
2. `club.sql`
3. `userpostpermissions.sql`
4. `poster.sql`
5. `tags.sql`
6. `poster_tag.sql`
7. `user_settings.sql`
8. `user_club.sql`
9. `userposterbookmark.sql`
10. `userposterlike.sql`
