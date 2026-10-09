import React, { useState } from "react";
import { FormInput, FormSelect } from "@/components/elements/FormFields";
import {
  AssetsIssueFormData,
  AssetRow,
} from "@/components/templates/forms/AssetsIssueFormTemplate";
import { useEmployees } from "@/hooks/employee-hooks/useEmployees";

interface AssetsIssueFormProps {
  onSubmit: (data: AssetsIssueFormData) => void;
}

export const AssetsIssueForm: React.FC<AssetsIssueFormProps> = ({
  onSubmit,
}) => {
  const [formData, setFormData] = useState<
    AssetsIssueFormData & { employeeTitle?: string; employeeEmail?: string }
  >({
    employeeTitle: "Mr.",
    employeeName: "",
    employeeId: "",
    department: "",
    designation: "",
    dateOfIssue: new Date().toISOString().split("T")[0],
    employeeEmail: "",
    assets: [
      {
        assetType: "Laptop / Desktop / Mobile",
        brandModel: "",
        serialNumber: "",
        assetId: "",
        condition: "New / Good",
      },
    ],
  });

  const { employees } = useEmployees("", "", "Active", 1, 1000);
  const employeeOptions = [
    { label: "Select Employee", value: "" },
    ...employees.map((emp) => ({
      label: emp.name,
      value: emp.name,
    })),
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // Auto-fill employee details when employee is selected
    if (name === "employeeName") {
      const selected = value ? employees.find((emp) => emp.name === value) : null;
      setFormData((prev) => ({
        ...prev,
        employeeName: value,
        employeeId: selected?.employeeCode || "",
        designation: selected?.position || "",
        department: selected?.department || "",
        employeeEmail: selected?.email || "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssetChange = (
    index: number,
    field: keyof AssetRow,
    value: string,
  ) => {
    const updatedAssets = [...(formData.assets || [])];
    updatedAssets[index] = { ...updatedAssets[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      assets: updatedAssets,
    }));
  };

  const addAssetRow = () => {
    setFormData((prev) => ({
      ...prev,
      assets: [
        ...(prev.assets || []),
        {
          assetType: "",
          brandModel: "",
          serialNumber: "",
          assetId: "",
          condition: "",
        },
      ],
    }));
  };

  const removeAssetRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      assets: (prev.assets || []).filter((_, i: number) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex gap-4">
          <div className="w-1/3">
            <FormSelect
              label="Title"
              name="employeeTitle"
              value={formData.employeeTitle || "Mr."}
              onChange={handleChange}
              options={[
                { label: "Mr.", value: "Mr." },
                { label: "Ms.", value: "Ms." },
                { label: "Mrs.", value: "Mrs." },
              ]}
              required
            />
          </div>
          <div className="flex-1">
            <FormSelect
              label="Employee Name"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              options={employeeOptions}
              required
            />
          </div>
        </div>

        <FormInput
          label="Employee ID"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          placeholder="e.g. EMP001"
          required
        />
        <FormInput
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          placeholder="e.g. IT"
          required
        />
        <FormInput
          label="Designation"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="e.g. Software Engineer"
          required
        />
        <FormInput
          label="Date of Issue"
          name="dateOfIssue"
          type="date"
          value={formData.dateOfIssue}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Assets
          </h3>
          <button
            type="button"
            onClick={addAssetRow}
            className="px-3 py-1.5 text-sm bg-brand-blue text-white rounded-lg hover:bg-brand-blue/90"
          >
            + Add Asset
          </button>
        </div>

        {(formData.assets || []).map((asset: AssetRow, index: number) => (
          <div
            key={index}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl space-y-4 relative"
          >
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeAssetRow(index)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Asset Type"
                name="assetType"
                value={asset.assetType || ""}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
                ) => handleAssetChange(index, "assetType", e.target.value)}
                placeholder="e.g. Laptop"
              />
              <FormInput
                label="Brand / Model"
                name="brandModel"
                value={asset.brandModel || ""}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
                ) => handleAssetChange(index, "brandModel", e.target.value)}
                placeholder="e.g. Dell XPS"
              />
              <FormInput
                label="Serial Number"
                name="serialNumber"
                value={asset.serialNumber || ""}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
                ) => handleAssetChange(index, "serialNumber", e.target.value)}
                placeholder="Serial No."
              />
              <FormInput
                label="Asset ID"
                name="assetId"
                value={asset.assetId || ""}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
                ) => handleAssetChange(index, "assetId", e.target.value)}
                placeholder="Asset ID"
              />
              <FormInput
                label="Condition"
                name="condition"
                value={asset.condition || ""}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
                ) => handleAssetChange(index, "condition", e.target.value)}
                placeholder="e.g. New"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="submit"
          className="px-6 py-2.5 bg-brand-green text-white font-medium rounded-xl hover:bg-brand-green/90 transition-all focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          Preview & Generate
        </button>
      </div>
    </form>
  );
};
