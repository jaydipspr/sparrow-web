"use client";
import React, { useState } from "react";

/**
 * BaseTable Component - Reusable table component for admin panel
 * 
 * @param {Array} columns - Array of column definitions
 *   Each column should have: { key, label, render, mobileVisible, mobileLabel }
 * @param {Array} data - Array of data objects to display
 * @param {String} nameKey - Key in data object for the name/primary field (default: 'name')
 * @param {Function} renderActions - Function to render action buttons for each row
 * @param {Object} pagination - Pagination object with { currentPage, totalPages, totalCount, limit, hasNextPage, hasPrevPage }
 * @param {Function} onPageChange - Callback function when page changes (page) => void
 */
const BaseTable = ({ 
	columns = [], 
	data = [], 
	nameKey = "name", 
	renderActions,
	pagination = null,
	onPageChange = null,
}) => {
	const [expandedRows, setExpandedRows] = useState(new Set());

	const toggleRow = (index) => {
		const newExpanded = new Set(expandedRows);
		if (newExpanded.has(index)) {
			newExpanded.delete(index);
		} else {
			newExpanded.add(index);
		}
		setExpandedRows(newExpanded);
	};

	// Get columns that should be hidden on mobile (excluding name and actions)
	// Columns with mobileVisible: false will be shown in accordion
	const mobileHiddenColumns = columns.filter(
		(col) => col.key !== nameKey && col.key !== "actions" && !col.mobileVisible
	);

	// Get the name column - try to find by nameKey, or fallback to first column
	const nameColumn = columns.find((col) => col.key === nameKey) || columns.find((col) => col.key !== "actions") || columns[0];

	return (
		<>
			{/* Desktop Table View */}
			<div className="admin-table-wrapper admin-table-desktop">
				<table className="admin-table">
					<thead>
						<tr>
							{columns.map((column) => (
								<th key={column.key}>{column.label}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{data.map((row, index) => (
							<tr key={row._id || row.id || index}>
								{columns.map((column) => {
									if (column.key === "actions") {
										return (
											<td key={column.key}>
												<div className="admin-table-actions">
													{renderActions ? renderActions(row, index) : null}
												</div>
											</td>
										);
									}
									return (
										<td key={column.key}>
											{column.render
												? column.render(row[column.key], row, index)
												: row[column.key]}
										</td>
									);
								})}
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{/* Mobile Accordion View */}
			<div className="admin-table-mobile">
				{/* Mobile Table Header */}
				<div className="admin-table-mobile-header-row">
					<div className="admin-table-mobile-header-label">
						{nameColumn?.label || "Name"}
					</div>
					<div className="admin-table-mobile-header-label">
						{columns.find((col) => col.key === "actions")?.label || "Actions"}
					</div>
				</div>
				{data.map((row, index) => {
					const isExpanded = expandedRows.has(index);
					// Get name value - try nameKey first, then fallback to title or first available value
					const nameValue = nameColumn
						? nameColumn.render
							? nameColumn.render(row[nameKey] || row.title || row.name, row, index)
							: row[nameKey] || row.title || row.name || "-"
						: row[nameKey] || row.title || row.name || "-";

					return (
						<div key={row._id || row.id || index} className="admin-table-mobile-row">
							<div
								className="admin-table-mobile-header"
								onClick={() => toggleRow(index)}
							>
								<div className="admin-table-mobile-name">
									{nameValue}
								</div>
								<div className="admin-table-mobile-actions">
									{renderActions ? renderActions(row, index) : null}
									<button
										type="button"
										className={`admin-table-mobile-toggle ${isExpanded ? "expanded" : ""}`}
										onClick={(e) => {
											e.stopPropagation();
											toggleRow(index);
										}}
									>
										<i className={`fa-light fa-chevron-${isExpanded ? "up" : "down"}`}></i>
									</button>
								</div>
							</div>
							{isExpanded && mobileHiddenColumns.length > 0 && (
								<div className="admin-table-mobile-content">
									{mobileHiddenColumns.map((column) => {
										const columnValue = row[column.key];
										let renderedValue;
										
										if (column.render) {
											try {
												renderedValue = column.render(columnValue, row, index);
											} catch (error) {
												console.error(`Error rendering column ${column.key}:`, error);
												renderedValue = columnValue !== undefined && columnValue !== null ? String(columnValue) : "-";
											}
										} else {
											renderedValue = columnValue !== undefined && columnValue !== null
												? String(columnValue)
												: "-";
										}
										
										// Ensure we always render something
										if (!renderedValue || (typeof renderedValue === 'object' && !React.isValidElement(renderedValue))) {
											renderedValue = columnValue !== undefined && columnValue !== null ? String(columnValue) : "-";
										}
										
										return (
											<div key={column.key} className="admin-table-mobile-field">
												<div className="admin-table-mobile-field-label">
													{column.mobileLabel || column.label}:
												</div>
												<div className="admin-table-mobile-field-value">
													{renderedValue}
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					);
				})}
			</div>

			{/* Pagination */}
			{pagination && onPageChange && (
				<div className="admin-pagination">
					<div className="admin-pagination-info">
						Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{" "}
						{Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{" "}
						{pagination.totalCount} entries
					</div>
					<div className="admin-pagination-controls">
						<button
							type="button"
							className="admin-btn admin-btn-secondary admin-pagination-btn"
							onClick={() => onPageChange(pagination.currentPage - 1)}
							disabled={!pagination.hasPrevPage}
						>
							<i className="fa-light fa-chevron-left"></i>
							<span>Previous</span>
						</button>
						<div className="admin-pagination-pages">
							{Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
								.filter((page) => {
									// Show first page, last page, current page, and pages around current
									return (
										page === 1 ||
										page === pagination.totalPages ||
										(page >= pagination.currentPage - 1 && page <= pagination.currentPage + 1)
									);
								})
								.map((page, index, array) => {
									// Add ellipsis if there's a gap
									const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
									return (
										<React.Fragment key={page}>
											{showEllipsisBefore && (
												<span className="admin-pagination-ellipsis">...</span>
											)}
											<button
												type="button"
												className={`admin-pagination-page ${
													page === pagination.currentPage ? "active" : ""
												}`}
												onClick={() => onPageChange(page)}
											>
												{page}
											</button>
										</React.Fragment>
									);
								})}
						</div>
						<button
							type="button"
							className="admin-btn admin-btn-secondary admin-pagination-btn"
							onClick={() => onPageChange(pagination.currentPage + 1)}
							disabled={!pagination.hasNextPage}
						>
							<span>Next</span>
							<i className="fa-light fa-chevron-right"></i>
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default BaseTable;
