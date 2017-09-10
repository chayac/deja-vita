Deja-Vita
=========
This project provides a Python-based CLI to retrieve actors and characters for a specific video game and load them into a local DynamoDB instance. A Javascript-based frontend then accesses the DynamoDB instance to display what characters a given actor has played.

# Setup
* Follow instructions to setup a local DynamoDB instance: http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html
* Install the AWS Javascript SDK:
```shell
npm install aws-sdk
```
* Install Python dependencies:
```shell
pip install boto3
pip install beautifulscraper
```
* Start up the local Dynamo instance: 
```shell
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

# Populating the DynamoDB tables
Use the CLI to scrape data from IMDB. Commands take the format of "python cli.py --name <> --url <>". The IMDB URL should be the full credits page with all cast, not the main page.
For example: 
```shell
python cli.py --name Firewatch --url http://www.imdb.com/title/tt4785654/fullcredits/
```