import apiClient from "@/constants/API/client";
import { HR_API } from "@/constants/API/api";

export interface Position {
    _id: string;
    name: string;
    isActive: boolean;
    responsibilities?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CreatePositionPayload {
    name: string;
}

export interface DeletePositionResponse {
    message: string;
}

export const positionService = {
  // READ ALL
  getAllPositions: async (showAll: boolean = false): Promise<Position[]> => {
    try {
      const url = showAll ? HR_API.GET_ALL_POSITIONS : HR_API.GET_ACTIVE_POSITIONS;
      const response = await apiClient.get(url);
      const data = Array.isArray(response.data) ? response.data : response.data.data;
      return data;
    } catch (error) {
      console.error("Error fetching positions:", error);
      throw error;
    }
  },

  // CREATE
  createPosition: async (name: string): Promise<Position> => {
    try {
      const response = await apiClient.post(HR_API.CREATE_POSITION, { name });
      return response.data;
    } catch (error) {
      console.error("Error creating position:", error);
      throw error;
    }
  },

  // UPDATE
  updatePosition: async (id: string, name: string): Promise<Position> => {
    try {
      const response = await apiClient.put(HR_API.UPDATE_POSITION(id), { name });
      return response.data;
    } catch (error) {
      console.error("Error updating position:", error);
      throw error;
    }
  },

  // DELETE (Soft Delete)
  deletePosition: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(HR_API.DELETE_POSITION(id));
    } catch (error) {
      console.error("Error deleting position:", error);
      throw error;
    }
  },



  // RESTORE (Undo Soft Delete)
  restorePosition: async (id: string): Promise<void> => {
    try {
      await apiClient.patch(HR_API.RESTORE_POSITION(id));
    } catch (error) {
      console.error("Error restoring position:", error);
      throw error;
    }
  },

  // ADD SINGLE RESPONSIBILITY
  addPositionResponsibility: async (id: string, responsibility: string): Promise<Position> => {
    try {
      const response = await apiClient.post(HR_API.ADD_POSITION_RESPONSIBILITY(id), { responsibility });
      return response.data;
    } catch (error) {
      console.error("Error adding responsibility:", error);
      throw error;
    }
  },

  // EDIT SINGLE RESPONSIBILITY
  editPositionResponsibility: async (id: string, index: number, responsibility: string): Promise<Position> => {
    try {
      const response = await apiClient.put(HR_API.EDIT_POSITION_RESPONSIBILITY(id, index), { responsibility });
      return response.data;
    } catch (error) {
      console.error("Error editing responsibility:", error);
      throw error;
    }
  },

  // DELETE SINGLE RESPONSIBILITY
  deletePositionResponsibility: async (id: string, index: number): Promise<Position> => {
    try {
      const response = await apiClient.delete(HR_API.DELETE_POSITION_RESPONSIBILITY(id, index));
      return response.data;
    } catch (error) {
      console.error("Error deleting responsibility:", error);
      throw error;
    }
  }
};
