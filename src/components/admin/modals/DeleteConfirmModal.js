"use client";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, itemName }) => {
	if (!isOpen) return null;

	return (
		<div className="admin-modal-overlay" onClick={onClose}>
			<div className="admin-modal admin-modal-sm" onClick={(e) => e.stopPropagation()}>
				<div className="admin-modal-header">
					<div className="admin-modal-icon admin-modal-icon-danger">
						<i className="fa-light fa-triangle-exclamation"></i>
					</div>
					<h3 className="admin-modal-title">{title || "Confirm Delete"}</h3>
					<button className="admin-modal-close" onClick={onClose}>
						<i className="fa-light fa-times"></i>
					</button>
				</div>

				<div className="admin-modal-body">
					<p className="admin-modal-message">
						{message || `Are you sure you want to delete "${itemName}"?`}
					</p>
					<p className="admin-modal-warning">
						This action cannot be undone.
					</p>
				</div>

				<div className="admin-modal-footer">
					<button
						type="button"
						className="admin-btn admin-btn-secondary"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						type="button"
						className="admin-btn admin-btn-danger"
						onClick={onConfirm}
					>
						<i className="fa-light fa-trash"></i>
						<span>Delete</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteConfirmModal;
