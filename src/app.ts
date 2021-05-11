import * as request from 'request';

const url = 'http://api.weatherstack.com/current?access_key=aeb97bf5fbae1e796215bb0be875d548&query=28.48,-16.31&units=m';


request({url: url, json: true}, (error, response) => {
  if (error) {
    console.log(error);
  } else {
    console.log(response.body);
  }
});