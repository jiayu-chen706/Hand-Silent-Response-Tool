import React from 'react';
import '../styles/EditResponseModal.css';

// The EditResponseModal component is used to show a modal dialog for editing a response.
// Props:
// - isOpen: A boolean to control whether the modal is visible or not.
// - onClose: A function to close the modal.
// - onSave: A function to save the edited response.
// - value: The current value of the response being edited.
// - setValue: A function to update the value of the response as the user types.
const EditResponseModal = ({ isOpen, onClose, onSave, value, setValue }) => {
  // If the modal is not open, return null and don't render anything.
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* Modal Header */}
        <h2>Edit Response</h2>

        {/* Textarea for editing the response */}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="modal-textarea"
        />
        {/* Modal Buttons: Cancel and Save */}
        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default EditResponseModal;
