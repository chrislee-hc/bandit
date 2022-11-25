import json
import random
from collections import Counter 
import os

WORD_FILE_PATH = 'data/Collins Scrabble Words (2019).txt'
LETTER_DISTRIBUTIONS_FILE_PATH = 'data/letter_distributions.json'

def get_words(words_file):
    out = set()
    with open(words_file) as f:
        for line in f:
            word = line.rstrip()
            if len(word) >= 3:
                out.add(word.lower())
    return out

def get_letter_dist(letter_dist_file):
    with open(letter_dist_file) as f:
        return json.load(f)

def print_data(hands, pile, bag):
    os.system('cls' if os.name == 'nt' else 'clear')
    for name, hand in hands.items():
        print(f'{name}\'s hand:')
        print(list(hand))
    print('Pile:')
    print(pile)
    print(f'Tiles left: {len(bag)}')
    print()

def play_game(words_file, letter_dist_file):
    word_list = get_words(words_file)
    letter_dist = get_letter_dist(letter_dist_file)
    bag = []
    for letter, freq in letter_dist.items():
        bag += [letter for _ in range(freq)]
    random.shuffle(bag)

    print('Welcome to Bandit!')
    num_players = int(input('How many players? '))
    players = []
    hands = {}
    for i in range(1, num_players+1):
        name = ''
        while name == '' or name in hands:
            name = input(f'Enter player {i}\'s name: ')
        players.append(name)
        hands[name] = set()

    cur_turn = 0
    pile = []
    while bag:
        os.system('clear')
        for name, hand in hands.items():
            print(f'{name}\'s hand:')
            print(list(hand))
        input(f'{players[cur_turn]}, press <Enter> to flip over a tile!')

        pile.append(bag[0])
        bag = bag[1:]
        print('Pile:')
        print(pile)
        print(f'Tiles left: {len(bag)}')
        print()

        play_turn(hands, pile, bag, word_list)
        cur_turn = (cur_turn + 1) % num_players
    print('GAME OVER')
    scores = []
    for name, hand in hands.items():
        count = 0
        for word in hand:
            count += len(word)
        scores.append((count, name))
    scores.sort(reverse=True)
    print('Leaderboard:')
    for i, (score, name) in enumerate(scores):
        print(f'Rank {i+1}:\t\t{name}, {score}')

def is_valid_word(word, hands, pile, word_list):
    no_match = False, None, None, None
    pile_counts = Counter(pile)
    if word not in word_list:
        return no_match
    held_words = []
    for person, word_list in hands.items():
        for held_word in word_list:
            held_words.append((held_word, person))
    held_words.sort(key=lambda tup: len(tup[0]), reverse=True)
    for held_word, person in held_words:
        letter_counts = Counter(word)
        found_match = True
        for letter in held_word:
            if letter_counts[letter] == 0:
                found_match = False
                break
            letter_counts[letter] -= 1
        if found_match:
            pile_letters = []
            for l, c in letter_counts.items():
                if c > pile_counts[l]:
                    found_match = False
                pile_letters += [l] * c
            if not pile_letters:
                found_match = False
        if found_match:
            return True, person, held_word, pile_letters

    pile_letters = []
    letter_counts = Counter(word)
    found_match = True
    for l, c in letter_counts.items():
        if c > pile_counts[l]:
            found_match = False
        pile_letters += [l] * c
    if found_match:
        return True, None, None, pile_letters 
    return no_match

def play_turn(hands, pile, bag, word_list):
    next_turn = False
    while not next_turn:
        player = word = steal_player = steal_word = pile_letters = None
        valid = False
        while player not in hands or not valid:
            raw_input = ''
            while raw_input.count(' ') != 1 and raw_input != '0':
                raw_input = input('Create or steal a word! Type your username and then your word separated by a single space. Type 0 to move onto the next turn. ')
            if raw_input == '0':
                return
            player, word = raw_input.split(' ')
            word = word.lower()
            valid, steal_player, steal_word, pile_letters = is_valid_word(word, hands, pile, word_list)

        # TODO: edge case where possible to make the same word both from scratch and as a steal?
        #       currently prioritizing steals over new word creations
        #       also only currently considering steals of one word + letters from pile
        # TODO: check words with same stems/meanings
        # TODO: add end game input
        if steal_player:
            hands[steal_player].remove(steal_word)
        for letter in pile_letters:
            pile.remove(letter)
        hands[player].add(word)
        print_data(hands, pile, bag)

if __name__ == '__main__':
    play_game(WORD_FILE_PATH, LETTER_DISTRIBUTIONS_FILE_PATH)
