import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';

export class ApiLambdas extends cdk.Construct {

  public readonly lambdaExecutionRole: iam.IRole;
  public readonly checkToken: lambda.IFunction;
  public readonly createToken: lambda.IFunction;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.lambdaExecutionRole = new iam.Role(this, 'ApiLambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole' },
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AmazonPersonalizeFullAccess' },
      ],
    });

    this.createToken = this.createLambdaFunction('CreateToken', 'create_token.handler');
    this.checkToken = this.createLambdaFunction('CheckToken', 'check_token.handler');
  }

  private createLambdaFunction(id: string, handler: string) {
    return new lambda.Function(this, id, {
      code: lambda.Code.fromAsset(path.resolve(__dirname, '..', 'functions', 'apis')),
      runtime: lambda.Runtime.PYTHON_3_8,
      role: this.lambdaExecutionRole,
      handler
    });
  }
}