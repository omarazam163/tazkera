let token = localStorage.getItem("token");
const logged_in_nav = document.getElementById("logged_in_nav");
const logged_out_nav = document.getElementById("logged_out_nav");
const User = document.getElementById("user");
let userData;
if (token) {
    console.log("here")
    logged_in_nav.style.display = "flex";
    logged_out_nav.style.display = "none";
    userData=jwt_decode(token); 
    User.innerHTML = userData.name;
}


const logout = document.getElementById("log-out");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.removeItem("token");
  location.reload();
});