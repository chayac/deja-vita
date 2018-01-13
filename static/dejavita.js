// Get list of game titles in database
function getTitleData() {
  $.get('/get_title_data', function(data) {
    console.log(data)
    renderInitDropdown(data);
  });
}

// Returns character and actor
function getCharacterData(title) {
  $.post('/get_character_data', {title: title}, function(data) {
    renderCharacters(data.Items);
  });
}

// Returns game titles and character names
function getActorData(actor) {
  $.post('/get_actor_data', {actor: actor}, function(data) {
    renderTable(data.Items, actor);
  })
}

// renders character table
function renderCharacters(chars) {
  let renderHTML = "<div class='ui tiny form'>";
  renderHTML += "<div class='two fields'>"
  renderHTML += "<div class='field'>"
  renderHTML += "<select id='selectCharacters' class='ui dropdown' style='min-width: 100px;'>";
  for (var i = 0; i < chars.length; i ++) {
    if (chars[i].actor_name != 'Unknown' && chars[i].character_name != 'Unknown') {
      renderHTML += "<option value='" + chars[i].actor_name + "'>" + chars[i].character_name + "</option>";
    }
  }
  renderHTML += "</select></div>";
  renderHTML += "<div class='field'>"
  renderHTML += "<button class='ui primary button' id='characters' style='min-width:185px;'>Find All Roles</button>";
  renderHTML += "</div></div>"
  $('#game-dropdown #dd-second').html(renderHTML)
 }


// renders table
function renderTable(roles, actor) {
  let renderHTML = "<table class='ui inverted table'>";
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
  $('#deja-vita-table').show()
  $('.table-render').html(renderHTML)
  $('.actor-name').html(actor)
}

function renderInitDropdown(games) {
  let initRender = "<div class='ui tiny form'>";
  initRender += "<div class='two fields'>"
  initRender += "<div class='field'>"
  initRender += "<select id='selectGames' class='ui dropdown' style='padding: 10px;'>";
  for (var i = 0; i < games.length; i++) {
    game = games[i].game_name;
    initRender += "<option value='" + game + "'>" + game + "</option>";
  }
  initRender += "</select>";
  initRender += "</div>";
  initRender += "<div class='field'>"
  initRender += "<button class='ui primary button' id='games' style='min-width:185px;'>Get Characters</button>";
  initRender += "</div></div>"
  $('#game-dropdown #dd-first').html(initRender)  // * renders initial dropdown
}

$(document).ready(function() {
  // INITAL DROPDOWN
  getTitleData();
  $('#deja-vita-table').hide();

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
