var list_id = 0
var todo_id = 0
var all_json = []

function autoSave(){
    document.querySelectorAll(".text").forEach((title)=>{
        title.addEventListener("change",()=>{
            var name = title.classList.contains("todoDiv") ? "Todo" : "List"

        })
    })
}

load()
function load(){
    fetch("load",{method:"GET"}).then(response => response.json()).then(json=>{

        for(var i=0;i<json.lists.length;i++){
            var list = json.lists[i]
            newList(list.list_id,list.list_title,document.body,document.getElementsByClassName("addListBtn").item(0))
            var listElement = document.getElementsByClassName("listDiv").item(i)

            all_json.push({list_id:list.list_id,list_title:list.list_title,todos:[]})
            for (var t=0;t < json.todos[i].length;t++){
                    var todo = json.todos[i][t]
                    all_json[i].todos.push({todo_id:todo.todo_id,todo_title:todo.todo_title,is_checked:todo.is_checked})
 
                    newElement(todo.todo_id,todo.todo_title,todo.is_checked,listElement.getElementsByClassName("todoListDiv").item(0),listElement.getElementsByClassName("addTodo").item(0))
            }
        }
    })
}

function save(){
    for (var l=0;l<all_json.length;l++){
        if (all_json[l].Delete){
            continue
        }

        all_json[l].list_title = document.getElementsByClassName("listDiv").namedItem(`${all_json[l].list_id}`).getElementsByClassName("listTitle").item(0).textContent
        
        for (var t=0;t<all_json[l].todos.length;t++){
            if (all_json[l].todos[t].Delete){
                continue
            }
            var todoElement = document.getElementsByClassName("todoDiv").namedItem(`${all_json[l].todos[t].todo_id}`)
            all_json[l].todos[t].todo_title = todoElement.getElementsByClassName("todoTitle").item(0).textContent
            all_json[l].todos[t].is_checked = todoElement.classList.contains("checked")
        }
    }
    fetch("save",{method:"POST",body:JSON.stringify(all_json),headers:{"Content-Type":"application/json"}})
    for (var l=0;l<all_json.length;l++){
        var list = all_json[l]
    
        if (list.insert){
            delete list.insert
        } else {
          if (list.Delete){
            all_json.splice(all_json.indexOf(list),1)
          };
          
        }
        for (var t=0;t<list.todos.length;t++){
          var todo = list.todos[t]
          if (todo.insert){
            query = `INSERT INTO todo_ VALUES ("${randomUUID()}",${todo.is_checked ? 1:0},"${todo.todo_title}","${list.list_id}")`
          } else {
            if (todo.Delete){
              query = `delete from todo_ where todo_id="${todo.todo_id}"`
              todo = null
            } else {
              query = `UPDATE todo_ SET todo_title="${todo.todo_title}" ,is_checked=${todo.is_checked ? 1:0} where list_id="${list.list_id}"`
            }
             
          }
        };
    }
}
function addList(btn){
    newList(list_id,'',document.body,btn)
    all_json.push({list_id:list_id,list_title:"",insert:true,todos:[]})
    list_id++

    
}

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
    var list = all_json.find((value)=>{console.log(value);return lid === value.list_id})
    list.todos.push({todo_id: todo_id,todo_title:"",is_checked:false,insert:true})
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
    var todoDiv = btn.parentElement;
    var listDiv = todoDiv.parentElement.parentElement
    var listId = listDiv.id
    var todoId = todoDiv.id
    todoDiv.remove()
    var listIndex = all_json.findIndex((value)=>{return value.list_id === listId})
    var todoIndex = all_json[listIndex].todos.findIndex((value)=>{return value.todo_id === todoId})
    all_json[listIndex].todos[todoIndex].Delete = true
}

function deleteList(btn){
    var list_div = btn.parentElement.parentElement;
    var id = list_div.id
    list_div.remove()
    var list_index = all_json.findIndex((value)=>{return value.list_id === id})
    all_json[list_index].Delete = true
    console.log(all_json[list_index])
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