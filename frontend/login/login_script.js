var url = new URL(document.URL).searchParams

if (url.has("err",'username')){
    document.getElementById("message").textContent = "The username is wrong"
    document.getElementById("message").style.display="block"
} else if (url.has("err",'password')){
    document.getElementById("message").textContent = "The password is wrong"
    document.getElementById("message").style.display="block"
}

function checkValid(form){
    var username = form["username"].value
    var password = form["password"].value
    if (username.length > 30){
      alert("Username too long")
      return false
    } else if (username == ""){
        alert("You must fill username")
        return false
    } else if (password == ""){
        alert("You must fill password")
        return false
    };

    return true
};
