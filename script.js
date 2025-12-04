document.getElementById("uploadBtn").onclick = () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Select a file first.");

  const progressContainer = document.getElementById("progressContainer");
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const result = document.getElementById("result");

  const formData = new FormData();
  formData.append("file", file);

  // Show progress UI
  progressContainer.style.display = "block";
  progressBar.style.width = "0%";
  progressText.textContent = "0%";

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload", true);

  // Handle upload progress
  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      const percent = Math.round((event.loaded / event.total) * 100);
      progressBar.style.width = percent + "%";
      progressText.textContent = percent + "%";
    }
  };

  // When upload finishes
  xhr.onload = () => {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      result.innerHTML = `
        <p>Upload complete!</p>
        <a href="${data.url}" target="_blank">${data.url}</a>
      `;
    } else {
      result.innerHTML = "<p style='color:red;'>Upload failed.</p>";
    }
  };

  xhr.send(formData);
};
