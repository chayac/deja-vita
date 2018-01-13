import boto3
import time
from beautifulscraper import BeautifulScraper

# fullcredits?ref_=tt_cl_sm#cast


def resolve_url(imdb_url):
    www_index = imdb_url.find('www')
    imdb_url = imdb_url[www_index:]
    slash_count = 0
    for i in range(len(imdb_url)):
        if imdb_url[i] == '/':
            slash_count += 1
            if slash_count == 3:
                break
    if slash_count == 2:
        return "https://" + imdb_url[:i] + '/fullcredits/'
    elif slash_count == 3:
        return "https://" + imdb_url[:i+1] + 'fullcredits/'


def get_actors(game_name, imdb_url):
    # Get the service resource.
    new_url = resolve_url(imdb_url)
    print(new_url)
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table('game_titles')
    response = table.put_item(
           Item={
                'game_name': game_name,
            }
        )

    table = dynamodb.Table('all_games')
    print(new_url)
    # Initialize scraper
    scraper = BeautifulScraper()
    soup = scraper.go(str(imdb_url))
    time.sleep(10)
    cast = soup.select("table.cast_list")[0]
    rows = cast.find_all('tr')
    del rows[0]

    # Iterate through rows
    for tr in rows:
        cols = tr.findAll('td')
        put_item_flag = True
        if len(cols) < 4:
            pass
        else:
            actor_name = ' '.join(cols[1].find('a').text.split())
            character_name = cols[3].find('div').text.split()
            if '(voice)' in character_name:
                character_name.remove('(voice)')
            if '(uncredited)' in character_name:
                character_name.remove('(uncredited)')
            character_name = ' '.join(character_name)
            if character_name == '':
                character_name = 'Unknown'
            if actor_name == '':
                actor_name = 'Unknown'

        # Write to Dynamo
        try:
            print(game_name, actor_name, character_name)
            response = table.put_item(
               Item={
                    'game_name': game_name,
                    'actor_name': actor_name,
                    'character_name': character_name,
                }
            )
        except:
            print tr
