document.querySelectorAll('.book-img[id^="thumb"]').forEach(item=>{
    const ISBN = item.id.slice(5);

    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:4${ISBN}`)
        .then(response => response.json())
        .then(data => {
            if (data?.items?.[0]?.volumeInfo?.imageLinks?.smallThumbnail){
                document.querySelector(`#thumb${ISBN}`).src = data.items[0].volumeInfo.imageLinks.smallThumbnail;
                document.querySelector(`#thumb${ISBN}`).alt = 'Cover photo from Google books';
            }
            else{
                fetch(`https://covers.openlibrary.org/b/isbn/${ISBN}-M.jpg?default=false`)
                    .then(response => {
                        if (response.status==200){
                            document.querySelector(`#thumb${ISBN}`).src = `https://covers.openlibrary.org/b/isbn/${ISBN}-M.jpg?default=false`;
                            document.querySelector(`#thumb${ISBN}`).alt = 'Cover photo from Open Library';
                        }
                    })
            }
        });
})