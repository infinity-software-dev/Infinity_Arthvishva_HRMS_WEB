import { useState } from "react";
import { useEmployees } from "@/hooks/employee-hooks/useEmployees";

export function useLetters() {
  const [selectedLetter, setSelectedLetter] = useState<string>("");
  const [selectedForm, setSelectedForm] = useState<string>("");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  // Fetch active employees
  const { employees, isLoading: isLoadingEmployees } = useEmployees(
    "",
    "",
    "Active",
    1,
    1000,
  );

  const letterTypes = [
    "Offer Letter",
    "Internship Offer Letter",
    "Appointment Letter",
    "Confirmation Letter",
    "Increment Letter",
    "Experience Letter",
    "Internship Experience Letter",
    "Relieving Letter",
    "Warning Letter",
  ];

  const formTypes = ["Asset Issue Form", "No Dues Form", "Handover Form"];

  return {
    selectedLetter,
    setSelectedLetter,
    selectedForm,
    setSelectedForm,
    selectedEmployee,
    setSelectedEmployee,
    employees,
    isLoadingEmployees,
    letterTypes,
    formTypes,
  };
}
