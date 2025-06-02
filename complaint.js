
document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("photo");
  const previewArea = document.querySelector(".preview-area");
  const fileInfo = document.querySelector(".file-info");
  const removeBtn = document.getElementById("remove-file");

  let filesArray = [];

  fileInput.addEventListener("change", function (e) {
    const newFiles = Array.from(e.target.files);
    filesArray = [...newFiles];
    updateFilePreview();
  });

  function updateFilePreview() {
    previewArea.innerHTML = '';
    let totalSize = 0;

    if (filesArray.length > 0) {
      filesArray.forEach((file, index) => {
        totalSize += file.size;
        const thumbnail = document.createElement('div');
        thumbnail.className = 'preview-thumbnail';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-image-btn';
        removeBtn.innerHTML = '×';
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          filesArray.splice(index, 1);
          updateFilePreview();
          updateFileInput();
        });

        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = function (e) {
            thumbnail.innerHTML = `
              <img src="${e.target.result}" alt="${file.name}">
              <div class="file-name">${file.name}</div>
              <div class="file-index">${index + 1}</div>
            `;
            thumbnail.appendChild(removeBtn);
            previewArea.appendChild(thumbnail);
          };
          reader.readAsDataURL(file);
        }
      });

      const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
      fileInfo.textContent = `${filesArray.length} file(s) selected (${totalSizeMB} MB)`;
      removeBtn.style.display = 'inline-block';
    } else {
      fileInfo.textContent = 'No files selected (Max: 1GB total)';
      removeBtn.style.display = 'none';
    }
  }

  function updateFileInput() {
    const dataTransfer = new DataTransfer();
    filesArray.forEach(file => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;
  }

  removeBtn.addEventListener("click", function (e) {
    e.preventDefault();
    filesArray = [];
    fileInput.value = '';
    previewArea.innerHTML = '';
    fileInfo.textContent = 'No files selected (Max: 1GB total)';
    this.style.display = 'none';
  });

  document.getElementById("complaintForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const photoInput = document.getElementById("photo");
    let totalSize = 0;
    if (photoInput.files.length > 0) {
      Array.from(photoInput.files).forEach(file => {
        totalSize += file.size;
      });

      if (totalSize > 1073741824) {
        alert("Total file size must be less than 1GB.");
        return;
      }
    }

    if (!validateFormFields()) {
      return;
    }

    let imageBase64 = '';
    if (photoInput.files.length > 0) {
      const file = photoInput.files[0];
      imageBase64 = await convertToBase64(file);
    }

    const complaintData = {
      zoneName: document.getElementById("zoneName").value,
      wardNo: document.getElementById("wardNo").value,
      department: document.getElementById("department").value,
      subDepartment: document.getElementById("subDepartment").value,
      complaintType: document.getElementById("complaintType").value,
      subject: document.getElementById("subject").value,
      description: document.getElementById("complaintDescription").value,
      imageBase64: imageBase64,
      timestamp: new Date().toISOString()
    };

    const existingComplaints = JSON.parse(localStorage.getItem("userComplaints") || "[]");
    existingComplaints.push(complaintData);
    localStorage.setItem("userComplaints", JSON.stringify(existingComplaints));

    window.location.href = "dashboard.html?complaint=submitted";
  });

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        resolve(e.target.result);
      };
      reader.onerror = function (error) {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  document.getElementById('department').addEventListener('change', updateSubDepartments);
  document.getElementById('subDepartment').addEventListener('change', updateComplaintTypes);
});

function validateFormFields() {
  return true;
}
