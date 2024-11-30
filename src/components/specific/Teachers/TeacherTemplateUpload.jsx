import React, { useState } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../../context/Authcontext';
import axios from 'axios';
import { toast } from 'react-toastify';

const TeacherTemplateUpload = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const { apiDomain, headers } = useAuth();

  const downloadTemplate = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.get(`${apiDomain}/api/teacher/generate-teacher-template/`, {
        headers,
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "teacher_template.xlsx");

      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Template downloaded successfully!");
    } catch (error) {
      console.error("Error downloading template:", error);
      toast.error(error.response?.status === 400 ? "Please create grades before downloading the template." : "Failed to download template.");
    } finally {
      setIsDownloading(false);
    }
  };

  const uploadTemplate = async (file) => {
    setIsUploading(true);
    setUploadResult(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${apiDomain}/api/teacher/process-teacher-template/`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadResult(response.data);

      if (response.data.errors.length === 0) {
        toast.success("Teachers imported successfully!");
      } else {
        toast.warning("Import completed with some issues.");
      }
    } catch (error) {
      console.error("Error uploading template:", error);
      toast.error(error.response?.data?.error || "Failed to upload template.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        toast.error("Please upload an Excel file (.xlsx)");
        return;
      }
      uploadTemplate(file);
    }
  };

  const renderResultMessage = (icon, title, messages, color) => {
    if (!messages || messages.length === 0) return null;

    return (
      <div className={`bg-${color}-50 border-${color}-200 rounded-lg p-4 mb-4 flex items-start space-x-3`}>
        {icon}
        <div className="flex-1">
          <h4 className={`text-${color}-700 font-semibold mb-2`}>{title}</h4>
          <ul className="space-y-1 text-sm">
            {messages.map((msg, idx) => (
              <li key={idx} className="flex items-center space-x-2">
                <span className={`w-1.5 h-1.5 bg-${color}-500 rounded-full`}></span>
                <span>{msg}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex gap-3">
          <button
            onClick={downloadTemplate}
            disabled={isDownloading}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download Template"}
          </button>

          <label className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload Template"}
            <input
              type="file"
              accept=".xlsx"
              onChange={handleFileChange}
              disabled={isUploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {uploadResult && (
        <div className="space-y-4 mt-4">
          {renderResultMessage(
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />,
            "Successfully Imported",
            uploadResult.success,
            "green"
          )}

          {renderResultMessage(
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />,
            "Warnings",
            uploadResult.warnings,
            "yellow"
          )}

          {renderResultMessage(
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />,
            "Errors Occurred",
            uploadResult.errors,
            "red"
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherTemplateUpload;