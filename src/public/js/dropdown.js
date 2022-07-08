const checkList = document.querySelector('#list1');
checkList.querySelector('#anchor').onclick = function(evt) {
    if (checkList.classList.contains('visible'))
        checkList.classList.remove('visible');
    else
        checkList.classList.add('visible');
}

document.querySelector("#select-all").addEventListener('change', function() {
    console.log('change')
    const categoryItems = document.querySelectorAll('#list1 input[type="checkbox"]')
    if (categoryItems[0].checked) 
        categoryItems.forEach(function(item) {
            item.checked = true
        })
    else 
        categoryItems.forEach(function(item) {
            item.checked = false
        })
})