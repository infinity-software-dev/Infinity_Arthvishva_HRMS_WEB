import { useState, useEffect, useCallback } from "react";
import { departmentService, Department } from "@/services/department.service";

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [error, setError] = useState<string | null>(null);

  const role = typeof window !== 'undefined' ? localStorage.getItem("role") : null;

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await departmentService.getAllDepartments(role === "HR");
      // Sort so active items are at the top and deleted ones are at the bottom
      const sortedData = data.sort((a: any, b: any) => {
        if (a.isActive === b.isActive) return 0;
        return a.isActive ? -1 : 1;
      });
      setDepartments(sortedData);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load departments";
      setError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const addDepartment = async (name: string): Promise<Department> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await departmentService.createDepartment({ name });
      await fetchDepartments();
      return created;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to add department";
      const formattedError = Array.isArray(message)
        ? message.join(", ")
        : message;
      setError(formattedError);
      throw new Error(formattedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDepartment = async (
    id: string,
    name: string,
  ): Promise<Department> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await departmentService.updateDepartment(id, name);
      await fetchDepartments();
      return updated;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update department";
      const formattedError = Array.isArray(message)
        ? message.join(", ")
        : message;
      setError(formattedError);
      throw new Error(formattedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeDepartment = async (id: string): Promise<void> => {
    setError(null);
    try {
      await departmentService.deleteDepartment(id);
      await fetchDepartments();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to remove department";
      const formattedError = Array.isArray(message)
        ? message.join(", ")
        : message;
      setError(formattedError);
      throw new Error(formattedError);
    }
  };

  const restoreDepartment = async (id: string): Promise<void> => {
    setError(null);
    try {
      await departmentService.restoreDepartment(id);
      await fetchDepartments();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to restore department";
      const formattedError = Array.isArray(message)
        ? message.join(", ")
        : message;
      setError(formattedError);
      throw new Error(formattedError);
    }
  };

  const handleAddClick = () => {
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (dept: Department) => {
    setSelectedDepartment(dept);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (name: string) => {
    if (selectedDepartment) {
      await updateDepartment(selectedDepartment._id, name);
    } else {
      await addDepartment(name);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      await removeDepartment(id);
    }
  };

  const handleRestore = async (id: string) => {
    if (window.confirm("Are you sure you want to restore this department?")) {
      await restoreDepartment(id);
    }
  };

  const refresh = () => fetchDepartments();

  return {
    role,
    departments,
    isLoading,
    isSubmitting,
    error,
    addDepartment,
    updateDepartment,
    removeDepartment,
    restoreDepartment,
    refresh,
    handleAddClick,
    handleEditClick,
    handleDelete,
    handleRestore,
    isModalOpen,
    setIsModalOpen,
    selectedDepartment,
    setSelectedDepartment,
    handleModalSubmit,
  };
}
