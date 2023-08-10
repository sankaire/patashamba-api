[
    {
        "name": "api",
        "image": "${api_image}",
        "essential": true,
        "memoryReservation": 2048,
        "environment": [
            {"name": "DB_URI", "value": "${DB_URI}"},
            {"name": "API_KEY", "value": "${DB_URI}"},
            {"name": "USERNAME", "value": "${DB_URI}"}
           
        ],
        "logConfiguration": {
            "logDriver": "awslogs",
            "options": {
                "awslogs-group": "${log_group_name}",
                "awslogs-region": "${log_group_region}",
                "awslogs-stream-prefix": "api"
            }
        },
        "portMappings": [
            {
                "containerPort": 5000,
                "hostPort": 5000
            }
        ]
    }
]
