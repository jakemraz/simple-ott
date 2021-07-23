import json
import logging
import os
import time
import boto3
import secrets

logger = logging.getLogger('create-token')
logger.setLevel(logging.INFO)
ddb = boto3.resource('dynamodb')
table = ddb.Table(os.environ['OTT_TABLE'])

def handler(event, context):
    logger.info(event)

    body = event.get('body', None)
    body = json.loads(body) if body != None else None
    if (body == None):
        return respond(400, {
            'code': 1,
            'message': 'Missing Parameters'
        })

    id = body.get('id', None)
    if (id == None):
        return respond(400, {
            'code': 1,
            'message': 'Missing Parameters: id'
        })
    token = secrets.token_hex(nbytes=4)

    table.put_item(
        Item={
            'token': token,
            'id': id,
            'TTL': int(time.time()) + 86400
        }
    )

    res = {
        'code': 0,
        'token': token
    }

    return respond(200, res)

def respond(statusCode, body):
    return {
        'statusCode': statusCode,
        'body': json.dumps(body)
    }
