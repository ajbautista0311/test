
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
  HttpErrors,
  XmlObject,
  JsonSchema
} from '@loopback/rest';
import { FacturaRepository } from '../repositories';
import { Factura } from '../models/factura.model';

export class FacturaController {
  constructor(
    @repository(FacturaRepository)
    public facturaRepository: FacturaRepository,
  ) { }


  // conteo de facuras por nit
  @get('/facturascount/{nit}', {
    responses: {
      '200': {
        description: 'Factura model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async countfornit(
    @param.path.string('nit') nit: string,
    @param.query.object('where', getWhereSchemaFor(Factura)) where?: Where<Factura>,
  ): Promise<Count> {
    where = { "nit": nit };
    return this.facturaRepository.count(where);
  }
  //

  @get('/facturas', {
    responses: {
      '200': {
        description: 'Array of Factura model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Factura, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async traerfacturas(
    @param.query.object('filter', getFilterSchemaFor(Factura)) filter?: Filter<Factura>,
  ): Promise<Factura[]> {

    return this.facturaRepository.find(filter);
  }




  @get('/facturassum/{nit}', {
    responses: {
      '200': {
        description: 'Array of Factura model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Factura, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async sumbynit(
    @param.path.string('nit') nit: string,
    @param.query.object('filter', getFilterSchemaFor(Factura)) filter?: Filter<Factura>,
  ): Promise<Factura[]> {
    //empieza aca---------------------------------------------------------------
    var request = require("request");
    var fs = require("fs");
    var xml2js = require('xml2js');
    var parseString = require('xml2js').parseString;
    var util = require('util');
    var builder = new xml2js.Builder();
    // de xml a json
    //const CONSUMER_KEY='3ecad2e787d79e8e99bacbbe0abb200de68a96580a5ebd5cbe00d4ef6b1a78b6';
    //const CONSUMER_SECRET='e22b720d3f4790831f08234499ce5241b5331b97a1e7d5e8b437bd4ae5aa715a';
    request.get('https://TSTDRV2156523.suitetalk.api.netsuite.com/rest/platform/v1/record/customer', {
    oauth: {
      consumer_key: '3ecad2e787d79e8e99bacbbe0abb200de68a96580a5ebd5cbe00d4ef6b1a78b6',
      consumer_secret: 'e22b720d3f4790831f08234499ce5241b5331b97a1e7d5e8b437bd4ae5aa715a',
      token: '01b5b6cae875ea99d940ce5bbc54cc52db9b8a64833353465c0b00a17fd960e9',
      token_secret: '2d349d39d13ff937397590fd75ff9ad3006f349d17fa2cb50d45460cb256f3dc',
      realm:"TSTDRV2156523"
    }
}, function (err:any, res:any, body:any) {
  if(err) throw err;
  var result = require('querystring').parse(body);
  //console.log(result);
  var es = JSON.stringify(result);
  //var b64 = Buffer.from(es, 'utf8').toString('base64');
  var b64 = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPGZ4OkZhY3REb2NNWAogICAgeG1sbnM6Zng9Imh0dHA6Ly93d3cuZmFjdC5jb20ubXgvc2NoZW1hL2Z4IgogICAgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIKICAgIHhzaTpzY2hlbWFMb2NhdGlvbj0iaHR0cDovL3d3dy5mYWN0LmNvbS5teC9zY2hlbWEvZnggaHR0cDovL3d3dy5teXN1aXRlbWV4LmNvbS9mYWN0L3NjaGVtYS9meF8yMDEwX2YueHNkIj4KICAgIDxmeDpWZXJzaW9uPjc8L2Z4OlZlcnNpb24+CiAgICA8Zng6SWRlbnRpZmljYWNpb24+CiAgICAgICAgPGZ4OkNkZ1BhaXNFbWlzb3I+TVg8L2Z4OkNkZ1BhaXNFbWlzb3I+CiAgICAgICAgPGZ4OlRpcG9EZUNvbXByb2JhbnRlPkZBQ1RVUkE8L2Z4OlRpcG9EZUNvbXByb2JhbnRlPgogICAgICAgIDxmeDpSRkNFbWlzb3I+QUFBMDEwMTAxQUFBPC9meDpSRkNFbWlzb3I+CiAgICAgICAgPGZ4OlJhem9uU29jaWFsRW1pc29yPlNvbDRJVCwgUy5DLjwvZng6UmF6b25Tb2NpYWxFbWlzb3I+CiAgICAgICAgPGZ4OlVzdWFyaW8+QWRtaW5pc3RyYWRvciBOZXRTdWl0ZTwvZng6VXN1YXJpbz4KICAgICAgICA8Zng6QXNpZ25hY2lvblNvbGljaXRhZGE+CiAgICAgICAgICAgICAgICAgPGZ4OkZvbGlvPkNVU1RJTlZDNzwvZng6Rm9saW8+CiAgICAgICAgICAgIDxmeDpUaWVtcG9EZUVtaXNpb24+MjAxOS0xMi0yM1QxMDozOTowMDwvZng6VGllbXBvRGVFbWlzaW9uPgogICAgICAgIDwvZng6QXNpZ25hY2lvblNvbGljaXRhZGE+CiAgICAgICAgPGZ4Okx1Z2FyRXhwZWRpY2lvbj4wMzMyMDwvZng6THVnYXJFeHBlZGljaW9uPgogICAgPC9meDpJZGVudGlmaWNhY2lvbj4KICAgIDxmeDpFbWlzb3I+CiAgICAgICAgPGZ4OlJlZ2ltZW5GaXNjYWw+CiAgICAgICAgICAgIDxmeDpSZWdpbWVuPjYwMTwvZng6UmVnaW1lbj4KICAgICAgICA8L2Z4OlJlZ2ltZW5GaXNjYWw+CiAgICA8L2Z4OkVtaXNvcj4KICAgIDxmeDpSZWNlcHRvcj4KICAgICAgICA8Zng6Q2RnUGFpc1JlY2VwdG9yPk1YPC9meDpDZGdQYWlzUmVjZXB0b3I+CiAgICAgICAgPGZ4OlJGQ1JlY2VwdG9yPkFBQTAxMDEwMUFBQTwvZng6UkZDUmVjZXB0b3I+CiAgICAgICAgPGZ4Ok5vbWJyZVJlY2VwdG9yPkNsaWVudGUgYW7Ds25pbW88L2Z4Ok5vbWJyZVJlY2VwdG9yPgogICAgICAgIDxmeDpVc29DRkRJPkcwMzwvZng6VXNvQ0ZEST4KICAgIDwvZng6UmVjZXB0b3I+CiAgICA8Zng6Q29uY2VwdG9zPgogICAgPGZ4OkNvbmNlcHRvPgogICAgICAgIDxmeDpDYW50aWRhZD4xLjAwMDAwMDwvZng6Q2FudGlkYWQ+CiAgICAgICAgPGZ4OkNsYXZlVW5pZGFkPkU0ODwvZng6Q2xhdmVVbmlkYWQ+CiAgICAgICAgPGZ4OlVuaWRhZERlTWVkaWRhPlN2cjwvZng6VW5pZGFkRGVNZWRpZGE+CiAgICAgICAgPGZ4OkNsYXZlUHJvZFNlcnY+ODAxMDE1MDc8L2Z4OkNsYXZlUHJvZFNlcnY+CiAgICAgICAgPGZ4OkNvZGlnbz5Db25zdWx0b3JpYSBOZXRTdWl0ZTwvZng6Q29kaWdvPgogICAgICAgIDxmeDpEZXNjcmlwY2lvbj5QcnVlYmEgRmFjdHVyYWNpw7NuPC9meDpEZXNjcmlwY2lvbj4KICAgICAgICA8Zng6VmFsb3JVbml0YXJpbz4xMDAuMDA8L2Z4OlZhbG9yVW5pdGFyaW8+IAogICAgICAgIDxmeDpJbXBvcnRlPjEwMC4wMDwvZng6SW1wb3J0ZT4gCiAgICAgICAgPGZ4OkRlc2N1ZW50bz4wLjAwPC9meDpEZXNjdWVudG8+CiAgICAgICAgPGZ4OkltcHVlc3Rvc1NBVD4KICAgICAgICA8Zng6VHJhc2xhZG9zPgogICAgICAgICAgICA8Zng6VHJhc2xhZG8gQmFzZT0iMTAwLjAwIiBJbXBvcnRlPSIxNi4wMCIgSW1wdWVzdG89IjAwMiIgVGFzYU9DdW90YT0iMC4xNjAwMDAiIFRpcG9GYWN0b3I9IlRhc2EiIC8+CiAgICAgICAgPC9meDpUcmFzbGFkb3M+CiAgICAgICAgPC9meDpJbXB1ZXN0b3NTQVQ+CiAgICAgICAgPGZ4Ok9wY2lvbmVzPgogICAgICAgIDwvZng6T3BjaW9uZXM+ICAKICAgIDwvZng6Q29uY2VwdG8+CjwvZng6Q29uY2VwdG9zPgogICAgPGZ4OkltcHVlc3Rvc1NBVCBUb3RhbEltcHVlc3Rvc1RyYXNsYWRhZG9zPSIxNi4wMCI+CiAgICA8Zng6VHJhc2xhZG9zPgogICAgICAgIDxmeDpUcmFzbGFkbyBJbXBvcnRlPSIxNi4wMCIgSW1wdWVzdG89IjAwMiIgVGFzYU9DdW90YT0iMC4xNjAwMDAiIFRpcG9GYWN0b3I9IlRhc2EiIC8+CiAgICA8L2Z4OlRyYXNsYWRvcz4KICAgIDwvZng6SW1wdWVzdG9zU0FUPgogICAgPGZ4OlRvdGFsZXM+CiAgICAgICAgPGZ4Ok1vbmVkYT5NWE48L2Z4Ok1vbmVkYT4KICAgICAgICA8Zng6VGlwb0RlQ2FtYmlvVmVudGE+MTwvZng6VGlwb0RlQ2FtYmlvVmVudGE+CiAgICAgICAgPGZ4OlN1YlRvdGFsQnJ1dG8+MTAwLjAwPC9meDpTdWJUb3RhbEJydXRvPgogICAgICAgIDxmeDpTdWJUb3RhbD4xMDAuMDA8L2Z4OlN1YlRvdGFsPgogICAgICAgIDxmeDpEZXNjdWVudG8+MC4wMDwvZng6RGVzY3VlbnRvPgogICAgICAgIDxmeDpUb3RhbD4xMTYuMDA8L2Z4OlRvdGFsPgogICAgICAgIDxmeDpUb3RhbEVuTGV0cmE+LTwvZng6VG90YWxFbkxldHJhPgogICAgICAgICAgICA8Zng6Rm9ybWFEZVBhZ28+OTk8L2Z4OkZvcm1hRGVQYWdvPgogICAgPC9meDpUb3RhbGVzPgogICAgPGZ4OkNvbXByb2JhbnRlRXg+CiAgICAgICAgPGZ4OlRlcm1pbm9zRGVQYWdvPgogICAgICAgICAgICA8Zng6TWV0b2RvRGVQYWdvPlBQRDwvZng6TWV0b2RvRGVQYWdvPgogICAgICAgIDwvZng6VGVybWlub3NEZVBhZ28+CiAgICA8L2Z4OkNvbXByb2JhbnRlRXg+CjwvZng6RmFjdERvY01YPg=="
  let xmlsolicitud = {'soapenv:Envelope':{'$':{'xmlns:soapenv':'https://www.w3.org/2003/05/soap-envelope/','xmlns:ws':'http://www.fact.com.mx/schema/ws'},'soapenv:Header':[''],'soapenv:Body':[{'ws:RequestTransaction':[{'ws:Requestor':['0c320b03-d4f1-47bc-9fb4-77995f9bf33e'],'ws:Transaction':['CONVERT_NATIVE_XML'],'ws:Country':['MX'],'ws:Entity':['AAA010101AAA'],'ws:User':['0c320b03-d4f1-47bc-9fb4-77995f9bf33e'],'ws:UserName':['PruebaFacturacion'],'ws:Data1':[b64],'ws:Data2':[''],'ws:Data3':['']}]}]}};

  /* let xmlsolicitud ='<soapenv:Envelope xmlns:soapenv="https://www.w3.org/2003/05/soap-envelope/" xmlns:ws="http://www.fact.com.mx/schema/ws">'+
  '<soapenv:Header/>'+
  '<soapenv:Body>'+
     '<ws:RequestTransaction>'+
        '<ws:Requestor>0c320b03-d4f1-47bc-9fb4-77995f9bf33e</ws:Requestor>'+
        '<ws:Transaction>CONVERT_NATIVE_XML</ws:Transaction>'+
        '<ws:Country>MX</ws:Country>'+
        '<ws:Entity>AAA010101AAA</ws:Entity>'+
        '<ws:User>0c320b03-d4f1-47bc-9fb4-77995f9bf33e</ws:User>'+
        '<ws:UserName>PruebaFacturacion</ws:UserName>'+
        '<ws:Data1>PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPGZ4OkZhY3REb2NNWAogICAgeG1sbnM6Zng9Imh0dHA6Ly93d3cuZmFjdC5jb20ubXgvc2NoZW1hL2Z4IgogICAgeG1sbnM6eHNpPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSIKICAgIHhzaTpzY2hlbWFMb2NhdGlvbj0iaHR0cDovL3d3dy5mYWN0LmNvbS5teC9zY2hlbWEvZnggaHR0cDovL3d3dy5teXN1aXRlbWV4LmNvbS9mYWN0L3NjaGVtYS9meF8yMDEwX2YueHNkIj4KICAgIDxmeDpWZXJzaW9uPjc8L2Z4OlZlcnNpb24+CiAgICA8Zng6SWRlbnRpZmljYWNpb24+CiAgICAgICAgPGZ4OkNkZ1BhaXNFbWlzb3I+TVg8L2Z4OkNkZ1BhaXNFbWlzb3I+CiAgICAgICAgPGZ4OlRpcG9EZUNvbXByb2JhbnRlPkZBQ1RVUkE8L2Z4OlRpcG9EZUNvbXByb2JhbnRlPgogICAgICAgIDxmeDpSRkNFbWlzb3I+QUFBMDEwMTAxQUFBPC9meDpSRkNFbWlzb3I+CiAgICAgICAgPGZ4OlJhem9uU29jaWFsRW1pc29yPlNvbDRJVCwgUy5DLjwvZng6UmF6b25Tb2NpYWxFbWlzb3I+CiAgICAgICAgPGZ4OlVzdWFyaW8+QWRtaW5pc3RyYWRvciBOZXRTdWl0ZTwvZng6VXN1YXJpbz4KICAgICAgICA8Zng6QXNpZ25hY2lvblNvbGljaXRhZGE+CiAgICAgICAgICAgICAgICAgPGZ4OkZvbGlvPkNVU1RJTlZDNzwvZng6Rm9saW8+CiAgICAgICAgICAgIDxmeDpUaWVtcG9EZUVtaXNpb24+MjAxOS0xMi0yM1QxMDozOTowMDwvZng6VGllbXBvRGVFbWlzaW9uPgogICAgICAgIDwvZng6QXNpZ25hY2lvblNvbGljaXRhZGE+CiAgICAgICAgPGZ4Okx1Z2FyRXhwZWRpY2lvbj4wMzMyMDwvZng6THVnYXJFeHBlZGljaW9uPgogICAgPC9meDpJZGVudGlmaWNhY2lvbj4KICAgIDxmeDpFbWlzb3I+CiAgICAgICAgPGZ4OlJlZ2ltZW5GaXNjYWw+CiAgICAgICAgICAgIDxmeDpSZWdpbWVuPjYwMTwvZng6UmVnaW1lbj4KICAgICAgICA8L2Z4OlJlZ2ltZW5GaXNjYWw+CiAgICA8L2Z4OkVtaXNvcj4KICAgIDxmeDpSZWNlcHRvcj4KICAgICAgICA8Zng6Q2RnUGFpc1JlY2VwdG9yPk1YPC9meDpDZGdQYWlzUmVjZXB0b3I+CiAgICAgICAgPGZ4OlJGQ1JlY2VwdG9yPkFBQTAxMDEwMUFBQTwvZng6UkZDUmVjZXB0b3I+CiAgICAgICAgPGZ4Ok5vbWJyZVJlY2VwdG9yPkNsaWVudGUgYW7Ds25pbW88L2Z4Ok5vbWJyZVJlY2VwdG9yPgogICAgICAgIDxmeDpVc29DRkRJPkcwMzwvZng6VXNvQ0ZEST4KICAgIDwvZng6UmVjZXB0b3I+CiAgICA8Zng6Q29uY2VwdG9zPgogICAgPGZ4OkNvbmNlcHRvPgogICAgICAgIDxmeDpDYW50aWRhZD4xLjAwMDAwMDwvZng6Q2FudGlkYWQ+CiAgICAgICAgPGZ4OkNsYXZlVW5pZGFkPkU0ODwvZng6Q2xhdmVVbmlkYWQ+CiAgICAgICAgPGZ4OlVuaWRhZERlTWVkaWRhPlN2cjwvZng6VW5pZGFkRGVNZWRpZGE+CiAgICAgICAgPGZ4OkNsYXZlUHJvZFNlcnY+ODAxMDE1MDc8L2Z4OkNsYXZlUHJvZFNlcnY+CiAgICAgICAgPGZ4OkNvZGlnbz5Db25zdWx0b3JpYSBOZXRTdWl0ZTwvZng6Q29kaWdvPgogICAgICAgIDxmeDpEZXNjcmlwY2lvbj5QcnVlYmEgRmFjdHVyYWNpw7NuPC9meDpEZXNjcmlwY2lvbj4KICAgICAgICA8Zng6VmFsb3JVbml0YXJpbz4xMDAuMDA8L2Z4OlZhbG9yVW5pdGFyaW8+IAogICAgICAgIDxmeDpJbXBvcnRlPjEwMC4wMDwvZng6SW1wb3J0ZT4gCiAgICAgICAgPGZ4OkRlc2N1ZW50bz4wLjAwPC9meDpEZXNjdWVudG8+CiAgICAgICAgPGZ4OkltcHVlc3Rvc1NBVD4KICAgICAgICA8Zng6VHJhc2xhZG9zPgogICAgICAgICAgICA8Zng6VHJhc2xhZG8gQmFzZT0iMTAwLjAwIiBJbXBvcnRlPSIxNi4wMCIgSW1wdWVzdG89IjAwMiIgVGFzYU9DdW90YT0iMC4xNjAwMDAiIFRpcG9GYWN0b3I9IlRhc2EiIC8+CiAgICAgICAgPC9meDpUcmFzbGFkb3M+CiAgICAgICAgPC9meDpJbXB1ZXN0b3NTQVQ+CiAgICAgICAgPGZ4Ok9wY2lvbmVzPgogICAgICAgIDwvZng6T3BjaW9uZXM+ICAKICAgIDwvZng6Q29uY2VwdG8+CjwvZng6Q29uY2VwdG9zPgogICAgPGZ4OkltcHVlc3Rvc1NBVCBUb3RhbEltcHVlc3Rvc1RyYXNsYWRhZG9zPSIxNi4wMCI+CiAgICA8Zng6VHJhc2xhZG9zPgogICAgICAgIDxmeDpUcmFzbGFkbyBJbXBvcnRlPSIxNi4wMCIgSW1wdWVzdG89IjAwMiIgVGFzYU9DdW90YT0iMC4xNjAwMDAiIFRpcG9GYWN0b3I9IlRhc2EiIC8+CiAgICA8L2Z4OlRyYXNsYWRvcz4KICAgIDwvZng6SW1wdWVzdG9zU0FUPgogICAgPGZ4OlRvdGFsZXM+CiAgICAgICAgPGZ4Ok1vbmVkYT5NWE48L2Z4Ok1vbmVkYT4KICAgICAgICA8Zng6VGlwb0RlQ2FtYmlvVmVudGE+MTwvZng6VGlwb0RlQ2FtYmlvVmVudGE+CiAgICAgICAgPGZ4OlN1YlRvdGFsQnJ1dG8+MTAwLjAwPC9meDpTdWJUb3RhbEJydXRvPgogICAgICAgIDxmeDpTdWJUb3RhbD4xMDAuMDA8L2Z4OlN1YlRvdGFsPgogICAgICAgIDxmeDpEZXNjdWVudG8+MC4wMDwvZng6RGVzY3VlbnRvPgogICAgICAgIDxmeDpUb3RhbD4xMTYuMDA8L2Z4OlRvdGFsPgogICAgICAgIDxmeDpUb3RhbEVuTGV0cmE+LTwvZng6VG90YWxFbkxldHJhPgogICAgICAgICAgICA8Zng6Rm9ybWFEZVBhZ28+OTk8L2Z4OkZvcm1hRGVQYWdvPgogICAgPC9meDpUb3RhbGVzPgogICAgPGZ4OkNvbXByb2JhbnRlRXg+CiAgICAgICAgPGZ4OlRlcm1pbm9zRGVQYWdvPgogICAgICAgICAgICA8Zng6TWV0b2RvRGVQYWdvPlBQRDwvZng6TWV0b2RvRGVQYWdvPgogICAgICAgIDwvZng6VGVybWlub3NEZVBhZ28+CiAgICA8L2Z4OkNvbXByb2JhbnRlRXg+CjwvZng6RmFjdERvY01YPg==</ws:Data1>'+
        '<ws:Data2></ws:Data2>'+
        '<ws:Data3></ws:Data3>'+
     '</ws:RequestTransaction>'+
  '</soapenv:Body>'+
'</soapenv:Envelope>';
 */
var xmlres = builder.buildObject(xmlsolicitud);
//console.log(xmlres);
  request({har: {
    url: 'https://www.mysuitetest.com/mx.com.fact.wsfront/FactWSFront.asmx',
    method: 'POST',
    headers: [
      {
        name: 'content-type',
        value: 'text/xml'
      }
    ],
    form: {
      mimeType: 'text/xml',
      params: xmlres
    }
  }},
  function(err:any,httpResponse:any,body:any){
    if(err) throw err;

    console.log(body);
    });

    /* var express = require('express');
    var app = express();
    app.post('https://www.mysuitetest.com/mx.com.fact.wsfront/FactWSFront.asmx', function (req:any, res:any) {
    req.set('Content-Type', 'text/xml');
    req.send(xmlsolicitud);
    console.log(req.headers);

    }); */

  });

    filter = { where: { "nit": nit }, fields: { monto: true } };
    var sumador = await this.facturaRepository.find(filter, { disableSanitization: true });
    var total = 0;
    for (let x in sumador) {
      const element = sumador[x];
      total += element.monto;
    }
    throw new HttpErrors.BadRequest(`respuesta:` + total);
    //return sumador;
  }
  //

  @post('/facturas', {
    responses: {
      '200': {
        description: 'Factura model instance',
        content: { 'application/json': { schema: getModelSchemaRef(Factura) } },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Factura, {
            title: 'NewFactura',
            exclude: ['id'],
          }),
        },
      },
    })
    factura: Omit<Factura, 'id'>,
  ): Promise<Factura> {
    return this.facturaRepository.create(factura);
  }

  @get('/facturas/count', {
    responses: {
      '200': {
        description: 'Factura model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Factura)) where?: Where<Factura>,
  ): Promise<Count> {

    return this.facturaRepository.count(where);
  }

  @get('/facturas', {
    responses: {
      '200': {
        description: 'Array of Factura model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Factura, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Factura)) filter?: Filter<Factura>,
  ): Promise<Factura[]> {
    return this.facturaRepository.find(filter);
  }

  @patch('/facturas', {
    responses: {
      '200': {
        description: 'Factura PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Factura, { partial: true }),
        },
      },
    })
    factura: Factura,
    @param.query.object('where', getWhereSchemaFor(Factura)) where?: Where<Factura>,
  ): Promise<Count> {
    return this.facturaRepository.updateAll(factura, where);
  }

  @get('/facturas/{id}', {
    responses: {
      '200': {
        description: 'Factura model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Factura, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.query.object('filter', getFilterSchemaFor(Factura)) filter?: Filter<Factura>
  ): Promise<Factura> {
    return this.facturaRepository.findById(id, filter);
  }

  @patch('/facturas/{id}', {
    responses: {
      '204': {
        description: 'Factura PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Factura, { partial: true }),
        },
      },
    })
    factura: Factura,
  ): Promise<void> {
    await this.facturaRepository.updateById(id, factura);
  }

  @put('/facturas/{id}', {
    responses: {
      '204': {
        description: 'Factura PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() factura: Factura,
  ): Promise<void> {
    await this.facturaRepository.replaceById(id, factura);
  }

  @del('/facturas/{id}', {
    responses: {
      '204': {
        description: 'Factura DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.facturaRepository.deleteById(id);
  }
}
