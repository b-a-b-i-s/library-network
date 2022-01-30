fetch('https://www.googleapis.com/books/v1/volumes?q=isbn:{{book.ISBN}}')
                    .then(response => response.json())
                    .then(data => {
                        if (data.totalItems>0 && data.items[0].volumeInfo.imageLinks && data.items[0].volumeInfo.imageLinks.smallThumbnail){
                            document.querySelector('#thumb{{book.ISBN}}').src = data.items[0].volumeInfo.imageLinks.smallThumbnail;
                            document.querySelector('#thumb{{book.ISBN}}').alt = 'Cover photo from Google books';
                        }
                        else{
                            fetch('https://covers.openlibrary.org/b/isbn/{{book.ISBN}}-M.jpg?default=false')
                                .then(response => {
                                    if (response.status==200){
                                        document.querySelector('#thumb{{book.ISBN}}').src = 'https://covers.openlibrary.org/b/isbn/{{book.ISBN}}-M.jpg?default=false';
                                        document.querySelector('#thumb{{book.ISBN}}').alt = 'Cover photo from Open Library';
                                    }
                                })
                        }
                    });