import 'reflect-metadata';
import dotenv from 'dotenv';
import App from './app';

import * as bodyParser from 'body-parser';
import loggerMiddleware from './middleware/logger';

import controllers from './controllers';

// Load environment variables from .env file
dotenv.config();

const app = new App({
  port: 5000,
  controllers,
  middleWares: [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    loggerMiddleware
  ]
});

app.listen();

// createConnection().then(async connection => {
//   let ce = new CareerExperience();
//   ce.company = 'Environmental Management Consultant Technologies, Inc.';
//   ce.startMonth = 7;
//   ce.startYear = 2018;
//   ce.endMonth = 6;
//   ce.endYear = 2019;
//   ce.position = 'Freelance Front-End Engineer';
//   ce.tags = [
//     'VueJS',
//     'Nuxt Framework',
//     'Government Project',
//     'Data Visualization',
//     'Browser Compatibility',
//     'SSR'
//   ];
//   ce.description = [
//     'Negotiation skills developed while also understand the client\'s needs.',
//     'Worked on two government projects using VueJS and Nuxt framework',
//     'Both Front-End projects are built independently',
//     'Support IE > 11'
//   ];
//   ce.createdAt = new Date();
//   ce.updatedAt = new Date(ce.createdAt);

//   const ceRepo = connection.getRepository(CareerExperience);

//   const savedCE = await ceRepo.save(ce);
//   console.log("CE has been saved. CE id is", savedCE.id);

//   const fetchedCE = await ceRepo.findOne(savedCE.id);

//   console.log("fetched ce: ", fetchedCE);
// }).catch(error => console.log(error));
