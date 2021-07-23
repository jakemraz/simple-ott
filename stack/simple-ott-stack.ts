import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as ddb from '@aws-cdk/aws-dynamodb';
import { AppContext } from '../lib/app-context';
import { ApiLambdas } from '../constructs/api-lambdas';

export class SimpleOttStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const table = new ddb.Table(this, 'OttTable', {
      partitionKey: { name: 'token', type: ddb.AttributeType.STRING },
      timeToLiveAttribute: 'TTL'
    });

    const api = new apigw.RestApi(this, 'RestApi', {
      deployOptions: {
        stageName: AppContext.getInstance().env
      },
    })

    const lambdas = new ApiLambdas(this, 'Lambdas');
    table.grantFullAccess(lambdas.createToken);
    table.grantReadData(lambdas.checkToken);
    
    const token = api.root.addResource('token')
    token.addMethod('POST', new apigw.LambdaIntegration(lambdas.createToken));
    token.addMethod('GET', new apigw.LambdaIntegration(lambdas.checkToken));
    
  }

}
