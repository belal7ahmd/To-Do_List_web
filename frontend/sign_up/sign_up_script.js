

function checkValid(form){
    var username = form["username"].value
    var email = form["email"].value
    var password = form["password"].value
    var repeat_password = form["repeat_password"].value
    if (username == ""){
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

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent HTML submission
  
  // Create payload of type multipart/form-data (awlays of this type when using the FormData() constructor):
  const fd = new FormData(form);

  // Convert to URL-encoded string:
  const urlEncoded = new URLSearchParams(fd).toString();
  
  fetch('http://localhost/signup', {
    method: "POST",
    body: urlEncoded, // just 'fd' for multipart/form-data
    headers: {
      'Content-type': 'application/x-www-form-urlencoded'
      // Content-type header should only be set if data is url-encoded! A FormData object will set the header as multipart/form-data automatically (and setting it manually may lead to an error)
    }
  })

})