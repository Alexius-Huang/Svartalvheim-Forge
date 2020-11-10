import { Request, Response } from 'express';
import ApplicationController from './ApplicationController';
import CareerExperience from '../models/CareerExperience';
import { BaseURL, Restful, DELETE, GET, POST, PUT } from '../utils/RestfulDecorators';
import { useConnection } from '../utils/useConnection';
import { BaseModel } from '../utils/ModelDecorators';

@Restful()
@BaseURL('/career-experience')
@BaseModel(CareerExperience)
class CareerExperienceController extends ApplicationController {

  @POST('/new')
  public new(req: Request, res: Response) {
    const careerExperience = new CareerExperience();
    const { body } = req;
    careerExperience.company = body.company;
    careerExperience.startMonth = body.startMonth;
    careerExperience.startYear = body.startYear; 
    careerExperience.endMonth = body.endMonth;
    careerExperience.endYear = body.endYear;
    careerExperience.position = body.position;
    careerExperience.tags = body.tags ? JSON.parse(body.tags) : [];
    careerExperience.description = body.description ? JSON.parse(body.description) : [];
    careerExperience.createdAt = new Date();
    careerExperience.updatedAt = new Date(careerExperience.createdAt);

    useConnection(async (conn) => {
      const repo = conn.getRepository(CareerExperience);
      const result = await repo.save(careerExperience);
      return res.json(result);
    }).catch(error => res.json(error));
  }

  @PUT('/:id')
  public update(req: Request, res: Response) {
    useConnection(async (conn) => {
      const repo = conn.getRepository(CareerExperience);
      const { body } = req;
      const careerExperience = await repo.findOne(req.params.id);

      if (!careerExperience) {
        throw new Error(`\`CareerExperience\` data with id: ${req.params.id} not exist`);
      }

      careerExperience.company = body.company ?? careerExperience.company;
      careerExperience.startMonth = body.startMonth ?? careerExperience.startMonth;
      careerExperience.startYear = body.startYear ?? careerExperience.startYear;
      careerExperience.endMonth = body.endMonth ?? careerExperience.endMonth;
      careerExperience.endYear = body.endYear ?? careerExperience.endYear;
      careerExperience.position = body.position ?? careerExperience.position;
      careerExperience.tags = body.tags ? JSON.parse(body.tags) : careerExperience.tags;
      careerExperience.description = body.description ? JSON.parse(body.description) : careerExperience.description;
      careerExperience.updatedAt = new Date();

      const result = await repo.save(careerExperience);
      return res.json(result);
    }).catch(error => res.json(error));
  }

  @DELETE('/:id')
  public delete(req: Request, res: Response) {
    useConnection(async (conn) => {
      const repo = conn.getRepository(CareerExperience);
      const careerExperience = await repo.findOne(req.params.id);

      if (!careerExperience) {
        throw new Error(`\`CareerExperience\` data with id: ${req.params.id} not exist`);
      }

      await repo.remove(careerExperience);
      return res.json({ message: 'Removed' });
    }).catch(error => res.json(error));
  }

}

export default CareerExperienceController;
