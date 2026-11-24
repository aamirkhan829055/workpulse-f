import React, { useState, useEffect } from 'react';
import {
  IconSearch,
  IconPlus,
  IconPhone,
  IconCalendar,
  IconBadge,
  IconBriefcase,
  IconUser,
  IconAlertCircle,
  IconEye,
  IconEdit,
  IconTrash,
  IconX,
  IconMail,
} from '../common/Icons';
import AddEmployeeModal from './AddEmployeeModal';
import { API_BASE_URL } from '../../services/authService';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // States for View Modal
  const [viewEmployee, setViewEmployee] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);



  // Edit Employee Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    employeeId: "",
    designation: "",
    joiningDate: "",
  });




  // 1. GET ALL EMPLOYEES API CALL
  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/employees/get-all`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch employees');
      }

      setEmployees(result.data || []);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError(err.message || 'Could not load employees from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 2. ON ADD EMPLOYEE SUCCESS HANDLER
  const handleAddEmployee = (newEmp) => {
    if (newEmp) {
      setEmployees((prev) => [
        newEmp,
        ...prev.filter(
          (e) => e._id !== newEmp.id && e.employeeId !== newEmp.employeeId
        ),
      ]);
    }
    fetchEmployees();
  };

  // 3. ACTION HANDLERS

  const handleView = async (emp) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/employees/view/${emp.employeeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to fetch employee details"
        );
      }

      // API Response Data
      setViewEmployee(result.data);

      // Open View Modal
      setIsViewModalOpen(true);

    } catch (error) {
      console.error("View Employee Error:", error);

      alert(error.message || "Something went wrong");
    }
  };


  const handleEdit = (emp) => {
    setEditingEmployee(emp);

    setEditForm({
      fullName: emp.fullName || emp.name || "",
      email: emp.email || "",
      mobileNumber: emp.mobileNumber || emp.mobile || "",
      employeeId: emp.employeeId || "",
      designation: emp.designation || "",
      joiningDate: emp.joiningDate
        ? String(emp.joiningDate).slice(0, 10)
        : "",
    });

    setEditError("");
    setIsEditModalOpen(true);
  };






  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    if (!editingEmployee?._id) {
      setEditError("Employee ID not found");
      return;
    }

    try {
      setEditLoading(true);
      setEditError("");

      const response = await fetch(
        `${API_BASE_URL}/employees/edit/${editingEmployee._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Failed to update employee"
        );
      }

      // Update employee in frontend list
      setEmployees((prev) =>
        prev.map((emp) =>
          emp._id === editingEmployee._id
            ? result.data
            : emp
        )
      );

      setIsEditModalOpen(false);
      setEditingEmployee(null);

      alert(result.message || "Employee updated successfully!");

    } catch (error) {
      console.error("Update Employee Error:", error);
      setEditError(error.message || "Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (emp) => {
    const empName = emp.fullName || emp.name || "this employee";

    // MongoDB ID
    const deleteId = emp._id;

    if (!deleteId) {
      alert("Employee MongoDB ID not found");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${empName}?`
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/employees/delete/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete employee");
      }

      // Update Employee List
      setEmployees((prev) =>
        prev.filter((item) => item._id !== deleteId)
      );

      alert(result.message || "Employee deleted successfully");

    } catch (error) {
      console.error("Delete Employee Error:", error);
      alert(error.message || "Something went wrong");
    }
  };


  // Safe search filter
  const query = (searchQuery || '').trim().toLowerCase();
  const filteredEmployees = employees.filter((emp) => {
    const name = (emp?.fullName || emp?.name || '').toLowerCase();
    const email = (emp?.email || '').toLowerCase();
    const employeeId = (emp?.employeeId || '').toLowerCase();
    const designation = (emp?.designation || '').toLowerCase();
    const mobile = (emp?.mobileNumber || emp?.mobile || '').toLowerCase();

    return (
      name.includes(query) ||
      email.includes(query) ||
      employeeId.includes(query) ||
      designation.includes(query) ||
      mobile.includes(query)
    );
  });

  // Safe Date Formatter helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return String(dateStr);
    }
  };

  // Safe Initials helper
  const getInitials = (nameStr) => {
    if (!nameStr) return 'EM';
    return nameStr
      .trim()
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Employee Directory
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage your organization's workforce and credentials
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-600/20 transition cursor-pointer self-start sm:self-auto"
        >
          <IconPlus size={18} />
          <span>Add Employee</span>
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IconAlertCircle size={20} className="text-rose-500 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
          <button
            onClick={fetchEmployees}
            className="text-xs bg-rose-600 text-white px-3 py-1.5 rounded-lg hover:bg-rose-700 font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <IconSearch size={18} />
          </span>
          <input
            type="text"
            placeholder="Search by name, ID, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <span className="font-bold text-slate-800">{filteredEmployees.length}</span>{' '}
          of <span className="font-bold text-slate-800">{employees.length}</span> employees
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Employee</th>
                <th className="py-3.5 px-5">Employee ID</th>
                <th className="py-3.5 px-5">Designation</th>
                <th className="py-3.5 px-5">Contact Details</th>
                <th className="py-3.5 px-5">Joining Date</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm font-medium text-slate-600">Loading employees...</p>
                  </td>
                </tr>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, index) => {
                  const empName = emp.fullName || emp.name || 'Unknown Employee';
                  const empMobile = emp.mobileNumber || emp.mobile || 'N/A';
                  const empStatus = emp.status || 'Active';

                  return (
                    <tr
                      key={emp._id || emp.employeeId || index}
                      className="hover:bg-slate-50/60 transition group"
                    >
                      {/* Employee Name + Avatar */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                            {getInitials(empName)}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                              {empName}
                            </div>
                            <div className="text-xs text-slate-400">{emp.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Employee ID */}
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-xs font-medium">
                          <IconBadge size={14} className="text-slate-500" />
                          {emp.employeeId}
                        </span>
                      </td>

                      {/* Designation */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium text-sm">
                          <IconBriefcase size={16} className="text-slate-400" />
                          {emp.designation}
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-4 px-5">
                        <div className="space-y-1 text-xs text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <IconPhone size={13} className="text-slate-400" />
                            <span>{empMobile}</span>
                          </div>
                        </div>
                      </td>

                      {/* Joining Date */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <IconCalendar size={14} className="text-slate-400" />
                          <span>{formatDate(emp.joiningDate)}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${empStatus === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${empStatus === 'Active'
                              ? 'bg-emerald-500'
                              : 'bg-amber-500'
                              }`}
                          />
                          {empStatus}
                        </span>
                      </td>

                      {/* Action Icons: View, Edit, Delete */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Button */}
                          <button
                            type="button"
                            title="View Employee"
                            onClick={() => handleView(emp)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200/70 hover:border-indigo-200 transition cursor-pointer"
                          >
                            <IconEye size={16} />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            title="Edit Employee"
                            onClick={() => handleEdit(emp)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-amber-600 hover:bg-amber-50 border border-slate-200/70 hover:border-amber-200 transition cursor-pointer"
                          >
                            <IconEdit size={16} />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            title="Delete Employee"
                            onClick={() => handleDelete(emp)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/70 hover:border-rose-200 transition cursor-pointer"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <IconUser size={36} className="mx-auto mb-2 text-slate-300" />
                    <p className="font-medium text-slate-600">No employees found</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {searchQuery
                        ? 'No employees match your search query.'
                        : 'Click "Add Employee" to register your first employee.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Employee Modal */}
      {isEditModalOpen && editingEmployee && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">

          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="text-xl font-bold text-slate-800">
                  Edit Employee
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Update employee information and details
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditError("");
                }}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition cursor-pointer"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateEmployee}>

              <div className="p-6">

                {/* Employee Avatar */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                    {getInitials(editForm.fullName)}
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {editForm.fullName || "Employee Name"}
                    </h4>
                    <p className="text-xs text-indigo-600 font-medium">
                      {editForm.employeeId || "Employee ID"}
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {editError && (
                  <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
                    {editError}
                  </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={editForm.fullName}
                      onChange={handleEditChange}
                      placeholder="Enter full name"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address *
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      placeholder="Enter email address"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Mobile Number *
                    </label>

                    <input
                      type="tel"
                      name="mobileNumber"
                      value={editForm.mobileNumber}
                      onChange={handleEditChange}
                      placeholder="Enter mobile number"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
                    />
                  </div>

                  {/* Employee ID */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Employee ID *
                    </label>

                    <input
                      type="text"
                      name="employeeId"
                      value={editForm.employeeId}
                      onChange={handleEditChange}
                      placeholder="Enter employee ID"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
                    />
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Designation *
                    </label>

                    <input
                      type="text"
                      name="designation"
                      value={editForm.designation}
                      onChange={handleEditChange}
                      placeholder="Enter designation"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
                    />
                  </div>

                  {/* Joining Date */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Joining Date *
                    </label>

                    <input
                      type="date"
                      name="joiningDate"
                      value={editForm.joiningDate}
                      onChange={handleEditChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition"
                    />
                  </div>

                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditError("");
                  }}
                  disabled={editLoading}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {editLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Employee Modal */}
      {isViewModalOpen && viewEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <h3 className="text-lg font-bold text-slate-800">Employee Details</h3>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 cursor-pointer"
              >
                <IconX size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xl">
                  {getInitials(viewEmployee.fullName || viewEmployee.name)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">
                    {viewEmployee.fullName || viewEmployee.name}
                  </h4>
                  <p className="text-xs font-semibold text-indigo-600">
                    {viewEmployee.designation}
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {viewEmployee.employeeId}
                  </span>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <IconMail size={16} className="text-slate-400" />
                  <span className="font-medium text-slate-800">{viewEmployee.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <IconPhone size={16} className="text-slate-400" />
                  <span className="font-medium text-slate-800">
                    {viewEmployee.mobileNumber || viewEmployee.mobile || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <IconCalendar size={16} className="text-slate-400" />
                  <span className="text-slate-500">Joined: </span>
                  <span className="font-medium text-slate-800">
                    {formatDate(viewEmployee.joiningDate)}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50/60 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEmployee={handleAddEmployee}
      />
    </div>
  );
};

export default EmployeeList;
