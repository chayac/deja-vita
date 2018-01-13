# coding: utf-8
from flask import Flask, redirect, request, render_template, jsonify
import boto3
import imdb

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/new_game', methods=["POST"])
def new_game():
    if request.method == "POST":
        imdb.get_actors(
            request.form['game_name'],
            request.form['imdb_url'])
    return redirect('/')


@app.route('/get_actor_data', methods=["POST"])
def get_actor_data():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('all_games')
    response = table.query(
        ProjectionExpression='game_name, character_name',
        ExpressionAttributeValues={
           ':a': request.form['actor'],
        },
        KeyConditionExpression='actor_name = :a',
        TableName='all_games',
        IndexName='actor_game',
    )
    return jsonify(response)


@app.route('/get_character_data', methods=["POST"])
def get_character_data():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('all_games')
    response = table.query(
        ProjectionExpression='character_name, actor_name',
        ExpressionAttributeValues={
            ':t': request.form['title'],
        },
        KeyConditionExpression='game_name = :t',
        TableName='all_games',
    )
    return jsonify(response)


@app.route('/get_title_data')
def get_title_data():
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('game_titles')
    response = table.scan(
        TableName="game_titles"
    )
    return jsonify(response["Items"])


if __name__ == '__main__':
    app.run(debug=True)
