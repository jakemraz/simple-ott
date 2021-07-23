import json
import logging
import os
import boto3
from botocore.exceptions import ClientError

logger = logging.getLogger('create-token')
logger.setLevel(logging.INFO)
ddb = boto3.resource('dynamodb')
table = ddb.Table(os.environ['OTT_TABLE'])

def handler(event, context):
    query = event.get('queryStringParameters', None)
    if query == None:
        return respond(400, {
            "code": 1,
            "message": "Missing parameters",
            "verified": False
        })

    id = query.get('id', None)
    token = query.get('token', None)

    if id == None or token == None:
        return respond(400, {
            "code": 1,
            "message": "Missing parameters: id, token",
            "verified": False
        })

    try:
        response = table.get_item(Key={'token': token})
    except ClientError as e:
        return respond(400, {
            "code": 2,
            "message": e.response['Error']['Message'],
            "verified": False
        })

    item = response.get('Item', None)
    logger.info(item)
    if item == None:
        return respond(200, {
            "code": 3,
            "message": "not verified",
            "verified": False
        })

    if item.get('id', None) != id:
        return respond(200, {
            "code": 3,
            "message": "not verified",
            "verified": False
        })

    return respond(200, {
        "code": 0,
        "message": "verified",
        "verified": True
    })


def respond(statusCode, body):
    return {
        'statusCode': statusCode,
        'body': json.dumps(body)
    }