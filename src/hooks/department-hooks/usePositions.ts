import { useState, useEffect, useCallback } from "react";
import { positionService, Position } from "@/services/position.service";

export function usePositions() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] =
    useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);

  const role = typeof window !== 'undefined' ? localStorage.getItem("role") : null;

  const fetchPositions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await positionService.getAllPositions(role === "HR");
      // Sort so active items are at the top and deleted ones are at the bottom
      const sortedData = data.sort((a: any, b: any) => {
        if (a.isActive === b.isActive) return 0;
        return a.isActive ? -1 : 1;
      });
      setPositions(sortedData);
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to load positions";
      setError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  const addPosition = async (name: string): Promise<Position> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await positionService.createPosition(name);
      await fetchPositions();
      return created;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to add position";
      const formattedError = Array.isArray(message)
        ? message.join(", ")
        : message;
      setError(formattedError);
      throw new Error(formattedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePosition = async (
    id: string,
    name: string,
  ): Promise<Position> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await positionService.updatePosition(id, name);
      await fetchPositions();
      return updated;
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to update position";
      const formattedError = Array.isArray(message)
        ? message.join(", ")
        : message;
      setError(formattedError);
      throw new Error(formattedError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removePosition = async (id: string): Promise<void> => {
    setError(null);
    try {
      await positionService.deletePosition(id);
      await fetchPositions();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to remove position";
      const formattedError = Array.isArray(message)
        ? message.join(", ")
        : message;
      setError(formattedError);
      throw new Error(formattedError);
    }
  };

  const restorePosition = async (id: string): Promise<void> => {
    setError(null);
    try {
      await positionService.restorePosition(id);
      await fetchPositions();
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Failed to restore position";
      const formattedError = Array.isArray(message)
        ? message.join(", ")
        : message;
      setError(formattedError);
      throw new Error(formattedError);
    }
  };

  const handleAddClick = () => {
    setSelectedPosition(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (pos: Position) => {
    setSelectedPosition(pos);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (name: string) => {
    if (selectedPosition) {
      await updatePosition(selectedPosition._id, name);
    } else {
      await addPosition(name);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      await removePosition(id);
    }
  };

  const handleRestore = async (id: string) => {
    if (window.confirm("Are you sure you want to restore this position?")) {
      await restorePosition(id);
    }
  };

  const refresh = () => fetchPositions();

  return {
    role,
    positions,
    isLoading,
    isSubmitting,
    error,
    addPosition,
    updatePosition,
    removePosition,
    restorePosition,
    refresh,
    handleAddClick,
    handleEditClick,
    handleDelete,
    handleRestore,
    isModalOpen,
    setIsModalOpen,
    selectedPosition,
    setSelectedPosition,
    handleModalSubmit,
  };
}
