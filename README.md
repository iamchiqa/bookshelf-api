# Bookshelf API
A RESTful API built with JavaScript, Node.js, and Express.js for managing book collections.

## Features
- Add new books to the collection
- Retrieve all books and book details
- Update existing book information
- Delete books from the collection
- Filter books by name, reading status, and finished status
- Validate book data and handle errors
- Maintain consistent code style using ESLint
- Support API testing with Postman

## Technologies Used
- JavaScript
- Node.js
- Express.js
- ESLint
- Postman

## Project Structure
```
bookshelf-api/
├── src/
│   ├── books.js
│   ├── handler.js
│   ├── routes.js
│   └── server.js
├── package.json
├── package-lock.json
└── eslint.config.js
```

## Installation
1. Clone this repository:
   ```
   git clone https://github.com/iamchiqa/bookshelf-api.git
   ```

2. Navigate to the project directory:
   ```
   cd bookshelf-api
   ```

3. Install dependencies:
   ```
   npm install
   ```

## Running the Application
Start the server using:
```
npm run start
```

The API runs at:
```
http://localhost:9000
```

## API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | `/books` | Add a new book |
| GET | `/books` | Retrieve all books |
| GET | `/books/{bookId}` | Retrieve book details |
| PUT | `/books/{bookId}` | Update a book |
| DELETE | `/books/{bookId}` | Delete a book |

## Query Parameters
The `GET /books` endpoint supports the following query parameters:
- `name` – Filter books by name (case-insensitive).
- `reading` – Filter books by reading status (`0` or `1`).
- `finished` – Filter books by completion status (`0` or `1`).

**Examples:**
```
GET /books?name=dicoding
GET /books?reading=1
GET /books?finished=0
```

## Code Linting
Check code consistency using ESLint:
```
npx eslint .
```

## API Testing
API testing can be performed using Postman with the Bookshelf API Test Collection and Environment provided by Dicoding.
Import both files into Postman to run the available API tests.

## Data Storage
Book data is stored in memory without using an external database or JSON file as a data storage mechanism.

## Project Information
This project was developed as part of the **Belajar Back-End Pemula dengan JavaScript** course by Dicoding, focusing on RESTful API development using Node.js and Express.js.

## Repository
GitHub: [iamchiqa/bookshelf-api](https://github.com/iamchiqa/bookshelf-api/)
