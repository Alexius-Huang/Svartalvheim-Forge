import ApplicationController from './ApplicationController';
import CareerExperience from '../models/CareerExperience';
import { BaseURL, BaseModel, Restful } from '../utils/RestfulDecorators';

@Restful()
@BaseURL('/career-experience')
@BaseModel(CareerExperience)
class CareerExperienceController extends ApplicationController {}

export default CareerExperienceController;
