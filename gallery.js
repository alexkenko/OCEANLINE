// Gallery functionality
document.addEventListener('DOMContentLoaded', function() {
    // Gallery filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // File upload functionality
    const photoUpload = document.getElementById('photoUpload');
    const uploadArea = document.getElementById('uploadArea');

    photoUpload.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    addImageToGallery(e.target.result, file.name);
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        
        const files = Array.from(e.dataTransfer.files);
        
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    addImageToGallery(e.target.result, file.name);
                };
                reader.readAsDataURL(file);
            }
        });
    });
});

function addImageToGallery(imageSrc, fileName) {
    const galleryGrid = document.querySelector('.gallery-grid');
    const uploadArea = document.getElementById('uploadArea');
    
    // Create new gallery item
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-category', 'vessels');
    
    galleryItem.innerHTML = `
        <img src="${imageSrc}" alt="${fileName}" class="gallery-image">
        <div class="gallery-overlay">
            <h3>${fileName.split('.')[0]}</h3>
            <p>Uploaded photo</p>
            <button class="gallery-btn" onclick="openLightbox('${imageSrc}', '${fileName.split('.')[0]}', 'Uploaded photo')">
                <i class="ri-eye-line"></i> View
            </button>
        </div>
    `;
    
    // Insert before upload area
    galleryGrid.insertBefore(galleryItem, uploadArea);
    
    // Add animation
    galleryItem.style.animation = 'fadeInUp 0.5s ease';
}

function openLightbox(imageSrc, title, description) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDescription = document.getElementById('lightboxDescription');
    
    // For placeholder items, show placeholder content
    if (typeof imageSrc === 'string' && imageSrc.startsWith('vessel') || 
        imageSrc === 'crew1' || imageSrc === 'port1' || imageSrc === 'cert1' || 
        imageSrc === 'event1' || imageSrc === 'port2') {
        
        lightboxImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjVmNWY1Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwQzIwMCAxNjYuNTY5IDE4Ni41NjkgMTgwIDE3MCAxODBDMTUzLjQzMSAxODAgMTQwIDE2Ni41NjkgMTQwIDE1MEMxNDAgMTMzLjQzMSAxNTMuNDMxIDEyMCAxNzAgMTIwQzE4Ni41NjkgMTIwIDIwMCAxMzMuNDMxIDIwMCAxNTBaIiBmaWxsPSIjZGRkIi8+CjxwYXRoIGQ9Ik0yMDAgMTMwSDE2MFYxNzBIMjAwVjEzMFoiIGZpbGw9IiNjY2MiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxODAiIHk9IjEzMCI+CjxwYXRoIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMlM2LjQ4IDIyIDEyIDIyUzIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTIgMlpNMTIgMjBDNy41OSAyMCA0IDE2LjQxIDQgMTJTNy41OSA0IDEyIDRTMjAgNy41OSAyMCAxMlMxNi40MSAyMCAxMiAyMFoiIGZpbGw9IiM5OTkiLz4KPC9zdmc+Cjwvc3ZnPgo=';
        lightboxTitle.textContent = title || 'Gallery Image';
        lightboxDescription.textContent = description || 'This is a placeholder for your uploaded image.';
    } else {
        lightboxImage.src = imageSrc;
        lightboxTitle.textContent = title || 'Gallery Image';
        lightboxDescription.textContent = description || 'Uploaded image from gallery.';
    }
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close lightbox when clicking outside the image
document.getElementById('lightbox').addEventListener('click', function(e) {
    if (e.target === this) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});
