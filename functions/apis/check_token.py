import json

def handler(event, context):
    print('check_token')
    print(event)

    query = event.get('queryStringParameters', None)
    if query is None:
        return respond(400, {
            "code": 1,
            "message": "Missing parameters",
            "verified": False
        })
    print(query)

    res = {
        "code": 0,
        "message": "success",
        "verified": True
    }

    return respond(200, json.dumps(res))


def respond(statusCode, body):
    return {
        'statusCode': statusCode,
        'body': body
    }