import boto3
from beautifulscraper import BeautifulScraper


def get_actors(game_name, imdb_url):
    # Get the service resource.
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('game_titles')
    response = table.put_item(
           Item={
                'game_name': game_name,
            }
        )
    print(response)

    table = dynamodb.Table('all_games')

    # Initialize scraper
    scraper = BeautifulScraper()
    soup = scraper.go(imdb_url)
    cast = soup.find("table", {"class": "cast_list"})
    rows = cast.find_all('tr')
    del rows[0]

    # Iterate through rows
    for tr in rows:
        cols = tr.findAll('td')
        if len(cols) < 4:
            pass
        else:
            actor_name = ' '.join(cols[1].find('a').text.split())
            character_name = cols[3].find('div').text.split()
            if '(voice)' in character_name: character_name.remove('(voice)')
            if '(uncredited)' in character_name: character_name.remove('(uncredited)')
            character_name = ' '.join(character_name)
            if character_name == '': character_name = 'Unknown'
            if actor_name == '': actor_name = 'Unknown'

        # Write to Dynamo
        response = table.put_item(
           Item={
                'game_name': game_name,
                'actor_name': actor_name,
                'character_name': character_name,
            }
        )
        print(response)
