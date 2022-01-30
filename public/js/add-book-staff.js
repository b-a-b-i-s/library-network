document.querySelector('#add-writer').addEventListener('click', function(el) {
    const writerDivs = document.querySelectorAll('#writers>div');
    let newId;
    if (writerDivs.length===0) {
        newId = 2;
    }
    else {
        newId = Number(writerDivs[writerDivs.length - 1].id.slice(-1)) + 1;
    }
    console.log(newId)
    const newWriter = document.createElement('div');
    newWriter.innerHTML = `
        <input type="text" name="Writer${newId}" id="writers-${newId}" placeholder="Συγγραφέας" style="width: 7.6em;">
        <i class="fas fa-times delete-writer" id="x${newId}"></i>`;
    newWriter.id = `writer-div-${newId}`
    newWriter.classList.add("extra-writer");
    document.querySelector('#writers').insertBefore(newWriter, el.target);
    document.querySelector(`#x${newId}`).addEventListener('click', function(el){
        console.log(`#writer-div-${newId}`);
        document.querySelector(`#writer-div-${newId}`).remove();
    })
    document.querySelector(`#writers-${newId}`).focus();
    document.querySelector(`#writers-${newId}`).select();

})

const checkList = document.getElementById('list1');
    checkList.querySelector('#anchor').onclick = function(evt) {
    if (checkList.classList.contains('visible'))
        checkList.classList.remove('visible');
    else
        checkList.classList.add('visible');
    }