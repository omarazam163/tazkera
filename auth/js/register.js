const email = document.getElementById("email");
const emailError = document.getElementById("emailError");
const name = document.getElementById("name");
const nameError = document.getElementById("nameError");
const userName = document.getElementById("user-name");
const userNameError = document.getElementById("userNameError");
const password = document.getElementById("password");
const passwordError = document.getElementById("passwordError");
const repassword = document.getElementById("repassword");
const repasswordError = document.getElementById("repasswordError");
const submit = document.getElementById("submit");
const RegisterError = document.getElementById("registerEroor");

email.addEventListener("blur", () => {
  if (validator.isEmail(email.value)) {
    emailError.style.display = "none";
  } else {
    emailError.style.display = "block";
  }
});

name.addEventListener("blur", () => {
  if (validator.isLength(name.value, { min: 3 })) {
    nameError.style.display = "none";
  } else {
    nameError.style.display = "block";
  }
});

userName.addEventListener("blur", () => {
  if (validator.isLength(userName.value, { min: 3 })) {
    userNameError.style.display = "none";
  } else {
    userNameError.style.display = "block";
  }
});

password.addEventListener("blur", () => {
  if (validator.isLength(password.value, { min: 4 })) {
    passwordError.style.display = "none";
  } else {
    passwordError.style.display = "block";
  }
});

repassword.addEventListener("blur", () => {
  if (repassword.value === password.value) {
    repasswordError.style.display = "none";
  } else {
    repasswordError.style.display = "block";
  }
});

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  if (
    validator.isEmail(email.value) &&
    validator.isLength(name.value, { min: 3 }) &&
    validator.isLength(userName.value, { min: 3 }) &&
    validator.isLength(password.value, { min: 4 }) &&
    repassword.value === password.value
  ) {
    Loading(true);
    let response = await fetch(
      "https://ieee-comp-backend.vercel.app/api/user/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          name: name.value,
          userName: userName.value,
          password: password.value,
        }),
      }
    );
    response = await response.json();
    if (response.status === 200) {
      RegisterError.style.display = "none";
      localStorage.setItem("token", response.token);
      window.location.href = "./login.html";
    } else {
      RegisterError.innerHTML = response.errors;
      RegisterError.style.display = "block";
    }
    Loading(false);
  } else {
    RegisterError.style.display = "block";
  }
});

function Loading(load) {
  if (load)
    submit.innerHTML = `<i class="fa-solid fa-spinner fa-spin-pulse"></i>`;
  else submit.innerHTML = "log in";
}
