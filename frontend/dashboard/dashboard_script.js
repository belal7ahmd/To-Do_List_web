var list_id = 0
var todo_id = 0
var lists_json = []
var todos_json = []

load()
function load(){
    fetch("load",{method:"GET"}).then(response => response.json()).then(json=>{

        for(var i=0;i<json.lists.length;i++){
            var list = json.lists[i]
            newList(list.list_id,list.list_title,document.body,document.getElementsByClassName("addListBtn").item(0))
            var listElement = document.getElementsByClassName("listDiv").item(i)

            lists_json.push({list_id:list.list_id,list_title:list.list_title})
            todos_json.push([])
            for (var t=0;t < json.todos[i].length;t++){
                    var todo = json.todos[i][t]
                    todos_json[i].push({todo_id:todo.todo_id,todo_title:todo.todo_title,list_id:todo.list_id})
 
                    newElement(todo.todo_id,todo.todo_title,todo.is_checked,listElement.getElementsByClassName("todoListDiv").item(0),listElement.getElementsByClassName("addTodo").item(0))
            }
        }
    })
}

function save(){
    for (var l=0;l<lists_json.length;l++){
        lists_json[l].list_title = document.getElementsByClassName("listDiv").namedItem(`${lists_json[l].list_id}`).getElementsByClassName("listTitle").item(0).textContent
    }
    fetch("save",{method:"POST",body:JSON.stringify({lists:lists_json,todos:todos_json}),headers:{"Content-Type":"application/json"}})
}
function addList(btn){
    newList(list_id,'',document.body,btn)
    lists_json.push({list_id:list_id,list_title:"",insert:true})
    list_id++

    
}

function addTodo(btn){
    newElement(todo_id,'',false,btn.parentElement,btn)
    var lid = btn.parentElement.parentElement.id
    if (lid <= list_id){
        todos_json.push({todo_id:todo_id,list_id:lid,list_exists:false,insert:true})
    } else {
        todos_json.push({todo_id:todo_id,list_id:lid,list_exists:true,insert:true})
    };


    todo_id++
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

    title.className = "text"
    title.textContent = text
    title.contentEditable = true
    title.tagName = "todoTitle"


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