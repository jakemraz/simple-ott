import json

def handler(event, context):
    print('create_token')
    print(event)

    body = event.get('body', {})
    body = json.loads(body) if body != {} else {}
    print(body)

    res = {
        "code": 0,
        "token": "1111"
    }

    return respond(200, json.dumps(res))


def respond(statusCode, body):
    return {
        'statusCode': statusCode,
        'body': body
    }