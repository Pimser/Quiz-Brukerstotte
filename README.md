# Quiz Application

## Overview
This is a Node.js + Express application for managing quizzes. It includes user authentication, quiz creation, and admin functionalities.

## Features
- User login and registration
- Create, view, edit, and delete quizzes
- Admin panel to manage users and quizzes

## Endpoints

### Authentication
- **POST /auth/login**: Login a user
- **POST /auth/register**: Register a new user

### Quizzes
- **POST /quizzes**: Create a new quiz
- **GET /quizzes**: Get all quizzes
- **GET /quizzes/:id**: Get a single quiz by ID
- **GET /quizzes/view/:id**: Render the view quiz page
- **GET /quizzes/edit/:id**: Render the edit quiz page
- **PUT /quizzes/:id**: Update a quiz by ID
- **DELETE /quizzes/:id**: Delete a quiz by ID

### Admin
- **GET /admin/users**: Get all users
- **DELETE /admin/quizzes/:id**: Delete a quiz by ID

## Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Create a `.env` file with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/quiz_app
   JWT_SECRET=your_jwt_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Technologies Used
- Node.js
- Express
- MongoDB
- Mongoose
- EJS
- Argon2
- JSON Web Tokens (JWT)
- Express Validator
- Express Rate Limit

## License
This project is licensed under the MIT License.