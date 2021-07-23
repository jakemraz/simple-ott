import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as path from 'path';
import { AppContext } from '../lib/app-context';


export class SimpleOttStack extends cdk.Stack {

  private readonly table: ddb.ITable;
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    this.table = new ddb.Table(this, 'OttTable', {
      partitionKey: { name: 'token', type: ddb.AttributeType.STRING },
      timeToLiveAttribute: 'TTL',
    });

    const api = new apigw.RestApi(this, 'RestApi', {
      deployOptions: {
        stageName: AppContext.getInstance().env
      },
    })

    const createToken = this.createLambdaFunction('CreateToken', 'create_token.handler', );
    const checkToken = this.createLambdaFunction('CheckToken', 'check_token.handler');
    this.table.grantFullAccess(createToken);
    this.table.grantReadData(checkToken);
    
    const token = api.root.addResource('token')
    token.addMethod('POST', new apigw.LambdaIntegration(createToken));
    token.addMethod('GET', new apigw.LambdaIntegration(checkToken));
    
  }

  private createLambdaFunction(id: string, handler: string) {
    return new lambda.Function(this, id, {
      code: lambda.Code.fromAsset(path.resolve(__dirname, '..', 'functions', 'apis')),
      runtime: lambda.Runtime.PYTHON_3_8,
      handler,
      environment: {
        OTT_TABLE: this.table.tableName
      },
    });
  }

}
