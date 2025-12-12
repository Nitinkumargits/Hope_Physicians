/**
 * DataTable Component
 * Reusable table with sorting, pagination, and search
 */

import { useState } from "react";
import StatusBadge from "./StatusBadge";

const DataTable = ({
  data = [],
  columns = [],
  onRowClick,
  searchable = true,
  pagination = true,
  pageSize = 10,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Filter data
  const filteredData = searchable
    ? data.filter((row) =>
        columns.some((col) => {
          const accessor = col.accessor;
          const value =
            typeof accessor === "function" ? accessor(row) : row[col.key];
          return value
            ?.toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        })
      )
    : data;

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const targetCol = columns.find((col) => col.key === sortConfig.key);
    const aValue =
      typeof targetCol?.accessor === "function"
        ? targetCol.accessor(a)
        : a[sortConfig.key];
    const bValue =
      typeof targetCol?.accessor === "function"
        ? targetCol.accessor(b)
        : b[sortConfig.key];

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = pagination
    ? sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : sortedData;

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* Search */}
      {searchable && (
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? "cursor-pointer hover:bg-gray-100" : ""
                  }`}>
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {column.sortable && sortConfig.key === column.key && (
                      <span>{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <tr
                  key={row.id ?? row._id ?? row.email ?? index}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={
                    onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                  }>
                  {columns.map((column) => {
                    const value = column.accessor
                      ? column.accessor(row)
                      : row[column.key];
                    return (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {column.render ? (
                          column.render(value, row)
                        ) : column.badge ? (
                          <StatusBadge status={value}>{value}</StatusBadge>
                        ) : (
                          value
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, sortedData.length)} of{" "}
            {sortedData.length} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
