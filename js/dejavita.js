// Functions to retrieve data from DynamoDB local instance

// var AWS = require('aws-sdk');
// AWS.config.loadFromPath('../config.json');
AWS.config.update({
    accessKeyId: "test",
    secretAccessKey: "test",
    region: "us-east-1",
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
      var games = data.Items;
      renderInitDropdown(games);
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
      renderCharacters(data.Items);
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
      renderTable(data.Items);
	  }
	});
}

// getTitleData()
// getCharacterData('Firewatch')
// // getCharacterActor('Henry', 'Firewatch')
// getActorData('Rich Sommer')

// renders character table
function renderCharacters(chars) {
  let renderHTML = "<select id='selectCharacters' class='ui dropdown'>";
  for (var i = 0; i < chars.length; i ++) {
    console.log(chars[i].actor_name)
    renderHTML += "<option value='" + chars[i].actor_name + "'>" + chars[i].character_name + "</option>";
  }
  renderHTML += "</select>";
  renderHTML += "\n<button class='ui primary button' id='characters'>Find Other Characters</button>";
  $('#container').append(renderHTML)
 }


// renders table
function renderTable(roles) {
  let renderHTML = "<table class='ui celled table'>";
  renderHTML += "<thead>";
  renderHTML += "<tr>";
  renderHTML += "<th>Game Title</th>";
  renderHTML += "<th>Character Name</th>";
  renderHTML += "</tr>";
  renderHTML += "</thead>";
  renderHTML += "<tbody>";
  for (var i = 0; i < roles.length; i++) {
    renderHTML += "<tr>";
    renderHTML += "<td>" + roles[i].game_name + "</td>";
    renderHTML += "<td>" + roles[i].character_name + "</td>";
    renderHTML += "</tr>";
  }
  renderHTML += "</tbody>";
  renderHTML += "</table>";
  $('#container').append(renderHTML)
}

function renderInitDropdown(games) {
  console.log(games);
  let initRender = "<select id='selectGames' class='ui dropdown'>";
  for (var i = 0; i < games.length; i++) {
    game = games[i].game_name.S;
    initRender += "<option value='" + game + "'>" + game + "</option>";
  }
  initRender += "</select>";
  initRender += "\n<button class='ui primary button' id='games'>Find Characters</button>";
  $('#container').append(initRender)  // * renders initial dropdown
}



$(document).ready(function() {
  // INITAL DROPDOWN
  var games;
  getTitleData();

  // When you select the first game
  $(document).on('click', '#games', function() {
    var gameValue = $('#selectGames').val()
    getCharacterData(gameValue);
  })

  $(document).on('click', '#characters', function() {
    actor = $("#selectCharacters option:selected").val();
    getActorData(actor)
  });
});
