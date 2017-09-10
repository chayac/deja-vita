import argparse
from beautifulscraper import BeautifulScraper
import boto3


def get_actors(game_name, imdb_url):
    # Get the service resource.
    dynamodb = boto3.resource('dynamodb', endpoint_url='http://localhost:8000')
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
        actor_name = ' '.join(cols[1].find('a').text.split())
        character_name = cols[3].find('div').text.split()
        if '(voice)' in character_name: character_name.remove('(voice)')
        if '(uncredited)' in character_name: character_name.remove('(uncredited)')
        character_name = ' '.join(character_name)

        # Write to Dynamo
        response = table.put_item(
           Item={
                'game_name': game_name,
                'actor_name': actor_name,
                'character_name': character_name,
            }
        )
        print(response)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("-n", "--name", help="name of game")
    parser.add_argument("-u", "--url", help="IMDB URL")
    args = parser.parse_args()
    get_actors(args.name, args.url)


if __name__ == '__main__':
    main()
