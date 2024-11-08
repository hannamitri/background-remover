function openMenu() {
  document.body.classList.add("menu--open");
}

function closeMenu() {
  document.body.classList.remove("menu--open");
}

const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("fileInput");
const imageContainer = document.getElementById("image-container");
const loadingSpinner = document.getElementById("loading-spinner");
const imageButtons = document.getElementById("image-buttons");
const resetButton = document.getElementById("reset-button");
const downloadButton = document.getElementById("download-button");

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(
    eventName,
    () => dropArea.classList.add("hover"),
    false
  );
});

["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(
    eventName,
    () => dropArea.classList.remove("hover"),
    false
  );
});

dropArea.addEventListener("drop", handleDrop, false);
dropArea.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", handleFiles);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  handleFiles({ target: { files } });
}

function handleFiles(e) {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB.");
      return;
    }
    showOriginalImage(file);

    // Uncomment the below line to use the API (download only works with the API)
    // uploadImage(file);

    // Comment the below line to use the API (download only works with the API)
    mockUploadImage(file);
  }
}

function showOriginalImage(file) {
  imageContainer.style.opacity = 0.4;
  dropArea.style.display = "none";

  const originalImg = document.createElement("img");
  originalImg.alt = "Original Image";
  originalImg.style.maxWidth = "100%";
  originalImg.style.maxHeight = "400px";
  
  const reader = new FileReader();
  reader.onload = function (event) {
    originalImg.src = event.target.result;
    imageContainer.appendChild(originalImg);
  };
  reader.readAsDataURL(file);
  loadingSpinner.style.display = "flex";
}

function mockUploadImage() {
  setTimeout(() => {
    imageButtons.style.display = "flex";
    imageContainer.style.opacity = 1;
    loadingSpinner.style.display = "none";

    const mockImageLink = "https://firebasestorage.googleapis.com/v0/b/frontend-simplified.appspot.com/o/Ai%20project%20images%2Ftiger-without-background.png?alt=media&token=a381a494-df56-44eb-af22-e62e5a25d90e";

    const processedImg = document.createElement("img");
    processedImg.src = mockImageLink;
    processedImg.alt = "Processed Image";
    processedImg.style.maxWidth = "100%";
    processedImg.style.maxHeight = "400px";

    imageContainer.innerHTML = "";
    imageContainer.appendChild(processedImg);
  }, 1000);
}

async function uploadImage(file) {
  const url =
    "https://background-removal4.p.rapidapi.com/v1/results?mode=fg-image";
  const data = new FormData();
  data.append("image", file);

  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": "5a520f2426msh5a93812f2f6b507p1c1095jsnaccee60b89e8",
      "x-rapidapi-host": "background-removal4.p.rapidapi.com",
    },
    body: data,
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    imageButtons.style.display = "flex";
    imageContainer.style.opacity = 1;
    loadingSpinner.style.display = "none";

    const imageLink = result.results[0].entities[0].image;

    const processedImg = document.createElement("img");
    processedImg.src = `data:image/png;base64,${imageLink}`;
    processedImg.alt = "Processed Image";
    processedImg.style.maxWidth = "100%";
    processedImg.style.maxHeight = "400px";

    imageContainer.innerHTML = "";
    imageContainer.appendChild(processedImg);
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to remove the background. Please try again.");
    dropArea.style.display = "flex";
    imageContainer.innerHTML = "";
    loadingSpinner.style.display = "none";
  }
}

resetButton.addEventListener("click", () => {
  imageContainer.innerHTML = "";
  imageButtons.style.display = "none";
  fileInput.value = "";
  dropArea.style.display = "flex";
});

downloadButton.addEventListener("click", () => {
  const processedImg = imageContainer.querySelector("img");
  const link = document.createElement("a");
  link.href = processedImg.src;
  link.download = "processed-image.png";
  link.click();
});
