import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, Building, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeService } from '../services/employeeService';
import type { Employee } from '../types';
import { employeeSchema, type EmployeeFormData } from '../utils/validators';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { Table, Thead, Tbody, Tr, Th, Td } from '../components/common/Table';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      status: 'Active',
    },
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeeService.getEmployees();
      setEmployees(data || []);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) || 
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    setEditingId(null);
    reset({
      name: '',
      email: '',
      department: '',
      status: 'Active',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (employee: Employee) => {
    setEditingId(employee.id);
    setValue('name', employee.name);
    setValue('email', employee.email);
    setValue('department', employee.department);
    setValue('status', employee.status);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id);
        setEmployees(employees.filter(emp => emp.id !== id));
      } catch (error) {
        console.error('Failed to delete employee:', error);
      }
    }
  };

  const onSave = async (data: EmployeeFormData) => {
    try {
      setIsSaving(true);
      if (editingId) {
        const updated = await employeeService.updateEmployee(editingId, data);
        setEmployees(employees.map(emp => emp.id === updated.id ? updated : emp));
      } else {
        const created = await employeeService.createEmployee(data);
        setEmployees([...employees, created]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save employee:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="sm:flex sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Employee Directory
            </h2>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700 border border-blue-200/60">
              User Service (/api/users)
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-medium">Manage workforce records connected via the Application Load Balancer.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={handleAdd} size="md" className="shadow-md shadow-blue-500/20">
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Toolbar / Search */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md text-slate-400 focus-within:text-blue-600">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 shadow-xs transition-all"
            placeholder="Search by name, email, or department..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing <span className="text-slate-900 font-bold">{filteredEmployees.length}</span> employees
        </div>
      </div>

      {/* Employee Data Table */}
      {loading ? (
        <div className="h-64 flex items-center justify-center bg-white rounded-2xl border border-slate-200/80"><LoadingSpinner /></div>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Employee ID</Th>
              <Th>Name & Profile</Th>
              <Th>Email</Th>
              <Th>Department</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <Tr key={employee.id}>
                  <Td className="font-mono text-xs text-slate-400 font-semibold">
                    #{employee.id}
                  </Td>
                  <Td>
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                        {employee.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">{employee.name}</span>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <div className="flex items-center text-slate-600 font-medium">
                      <Mail className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                      {employee.email}
                    </div>
                  </Td>
                  <Td>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      <Building className="h-3 w-3 mr-1 text-slate-400" />
                      {employee.department}
                    </span>
                  </Td>
                  <Td>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      employee.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${employee.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      {employee.status}
                    </span>
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button 
                        onClick={() => handleEdit(employee)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Employee"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(employee.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete Employee"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td className="text-center py-12 text-slate-400 font-medium" colSpan={6}>
                  No employees matched your criteria.
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}

      {/* Modal Dialog */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Employee Record' : 'Create New Employee'}
      >
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <Input
            label="Full Name"
            {...register('name')}
            error={errors.name?.message}
            placeholder="e.g. Sarah Jenkins"
          />
          <Input
            label="Corporate Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
            placeholder="sarah.j@company.com"
          />
          <Input
            label="Department"
            {...register('department')}
            error={errors.department?.message}
            placeholder="e.g. Engineering"
          />
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Employment Status</label>
            <select
              {...register('status')}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 font-medium"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-rose-500 font-semibold">{errors.status.message}</p>
            )}
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              Save to User Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
