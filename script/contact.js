document.addEventListener("DOMContentLoaded", function() {
  const form = document.querySelector("form");
  const nameInput = document.querySelector("input[type='text']");
  const emailInput = document.querySelector("input[type='email']");
  const messageInput = document.querySelector("textarea");

  form.addEventListener("submit", function(event) {
    let valid = true;

    
    if (nameInput.value.trim() === "") {
      nameInput.style.border = "2px solid red";
      valid = false;
    }
    if (emailInput.value.trim() === "") {
      emailInput.style.border = "2px solid red";
      valid = false;
    }
    if (messageInput.value.trim() === "") {
      messageInput.style.border = "2px solid red";
      valid = false;
    }

    
    if (!valid) {
      alert("Please fill in all the fields.");
      event.preventDefault();
    }
  });
});
