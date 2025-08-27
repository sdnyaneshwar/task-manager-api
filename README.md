 A RESTful API for managing tasks with user authentication and file upload support, built with Node.js, Express, and JSON file storage.

 ## Setup Instructions
 1. Clone the repository.
 2. Run `npm install` to install dependencies.
 3. Create a `.env` file with `PORT=3000` and `JWT_SECRET=your_jwt_secret_key`.
 4. Ensure an `uploads` folder exists in the project root.
 5. Run `node server.js` to start the server.
 6. Test the API using Postman or any API client.

 ## Endpoints

 ### Authentication
 - **POST /api/auth/signup**  
   Register a new user.  
   **Body**: `{ "username": "string", "email": "string", "password": "string" }`  
   **Response**: `{ "message": "User registered successfully" }`

 - **POST /api/auth/login**  
   Login and receive a JWT token.  
   **Body**: `{ "email": "string", "password": "string" }`  
   **Response**: `{ "token": "jwt_token" }`

 ### Task Management (Requires Authentication)
 - **POST /api/tasks**  
   Create a new task with optional file attachment.  
   **Headers**: `Authorization: Bearer <jwt_token>`  
   **Body**: Form-data with `title: string`, `description: string`, `dueDate: YYYY-MM-DD`, `status: pending|completed` (optional), `file: file` (optional)  
   **Response**: `{ "message": "Task created successfully", "task": { ... } }`

 - **GET /api/tasks**  
   Get tasks with optional filtering, searching, and pagination.  
   **Headers**: `Authorization: Bearer <jwt_token>`  
   **Query Params**: `status=pending|completed`, `search=string`, `page=number`, `limit=number`  
   **Response**: `{ "total": number, "page": number, "limit": number, "tasks": [...] }`

 - **PUT /api/tasks/:id**  
   Update a task with optional file attachment.  
   **Headers**: `Authorization: Bearer <jwt_token>`  
   **Body**: Form-data with `title: string`, `description: string`, `dueDate: YYYY-MM-DD`, `status: pending|completed` (optional), `file: file` (optional)  
   **Response**: `{ "message": "Task updated successfully", "task": { ... } }`

 - **DELETE /api/tasks/:id**  
   Delete a task.  
   **Headers**: `Authorization: Bearer <jwt_token>`  
   **Response**: `{ "message": "Task deleted successfully" }`

 ## File Upload Notes
 - Files are stored in the `/uploads` folder and can be accessed via `http://localhost:3000/uploads/filename`.
 - Use form-data in Postman to upload files with the `file` key.