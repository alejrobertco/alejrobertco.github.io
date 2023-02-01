function conseguirNOMBRE(){
    var user = localStorage.getItem("username");
    document.getElementById("user").innerText = user;
    }
    function login(){
    var username = document.getElementById("username").value;
    localStorage.setItem("username", username);
    }