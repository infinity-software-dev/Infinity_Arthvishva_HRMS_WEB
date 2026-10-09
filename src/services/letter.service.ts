import apiClient from "@/constants/API/client";
import { MAIL_API } from "@/constants/API/api";

export const letterService = {
  /**
   * Send a generated PDF letter via email
   * @param formData FormData containing the PDF file and email details
   * @returns API response
   */
  sendLetterEmail: async (formData: FormData): Promise<any> => {
    try {
      const response = await apiClient.post(
        MAIL_API.SEND_LETTER_EMAIL,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error in letterService.sendLetterEmail:", error);
      throw error;
    }
  },
};
