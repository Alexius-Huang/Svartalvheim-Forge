import * as express from 'express';
import { Request, Response } from 'express';
import ControllerBaseInterface from 'interfaces/ControllerBase';

class HomeController implements ControllerBaseInterface {
  public path = '/';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/', this.index);
  }

  private index = (req: Request, res: Response) => {
    const users = [
      {
        id: 1,
        name: 'Ali'
      },
      {
        id: 2,
        name: 'Can'
      },
      {
        id: 3,
        name: 'Ahmet'
      }
    ];

    res.json(users);
  }
}

export default HomeController;
