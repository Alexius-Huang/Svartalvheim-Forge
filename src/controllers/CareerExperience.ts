import { Request, Response } from 'express';
import ApplicationController from './ApplicationController';
import { BaseURL, POST } from '../utils/RestfulDecorators';

@BaseURL('/career-experience')
class CareerExperienceController extends ApplicationController {

  @POST()
  public new(req: Request, res: Response) {
    console.log(req.body);

    res.json({ status: 200 });
  }
}

export default CareerExperienceController;
