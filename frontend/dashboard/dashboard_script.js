
loadTodos()

function loadTodos(){
    fetch("load",{
        method:"GET"
    }).then()
}

function addList(btn){
    newList('',btn.parentElement,btn)

    
}

function addTodo(btn){

    let parent = btn.parentElement
    parent.removeChild(btn)
    newElement('',false,parent)
    parent.appendChild(btn)
};

function check(todo){
    if (!todo.classList.contains("checked")){
        todo.getElementsByClassName("checkbox").item(0).checked = true
        todo.getElementsByClassName("text").item(0).classList.add("marked-text")
        todo.classList.add("checked")
    } else {
        todo.getElementsByClassName("checkbox").item(0).checked = false
        todo.getElementsByClassName("text").item(0).classList.remove("marked-text")
        todo.classList.remove("checked")
    }
}

function deleteTodo(btn){
    btn.parentElement.remove()
}

function deleteList(btn){
    btn.parentElement.parentElement.remove()
}

function newElement(text='',is_checked,list){
    let mainDiv = document.createElement("div")
    let checkbox = document.createElement("input")
    let title = document.createElement("h3")
    let delBtn = document.createElement("input")

    mainDiv.className = "todoDiv depth"
    if (is_checked) mainDiv.classList.add("checked");
    mainDiv.onclick = function(){check(this)}

    checkbox.type = "checkbox"
    checkbox.className = "checkbox"
    checkbox.checked = is_checked

    title.className = "text"
    title.textContent = text
    title.contentEditable = true


    delBtn.type = "image"
    delBtn.src = "images/trash_icon.png"
    delBtn.className = "delBtn"
    delBtn.onclick = function(){deleteTodo(this)}

    mainDiv.appendChild(checkbox)
    mainDiv.appendChild(title)
    mainDiv.appendChild(delBtn)

    list.appendChild(mainDiv)

    title.focus()

}

function newList(text,list,btn){
    let listTitle = document.createElement("h2")
    let headerDiv = document.createElement("div")
    let delBtn = document.createElement("input")
    let createBtn = document.createElement("input")
    let listDiv = document.createElement("div")

    headerDiv.className = "listHeaderDiv"

    listTitle.className = "text"
    listTitle.textContent = text
    listTitle.style="text-shadow: 0 19px 38px rgba(0, 0, 0, 0.302), 0 15px 12px rgba(0, 0, 0, 0.22);"
    listTitle.contentEditable = true

    delBtn.type = "image"
    delBtn.src = "images/trash_icon.png"
    delBtn.className = "delListBtn"
    delBtn.onclick = function(){deleteList(this)}

    createBtn.type = "image"
    createBtn.src = "images/add.png"
    createBtn.className ="addTodo" 
    createBtn.onclick = function(){addTodo(this)}

    listDiv.className = "todoListDiv"

    listDiv.appendChild(createBtn)

    headerDiv.appendChild(listTitle)
    headerDiv.appendChild(delBtn)

    list.appendChild(headerDiv)
    list.appendChild(listDiv)
    listTitle.focus()

    list.removeChild(btn)

    let newList = document.createElement("div")
    newList.className = "listDiv"
    newList.appendChild(btn)
    list.parentElement.appendChild(newList)
}