import type { Express, Request, Response } from 'express';

const routes = (app: Express) => {
app.get('/', (req: Request, res: Response) => {
res.send('Hello, Express with TypeScript!');
});
};

export default routes;