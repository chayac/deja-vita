import argparse
import imdb


def main():
    print
    parser = argparse.ArgumentParser()
    parser.add_argument("-n", "--name", help="name of game")
    parser.add_argument("-u", "--url", help="IMDB URL")
    args = parser.parse_args()
    imdb.get_actors(args.name, args.url)


if __name__ == '__main__':
    main()
