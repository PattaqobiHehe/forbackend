// File upload functionality
  document.addEventListener("DOMContentLoaded", function() {
    const fileInput = document.getElementById("photo");
    const previewArea = document.querySelector(".preview-area");
    const fileInfo = document.querySelector(".file-info");
    const removeBtn = document.getElementById("remove-file");
    let filesArray = []; // This will store our File objects
  
    fileInput.addEventListener("change", function(e) {
      // Convert FileList to Array and add new files
      const newFiles = Array.from(e.target.files);
      filesArray = [...filesArray, ...newFiles];
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
          
          // Create remove button for this image
          const removeBtn = document.createElement('button');
          removeBtn.className = 'remove-image-btn';
          removeBtn.innerHTML = '×';
          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            filesArray.splice(index, 1); // Remove this file from array
            updateFilePreview(); // Refresh the display
            updateFileInput(); // Update the actual file input
          });
  
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
              thumbnail.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <div class="file-name">${file.name}</div>
                <div class="file-index">${index + 1}</div>
              `;
              thumbnail.appendChild(removeBtn);
            };
            reader.readAsDataURL(file);
          } else {
            thumbnail.innerHTML = `
              <div class="file-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <div class="file-name">${file.name}</div>
                <div class="file-index">${index + 1}</div>
              </div>
            `;
            thumbnail.appendChild(removeBtn);
          }
          
          previewArea.appendChild(thumbnail);
        });
        
        const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
        fileInfo.textContent = `${filesArray.length} file${filesArray.length > 1 ? 's' : ''} selected (${totalSizeMB} MB)`;
        document.getElementById("remove-file").style.display = 'inline-block';
      } else {
        fileInfo.textContent = 'No files selected (Max: 1GB total)';
        document.getElementById("remove-file").style.display = 'none';
      }
    }
  
    function updateFileInput() {
      // Create a new DataTransfer object and add files
      const dataTransfer = new DataTransfer();
      filesArray.forEach(file => dataTransfer.items.add(file));
      
      // Assign the DataTransfer files to the file input
      fileInput.files = dataTransfer.files;
    }
  
    // Remove all files
    removeBtn.addEventListener("click", function(e) {
      e.preventDefault();
      filesArray = [];
      fileInput.value = '';
      previewArea.innerHTML = '';
      fileInfo.textContent = 'No files selected (Max: 1GB total)';
      this.style.display = 'none';
    });
  

  // Form submission
  document.getElementById("complaintForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    // Validate file size
    const photoInput = document.getElementById("photo");
    if (photoInput.files.length > 0) {
      let totalSize = 0;
      Array.from(photoInput.files).forEach(file => {
        totalSize += file.size;
      });
      
      if (totalSize > 1073741824) { // 1GB in bytes
        alert("Total file size must be less than 1GB.");
        return;
      }
    }

    // Validate other form fields if needed
    if (!validateFormFields()) {
      return;
    }

    // Submit form (simulated)
    setTimeout(() => {
      window.location.href = "dashboard.html?success=true";
    }, 1000);
  });

  // Initialize department dropdowns
  document.getElementById('department').addEventListener('change', updateSubDepartments);
  document.getElementById('subDepartment').addEventListener('change', updateComplaintTypes);
});

function validateFormFields() {
  // Add your form validation logic here
  return true; // Return false if validation fails
}