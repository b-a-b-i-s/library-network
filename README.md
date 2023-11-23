# databases-library-project

Η σελίδα υπάρχει διαθέσιμη στο link : ~~<https://library-network.herokuapp.com/>~~ <https://library-network.babis-skeparnakos.com/>

Για την ανάκτηση των εξώφυλλων που δεν έχουν προστεθεί από τις βιβλιοθήκες χρησιμοποιούνται τα API :

- [Google Books API](https://developers.google.com/books) [(Using the API)](https://developers.google.com/books/docs/v1/using)
- [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers)

## Τρέξιμο χρησιμοποιώντας μόνο docker:

To run for production:
```
cp .env.sample .env
docker compose up -d --build
docker compose -f docker-compose-nginx.yml up -d
```

To run for development:
```
cp .env.sample .env
chmod +x ./resetDb.sh
./resetDb.sh
docker compose -f docker-compose.dev.yml up --build
```

## Τρέξιμο χωρίς docker:

Todo:

- [ ] Προσθήκη σελίδας Σχετικά με εμάς
- [ ] Update dependencies for security
- [ ] Υλοποίηση μεταφορών και φίλτρων
- [ ] Βελτίωση του Readme
- [ ] Ελεγχος της εκδοσης του node (14/16)
- [ ] Αλλαγη license και προσθηκη του στο 1ο commit
