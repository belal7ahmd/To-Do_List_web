

function checkValid(form){
    var username = form["username"].value
    var email = form["email"].value
    var password = form["password"].value
    var repeat_password = form["repeat_password"].value
    if (username.length > 30){
      alert("Username too long")
      return false
    } else if (username == ""){
        alert("You must fill username")
        return false
    } else if (email == ""){
        alert("You must fill email")
        return false
    } else if (password == ""){
        alert("You must fill password")
        return false
    } else if (password != repeat_password){
        alert("You must match the password and repeat password")
        return false
    };

    return true
};

document.addEventListener("")