export const setUploadImg = (photoEl, file) => {
  photoEl.src = URL.createObjectURL(file);
  // when img load in upload_img el (src store)
  photoEl.addEventListener('load', () => URL.revokeObjectURL(photoEl.src));
};
