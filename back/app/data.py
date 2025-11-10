from datetime import date, timedelta

authors = [
    {"id": 1, "name": "Fyodor Dostoevsky", "bio": "Russian novelist", "wikipedia": "https://en.wikipedia.org/wiki/Fyodor_Dostoevsky"},
    {"id": 2, "name": "Leon Trotsky", "bio": "Russian revolutionary", "wikipedia": "https://en.wikipedia.org/wiki/Leon_Trotsky"},
]

subjects = [
    {"id": 1, "subject": "Novel"},
    {"id": 2, "subject": "Politics"},
]

books = [
    {
        "id": 1,
        "title": "Crime and Punishment",
        "subtitle": "A Novel",
        "description": "A psychological drama about moral dilemmas.",
        "publication_date": date(1866, 1, 1),
        "authors": [authors[0]],
        "subjects": [subjects[0]],
        "covers": [{"id": 1, "cover_file": "covers/crime_and_punishment.jpg"}],
    },
    {
        "id": 2,
        "title": "The Revolution Betrayed",
        "description": "Epic novel about Russian society.",
        "publication_date": date(1869, 1, 1),
        "authors": [authors[1]],
        "subjects": [subjects[0], subjects[1]],
        "covers": [{"id": 2, "cover_file": "covers/the_revolution_betrayed.jpg"}],
    },
]

customers = [
    {"id": 1, "name": "Nadezhda Krupskaya", "address": "Lenina 11", "zip": "12345", "city": "Moscow", "phone": "555-1111", "email": "nadezhda@example.com"},
    {"id": 2, "name": "Daniil Sulimov", "address": "Chekistov 22", "zip": "67890", "city": "St. Petersburg", "phone": "555-2222", "email": "daniil@example.com"},
]

issues = [
    {
        "id": 1,
        "book": books[0],
        "issue_date": date.today() - timedelta(days=10),
        "return_until": date.today() + timedelta(days=3),
        "return_date": None,
        "renewed": False,
        "customer_id": 1,
    }
]

users = [{"id": 1, "username": "admin", "password": "admin123"}]
