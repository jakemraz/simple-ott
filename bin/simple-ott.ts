#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SimpleOttStack } from '../stack/simple-ott-stack';
import { AppContext } from '../lib/app-context';

const app = new cdk.App();
const env = app.node.tryGetContext("env")==undefined?'dev':app.node.tryGetContext("env");

AppContext.getInstance().initialize({
    applicationName: 'simple-ott',
    deployEnvironment: env
})

new SimpleOttStack(app, 'SimpleOttStack');
