import { IRouter } from '../../../../src/core/server';
import axios from 'axios';

export function defineRoutes(router: IRouter) {

  // Route to get data from Opensearch
  router.get(
    {
      path: '/api/enh_ptl/get_data',
      validate: false,
    },
    async (context, request, response) => {

      return response.ok({
        body: {
          ptlEntries: [
            {
              id: 1,
              patientId: "1111111111",
              patientName: {
                firstName: "John",
                lastName: "Smith"
              },
              patientFullName: "John Smith",
              patientDob: "1950-10-01",
              patientAddress: "123 High Street, London, SW19 1AB",
              status: true
            },
            {
              id: 2,
              patientId: "2222222222",
              patientName: {
                firstName: "Sarah",
                lastName: "Jones"
              },
              patientFullName: "Sarah Jones",
              patientDob: "1982-04-02",
              patientAddress: "10 Argyle Street, Glasgow, G1 1DJ",
              status: true            
            },
            {
              id: 3,
              patientId: "3333333333",
              patientName: {
                firstName: "Peter",
                lastName: "Tompkins"
              },
              patientFullName: "Peter Tompkins",
              patientDob: "2001-02-23",
              patientAddress: "54 Station Road, Manchester, ME1 1PP",
              status: false              
            }                        
          ]
        },
      });
    }
  );

  router.post(
    {
      path: '/api/enh_ptl/post_data',
      validate: false,
    },
    async (context, request, response) => {

      axios.post('http://localhost:9200/test-ptl/_doc', {
        headers: {
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
        },
        field1: "This is an updated comment" + request.body
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

      return response.ok({
        body: {
          result : "Updated"
        },
      });
    }
  );
}