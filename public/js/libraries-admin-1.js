
document.querySelectorAll(".delete-phone").forEach(function(item) {
    
    item.addEventListener('click', function(){
        console.log(item.id)
        document.querySelector(`#phone-div-${item.id[1]}`).remove()
    })
})

document.querySelector('#add-phone').addEventListener('click', function(el) {
    const phoneDivs = document.querySelectorAll('#phones>div')
    let newId;
    if (phoneDivs.length===0) {
        newId = 2
    }
    else {
        newId = Number(phoneDivs[phoneDivs.length - 1].id.slice(-1)) + 1
    }
    console.log(newId)
    const newPhone = document.createElement('div')
    newPhone.innerHTML = `
        <input type="text" name="LibPhone${newId}" id="lib-phone-${newId}" placeholder="Νέος αριθμός" style="width: 7.6em;">
        <i class="fas fa-times delete-phone" id="x${newId}"></i>`
    newPhone.id = `phone-div-${newId}`
    document.querySelector('#phones').insertBefore(newPhone, el.target)
    document.querySelector(`#x${newId}`).addEventListener('click', function(el){
        console.log(`#phone-div-${newId}`)
        document.querySelector(`#phone-div-${newId}`).remove()
    })
    document.querySelector(`#lib-phone-${newId}`).focus()
    document.querySelector(`#lib-phone-${newId}`).select()

})