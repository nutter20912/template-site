# 練習用客戶端模板

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Packages
- [ant-design/ant-design](https://github.com/ant-design/ant-design)
- [remix-run/react-router](https://github.com/remix-run/react-router)
- [react-component/virtual-list](https://github.com/react-component/virtual-list)
- [axios/axios](https://github.com/axios/axios)
- [iamkun/dayjs](https://github.com/iamkun/dayjs)

## Projact feature
- user
    - register
    - login/logout
- post
    - CRUD
- comment
    - CRUD

---
## Setup
### Config
- generate local env file
    ```=bash
    cp .env.example .env
    ```
- configuration env variable
    ```=env
    REACT_APP_{YOUR_KEY}=
    ```
---

## Scripts
### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run build`

Builds the app for production to the `build` folder.

---
## docker image
### `docker-compose up -d`
Builds static resources in nginx container.
Open [http://localhost:3000](http://localhost:3000)