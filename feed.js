document.addEventListener("DOMContentLoaded", function () {
  // Back to Dashboard Button
  const backToDashboardBtn = document.getElementById("backToDashboardBtn");
  backToDashboardBtn.addEventListener("click", function () {
    window.location.href = "dashboard.html"; // Redirect to dashboard
  });

  // Like Button Functionality
  const likeButtons = document.querySelectorAll(".like-btn");
  likeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const likeCount = button.querySelector(".like-count");
      let count = parseInt(likeCount.textContent);
      count++;
      likeCount.textContent = count;
    });
  });

  // Save Button Functionality
  const saveButtons = document.querySelectorAll(".save-btn");
  saveButtons.forEach((button) => {
    button.addEventListener("click", function () {
      alert("Post saved! You can access it later in your saved posts.");
    });
  });

  // Comment Input Functionality
  const commentInputs = document.querySelectorAll(".comment-input");
  commentInputs.forEach((input) => {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter" && input.value.trim() !== "") {
        const commentSection = input.parentElement;
        const newComment = document.createElement("div");
        newComment.className = "comment";
        newComment.innerHTML = `
          <span class="comment-username">You</span>
          <span class="comment-text">${input.value}</span>
        `;
        commentSection.insertBefore(newComment, input);
        input.value = ""; // Clear input
      }
    });
  });
});