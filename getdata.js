// Functions to retrieve data from DynamoDB local instance

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
AWS.config.update({
    region: "us-west-2",
    endpoint: "http://localhost:8000"   // 3306 is the port where we started our dynamo db 
});

// Create DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

// Get list of game titles in database
function getTitleData() {
	var params = {
	 TableName: "game_titles"
	};

	ddb.scan(params, function(err, data) {
	  if (err) {
	    console.log("Error", err);
	  } else {
	  	console.log(data.Items);
	    // data.Items.forEach(function(element, index, array) {
	    //   console.log(data.Items);
	    // });
	  }
	});
	}

// Returns character and actor
function getCharacterData(title) {
	var title = title;
	var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

	var params = {
	  ProjectionExpression: 'character_name, actor_name',
	  ExpressionAttributeValues: {
	    ':t': title,
	   },
	  KeyConditionExpression: 'game_name = :t',
      TableName: 'all_games',
	};

	docClient.query(params, function(err, data) {
	  if (err) {
	    console.log("Error", err);
	  } else {
	    console.log(data.Items);
	  }
	});

}


// function getCharacterActor(character, title) {
// 	var character = character;
// 	var title = title;
// 	var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

// 	var params = {
// 	  ProjectionExpression: 'actor_name',
// 	  ExpressionAttributeValues: {
// 	    ':c': character,
// 	    ':t': title,
// 	   },
// 	  KeyConditionExpression: 'character_name = :c and game_name = :t',
// 	  TableName: 'all_games',
// 	  IndexName: 'character_title',
// 	};

// 	docClient.query(params, function(err, data) {
// 	  if (err) {
// 	    console.log("Error", err);
// 	  } else {
// 	    console.log(data.Items);
// 	  }
// 	});
// }

// Returns game titles and character names
function getActorData(actor) {
	var actor = actor;
	var docClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

	var params = {
	  ProjectionExpression: 'game_name, character_name',
	  ExpressionAttributeValues: {
	    ':a': actor,
	   },
	  KeyConditionExpression: 'actor_name = :a',
	  TableName: 'all_games',
	  IndexName: 'actor_game',
	};

	docClient.query(params, function(err, data) {
	  if (err) {
	    console.log("Error", err);
	  } else {
	    console.log(data.Items);
	  }
	});
}

getTitleData()
getCharacterData('Firewatch')
// getCharacterActor('Henry', 'Firewatch')
getActorData('Rich Sommer')
