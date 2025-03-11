let email = document.getElementById("email");
let emailError = document.getElementById("emailError");
let password = document.getElementById("password");
const passwordError = document.getElementById("passwordErorr");
const submit = document.getElementById("submit");
const RegisterError = document.getElementById("loginError");
email.addEventListener("blur", () => {
  if (validator.isEmail(email.value)) {
    console.log(emailError);
    emailError.style.display = "none";
  } else {
    emailError.style.display = "block";
  }
});

password.addEventListener("blur", () => {
  if (validator.isLength(password.value, { min: 4 })) {
    passwordError.style.display = "none";
  } else {
    passwordError.style.display = "block";
  }
});

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  if (
    validator.isEmail(email.value) &&
    validator.isLength(password.value, { min: 4 })
  ) {
    Loading(true);
    let response = await fetch(
      "https://ieee-comp-backend.vercel.app/api/user/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      }
    );
    response = await response.json();
    if (response.status === 200) {
      RegisterError.style.display = "none";
      localStorage.setItem("token", response.token);
      window.location.href = "../index.html";
    } else {
      RegisterError.style.display = "block";
    }
    Loading(false);
  } else {
    emailError.style.display = validator.isEmail(email.value)
      ? "none"
      : "block";
    passwordError.style.display = validator.isLength(password.value, { min: 4 })
      ? "none"
      : "block";
  }
});

function Loading(load) {
  if (load)
    submit.innerHTML = `<i class="fa-solid fa-spinner fa-spin-pulse"></i>`;
  else submit.innerHTML = "log in";
}

