POST API
http://localhost:3000/map/distance

BOBY JSON

{
    "origins": [
        "33.6844,73.0479"
    ],
    "destinations": [
        "34.1986,72.0404"
    ]
}


Result

{
    "status": true,
    "statusCode": 200,
    "message": "",
    "error": "",
    "data": [
        [
            {
                "distance": {
                    "text": "87.9 mi",
                    "value": 141411
                },
                "duration": {
                    "text": "1 hour 52 mins",
                    "value": 6709
                },
                "status": "OK"
            }
        ]
    ]
}