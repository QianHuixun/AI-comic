import express from 'express';
import routes from './routes.ts';
const app = express();
const PORT = 3000;
app.use(express.json());
routes(app);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});