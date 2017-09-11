# Run this file to populate the local DynamoDB instance
# Start up Dynamo local: java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb

import boto3
import time

# Get the service resource.
dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:8000')

# Uncomment if you need to start over
# all_games = dynamodb.Table('all_games')
# all_games.delete()
# game_titles = dynamodb.Table('game_titles')
# game_titles.delete()

# Create the DynamoDB table for game, actor, and character.
all_games = dynamodb.create_table(
    TableName='all_games',
    KeySchema=[
        {
            'AttributeName': 'game_name',
            'KeyType': 'HASH'
        },
        {
            'AttributeName': 'actor_name',
            'KeyType': 'RANGE'
        }
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'game_name',
            'AttributeType': 'S'
        },
        {
            'AttributeName': 'actor_name',
            'AttributeType': 'S'
        },
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5
    }
)

print(all_games)


# Create table for unique game titles.
game_titles = dynamodb.create_table(
    TableName='game_titles',
    KeySchema=[
        {
            'AttributeName': 'game_name',
            'KeyType': 'HASH'
        },
    ],
    AttributeDefinitions=[
        {
            'AttributeName': 'game_name',
            'AttributeType': 'S'
        },
    ],
    ProvisionedThroughput={
        'ReadCapacityUnits': 5,
        'WriteCapacityUnits': 5
    }
)

print(game_titles)

# Create indexes for actor/character/game table
# dynamodb = boto3.client('dynamodb', endpoint_url='http://localhost:8000')

# Wait for table to become active before creating index
status = ''
while status != 'ACTIVE':
    status = all_games.table_status
    time.sleep(5)

# Index on actor and game
response = all_games.update(
    AttributeDefinitions=[
        {
            "AttributeName": "game_name",
            "AttributeType": "S"
        },
        {
            "AttributeName": "actor_name",
            "AttributeType": "S"
        }
    ],
    TableName='all_games',
    GlobalSecondaryIndexUpdates=[
        {
            'Create': {
                'IndexName': 'actor_game',
                'KeySchema': [
                    {
                        'AttributeName': 'actor_name',
                        'KeyType': 'HASH'
                    },
                    {
                        'AttributeName': 'game_name',
                        'KeyType': 'RANGE'
                    }
                ],
                'Projection': {
                    'ProjectionType': 'ALL',
                },
                'ProvisionedThroughput': {
                    'ReadCapacityUnits': 123,
                    'WriteCapacityUnits': 123
                }
            },
        },
    ]
    )

print(response)

# Wait for table to become active before creating index
status = ''
while status != 'ACTIVE':
    status = all_games.table_status
    time.sleep(5)

response = all_games.update(
    AttributeDefinitions=[
        {
            "AttributeName": "character_name",
            "AttributeType": "S"
        },
        {
            "AttributeName": "game_name",
            "AttributeType": "S"
        }
    ],
    TableName='all_games',
    GlobalSecondaryIndexUpdates=[
        {
            'Create': {
                'IndexName': 'character_title',
                'KeySchema': [
                    {
                        'AttributeName': 'character_name',
                        'KeyType': 'HASH'
                    },
                    {
                        'AttributeName': 'game_name',
                        'KeyType': 'RANGE'
                    }
                ],
                'Projection': {
                    'ProjectionType': 'ALL',
                },
                'ProvisionedThroughput': {
                    'ReadCapacityUnits': 123,
                    'WriteCapacityUnits': 123
                }
            },
        },
    ]
    )

print(response)
