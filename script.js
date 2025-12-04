document.getElementById("uploadBtn").onclick = async () => {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return alert("Select a file first.");

  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/upload", {
    method: "POST",
    body: form
  });

  const data = await res.json();
  document.getElementById("result").innerHTML =
    `<p>Download link:</p><a href="${data.url}" target="_blank">${data.url}</a>`;
};
