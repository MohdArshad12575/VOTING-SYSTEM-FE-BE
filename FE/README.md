# Voting Frontend (FE)

Production-style frontend scaffold for your voting backend APIs.

## Stack

- React + Vite
- React Router
- Axios

## Project Structure

```txt
FE/
  src/
    api/
    components/
      common/
      layout/
    constants/
    context/
    hooks/
    pages/
      auth/
      voter/
      admin/
    routes/
    styles/
    utils/
```

## Setup

1. Copy env file:
   - `.env.example` -> `.env`
2. Install dependencies:
   - `npm install`
3. Start dev server:
   - `npm run dev`

## Environment

- `VITE_API_BASE_URL=http://localhost:3001`

## API Coverage

- `POST /user/login`
- `POST /user/signup`
- `POST /user/profile`
- `PUT /user/profile/updatepassword`
- `GET /user/candidates`
- `POST /user/vote/:candidateid`
- `GET /user/vote/count`
- `POST /admin/create`
- `PUT /admin/update/:id`
- `DELETE /admin/delete/:id`
