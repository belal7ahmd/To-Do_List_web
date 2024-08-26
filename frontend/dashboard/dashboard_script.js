
fetch("load",{method:"GET"}).then((res)=>res.json()).then((json)=>{
    
    for (let i=0;i<json.length;i++){
        new_element(json[i].todo_title,(json[i].is_checked === 1)?true:false)
    }
})


function check(parent){
    let checkbox = parent.getElementsByClassName("checkbox").item(0)
    parent.classList.toggle("checked")
    if (parent.classList.item(1) == "checked"){
        checkbox.checked = true

    }
    else {
        checkbox.checked = false
    }
};

function Delete(btn){
    let parent = btn.parentElement
    parent.remove()
};

function add_btn(){
    let textArea = document.getElementById("textArea");

    let text = textArea.value
    if (text.split(" ") == ""){
        textArea.focus()
        alert("the to do has to have a title")
        return;
    };

    textArea.value = ""

    new_element(text,false)
}

function new_element(title,checked){

    let main_div = document.createElement("div");
    let checkbox = document.createElement("input");
    let title_element = document.createElement("h3");
    let del_btn = document.createElement("input");

    main_div.className = "To_Do_div";
    (checked)?main_div.classList.add("checked"):"no"
    main_div.onclick = function(){check(this)};

    checkbox.className = "checkbox";
    checkbox.type = "checkbox";
    checkbox.checked = checked

    title_element.textContent = title;
    title_element.className = "Text To_Do_Title";
    
    del_btn.type = "image"
    del_btn.src = "images/delete_13169948.png"
    del_btn.className = "del_btn";
    del_btn.onclick = function(){Delete(this)};


    main_div.appendChild(checkbox);
    main_div.appendChild(title_element);
    main_div.appendChild(del_btn);

    document.getElementById("To_Do_list_div").appendChild(main_div);
    


};

function sendSave(){
    var Todos_elements = document.getElementsByClassName("To_Do_div");
    var Todos_list = [];
    var current;
    for (let i=0;i < Todos_elements.length;i++){
        current = Todos_elements.item(i)
        Todos_list.push({
            checked:(current.classList.contains("checked"))?1:0,
            Todo_name:current.getElementsByClassName("To_Do_Title")[0].textContent
        });
        
    };
    

    fetch("save", {
        method: "POST",
        body: JSON.stringify(Todos_list),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });

}