var list_id = 0
var todo_id = 0


load()
function load(){
    fetch("load",{method:"GET"}).then(response => response.json()).then(json=>{

        for(var i=0;i<json.lists.length;i++){
            var list = json.lists[i]
            newList(list.list_id,list.list_title,document.body,document.getElementsByClassName("addListBtn").item(0))
            var listElement = document.getElementsByClassName("listDiv").item(i)
            listElement.getElementsByClassName("listTitle").item(0).addEventListener("input",()=>{
                save(false,false,false,listElement.getElementsByClassName("listTitle").item(0),listElement.id)
            })

            for (var t=0;t < json.todos[i].length;t++){
                    var todo = json.todos[i][t]
                
                    newElement(todo.todo_id,todo.todo_title,todo.is_checked,listElement.getElementsByClassName("todoListDiv").item(0),listElement.getElementsByClassName("addTodo").item(0))
                    listElement.getElementsByClassName("todoDiv").namedItem(todo.todo_id).getElementsByClassName("todoTitle").item(0).addEventListener("input",()=>{
                        save(false,false,true,listElement.getElementsByClassName("todoDiv").namedItem(todo.todo_id).getElementsByClassName("listTitle").item(0),listElement.getElementsByClassName("todoDiv").namedItem(todo.todo_id),listElement.getElementsByClassName("todoDiv").namedItem(todo.todo_id).classList.contains("checked"),listElement.id)
                    })
            }
        }
    })
}

async function save(Delete=false,insert=false,is_todo=false,title_element=createElement("h2"),id="",is_checked=false,listId=""){
    var json = {}
    if (Delete){
        var title = ""
    } else {
        var title = title_element.textContent
    }
    if (is_todo){
        json = {todo:true,todo_title:title,todo_id:id,list_id:listId,is_checked:is_checked}
        if (insert){
            json.insert = true
        } else {
            if (Delete){
                json.delete = true
            }
        }
    } else {
        json = {list_title:title,list_id:id}
        if (insert){
            json.insert = true
        } else {
            if (Delete){
                json.delete = true
            }
        }
    }
    var Id = await (await fetch("save",{method:"POST",body:JSON.stringify(json),headers:{"Content-Type":"application/json"}})).text()

    if (insert){
        if (is_todo){
            document.getElementsByClassName("todoDiv").namedItem(`${id}`).id = Id
        } else {
            document.getElementById(id).id = Id
        }
    }
}

function addList(btn){
    var listId = list_id
    newList(listId,'',document.body,btn)
    
    list_id++
    var title = document.getElementById(`${listId}`).getElementsByClassName("listTitle").item(0)
    save(false,true,false,title,listId)
    title.addEventListener("input",()=>{
        save(false,false,false,title,title.parentElement.parentElement.id)
    })
    
};

function addTodo(btn){
    newElement(todo_id,'',false,btn.parentElement,btn)
    var lid = btn.parentElement.parentElement.id
    
    var str = false
    for (var i=0;i<lid.length;i++){
        if (/[^0-9]/.test(lid.charAt(i))){
            str = true
            break
        } 
    }
    lid = str ? lid:parseInt(lid)
    console.log(lid)
    var todoId = todo_id
    todo_id++
    var title = btn.parentElement.getElementsByClassName("todoDiv").namedItem(`${todoId}`).getElementsByClassName("todoTitle").item(0)
    save(false,true,true,title,todoId,title.parentElement.classList.contains("checked"),title.parentElement.parentElement.parentElement.id)
    title.addEventListener("input",()=>{
        save(false,false,true,title,title.parentElement.id,title.parentElement.classList.contains("checked"),title.parentElement.parentElement.parentElement.id)
    })
};

function check(todo){
    console.log(todo.parentElement,document.getElementsByClassName("todoDiv").namedItem(todo.id) === null)
    if (document.getElementsByClassName("todoDiv").namedItem(todo.id) !== null){
        if (!todo.classList.contains("checked")){
        todo.getElementsByClassName("checkbox").item(0).checked = true
        todo.getElementsByClassName("text").item(0).classList.add("marked-text")
        todo.classList.add("checked")
        } else {
        todo.getElementsByClassName("checkbox").item(0).checked = false
        todo.getElementsByClassName("text").item(0).classList.remove("marked-text")
        todo.classList.remove("checked")
        }
        save(false,false,true,todo.getElementsByClassName("todoTitle").item(0),todo.id,todo.classList.contains("checked"),todo.parentElement.parentElement.id)
    } 
}  

function deleteTodo(btn){
    var todoDiv = btn.parentElement;
    var listDiv = todoDiv.parentElement.parentElement
    var listId = listDiv.id
    var todoId = todoDiv.id
    save(true,false,true,document.createElement("h2"),todoId,todoDiv.classList.contains("checked"),listId)
    todoDiv.remove()
}

function deleteList(btn){
    var list_div = btn.parentElement.parentElement;
    list_div.remove()
    save(true,false,false,btn.parentElement.getElementsByClassName("listTitle").item(0),btn.parentElement.parentElement.id)
}

function newElement(id,text='',is_checked,list,btn){
    let mainDiv = document.createElement("div")
    let checkbox = document.createElement("input")
    let title = document.createElement("h3")
    let delBtn = document.createElement("input")

    mainDiv.className = "todoDiv depth"
    if (is_checked) mainDiv.classList.add("checked");
    mainDiv.onclick = function(){check(this)}
    mainDiv.id = `${id}`

    checkbox.type = "checkbox"
    checkbox.className = "checkbox"
    checkbox.checked = is_checked

    title.className = "todoTitle text"
    title.textContent = text
    title.contentEditable = true
    title.spellcheck = false


    delBtn.type = "image"
    delBtn.src = "images/trash_icon.png"
    delBtn.className = "delBtn"
    delBtn.onclick = function(){deleteTodo(this)}

    mainDiv.appendChild(checkbox)
    mainDiv.appendChild(title)
    mainDiv.appendChild(delBtn)

    list.appendChild(mainDiv)

    list.removeChild(btn)
    list.appendChild(btn)

    title.focus()
    return mainDiv

}

function newList(id,text,body,btn){
    let newList = document.createElement("div")
    let listTitle = document.createElement("h2")
    let headerDiv = document.createElement("div")
    let delBtn = document.createElement("input")
    let createBtn = document.createElement("input")
    let listDiv = document.createElement("div")

    newList.className = "listDiv"
    newList.id = `${id}`
    
    headerDiv.className = "listHeaderDiv"

    listTitle.className = "text listTitle"
    listTitle.innerText = text
    listTitle.style="text-shadow: 0 19px 38px rgba(0, 0, 0, 0.302), 0 15px 12px rgba(0, 0, 0, 0.22);"
    listTitle.contentEditable = true
    listTitle.spellcheck = false
    
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

    newList.appendChild(headerDiv)
    newList.appendChild(listDiv)

    body.appendChild(newList)

    listTitle.focus()

    body.removeChild(btn)



    body.appendChild(btn)
    return newList
}