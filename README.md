# Task Management App

This is a full-stack task management application built with a **Next.js** frontend, a **Flask** REST API backend, and a **PostgreSQL** database. The app allows users to add, view, update, and delete tasks, with a simple and intuitive user interface.

## Features
- **Frontend (Next.js)**:
  - Form to add new tasks.
  - Display a list of tasks fetched from the backend.
  - Options to mark tasks as completed or delete tasks.
  - Basic form validation for task inputs.
- **Backend (Flask REST API)**:
  - REST endpoints for creating, reading, updating, and deleting tasks.
  - Integration with PostgreSQL using SQLAlchemy.
- **Database (PostgreSQL)**:
  - `task` table to store task details (id, name, status).

## Prerequisites
To run this application locally, ensure you have the following installed:
- **Node.js** (v22.15.0) for the Next.js frontend.
- **Python** (3.12.3) for the Flask backend.
- **PostgreSQL** for the database.
- **Git** to clone the repository.


## Project Structure
```
todo-with-flask-and-nextjs/
├── backend/    
│   ├── .venv/
│   ├── src/           
│   │   │── __init__.py
│   │   │── app.py
│   │   │── models.py
│   │   │── routes.py
│   ├── main.py
│   ├── .env
│   ├── requirements.txt
├── frontend/               
│   ├── public/
│   ├── src/
│   │   │── app/
│   │   │   │── tasks/
│   │   │   │   │── [id]/
│   │   │   │   │   │── page.tsx  
│   │   │   │── ui/
│   │   │   │   │── page.tsx
│   │   │   │   │── layout.tsx
│   ├── .env.local
│   ├── package.json
├── README.md               
```


## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/imsnto/todo-with-flask-and-nextjs.git
cd todo-with-flask-and-nextjs
```

### 2. Set Up the Backend (Flask)
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   Create a `.env` file in the `backend/` directory with the following:
   ```
   SQLALCHEMY_DATABASE_URI='postgresql://<username>:<password>@localhost:5432/<database-name>'
   SQLALCHEMY_TRACK_MODIFICATIONS=False
   ```
   Replace `<username>`, and `<password>` with your PostgreSQL credentials.
5. Run the Flask app:
   ```bash
   python main.py
   ```
   The backend will run on `http://localhost:5000`.

### 3. Set Up the Frontend (Next.js)
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the `frontend/` directory:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:5000
   ```
4. Run the Next.js app:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

### 5. Using the Application
1. Open your browser and navigate to `http://localhost:3000`.
2. Use the form to add a new task 
3. View the list of tasks, mark them as completed, or delete them.
4. The frontend communicates with the Flask API, which updates the PostgreSQL database.

## API Endpoints
The Flask backend provides the following REST endpoints:
- **GET /tasks**: Retrieve tasks with pagination. 
    - `page` (optional, default: 1): The page number to retrieve.
    - `per_page` (optional, default: 10): The number of tasks per page.
- **POST /tasks**: Add a new task (expects JSON with `name` and `status`).
- **PATCH /tasks/<id>**: Update task status (expects JSON with `status`).
- **DELETE /tasks/<id>**: Delete a task by ID.