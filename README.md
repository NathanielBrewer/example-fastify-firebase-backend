# Example NodeJS, Fastify, Firebase Admin, TypeScript project

Live demo available at <https://nathanielbrewer.github.io/example-react-axios-frontend/>

## Stack
- Framework: Fastify
- Build: Node/TypeScript
- Deployed to: [Heroku](<https://www.heroku.com/home>) dyno
- Language: TypeScript
- Database: Firebase

## Routes
- `POST /text`: Add text to database and return UID 
- `GET /text/:id`: Retrieve text by UID
- `POST /file`: Add file and return unique filename
- `GET /file/:filename`: Retrieve file buffer by unique filename
