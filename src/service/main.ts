import express from 'express';
import { AuthRouter } from './router/auth.router/index.ts';
const app = express();
const PORT = 3000;
app.use(express.json());
app.use("/api/auth", AuthRouter)
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});