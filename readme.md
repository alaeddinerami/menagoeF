# Menageo 🧼

Menageo is a cross-platform mobile application built with **Expo**, **React Native**, and **NestJS** (backend). It provides services related to cleaning appointments, user management, authentication, and real-time chat between clients and cleaners.

---

## 📦 Project Structure

- **Frontend:** Expo, React Native, Zustand, Redux Toolkit
- **Backend:** NestJS with Mongoose (MongoDB)
- **Real-time Communication:** WebSockets using Socket.IO

---

## 🚀 Getting Started


### Installation

```bash
git clone https://github.com/alaeddinerami/menagoeF.git
cd menageo
npm install
```

### Running the App

#### Start Expo Dev Server

```bash
npm run start
npx expo start
```

To open on a device/emulator:

```bash
npm run android

npm run web
```

---

## ⚙️ Scripts

| Script       | Description                          |
|--------------|--------------------------------------|
| `npm start`  | Launch Expo development server       |
| `npm run web`| Start the web version of the app     |
| `npm run lint`| Run linting and check formatting    |
| `npm run format`| Fix and format code with Prettier |
| `npm run android / ios` | Open app in emulator       |

---

## 📚 API Endpoints

### 🔐 Auth Routes (`/auth`)
| Method | Endpoint        | Description         |
|--------|------------------|---------------------|
| POST   | `/auth/signUp`   | Register a new user |
| POST   | `/auth/login`    | Login a user        |

---

### 👤 User Routes (`/user`)
| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| GET    | `/user`          | Get all users             |
| POST   | `/user`          | Create a new user         |
| GET    | `/user/:id`      | Get a specific user       |
| PATCH  | `/user/:id`      | Update a user             |
| DELETE | `/user/:id`      | Delete a user             |

---

### 📅 Reservation Routes (`/reservations`)
| Method | Endpoint                  | Description                        |
|--------|---------------------------|------------------------------------|
| GET    | `/reservations`           | Get all reservations               |
| POST   | `/reservations`           | Create a new reservation           |
| GET    | `/reservations/cleaner`   | Get reservations by cleaner        |
| GET    | `/reservations/client`    | Get reservations by client         |
| GET    | `/reservations/:id`       | Get reservation by ID              |
| PATCH  | `/reservations/:id`       | Update reservation by ID           |
| DELETE | `/reservations/:id`       | Delete reservation by ID           |

---

### 💬 Chat Routes (`/chat`)
| Method | Endpoint                                            | Description                        |
|--------|-----------------------------------------------------|------------------------------------|
| POST   | `/chat/message`                                     | Send a message                     |
| GET    | `/chat/messages/:userId/:otherUserId`               | Get messages between two users     |
| GET    | `/chat/:userId`                                     | Get all chats for a user           |
| PATCH  | `/chat/message/:messageId/read`                     | Mark message as read               |

---

## 🧪 Tech Stack

- **Frontend:** React Native, Expo,  Redux Toolkit, Tailwind CSS
- **Backend:** NestJS, MongoDB, Mongoose
- **Real-time:** Socket.IO
- **Dev Tools:** ESLint, Prettier, TypeScript

---


