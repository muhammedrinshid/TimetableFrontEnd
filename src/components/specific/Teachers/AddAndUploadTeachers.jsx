import React, { useState } from 'react';
import { Upload, FileText, Download, AlertCircle, CheckCircle, XCircle, Plus } from 'lucide-react';
import { useAuth } from '../../../context/Authcontext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IconButton } from '@mui/material';
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

const AddAndUploadTeachers = ({ handleCreateTeacherOpen }) => {
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
      <div className={`bg-${color}-50 border-l-4 border-${color}-500 p-3 rounded-r-lg mb-2`}>
        <div className="flex items-start space-x-3">
          {icon}
          <div className="flex-1">
            <h4 className={`text-${color}-700 font-medium text-sm mb-1`}>{title}</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              {messages.map((msg, idx) => (
                <li key={idx} className="flex items-center space-x-2">
                  <span className={`w-1.5 h-1.5 bg-${color}-500 rounded-full`}></span>
                  <span>{msg}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <div className="flex  items-center justify-center mb-4">
        <div className="flex items-center space-x-2 flex-col justify-center gap-4">
          {/* Add Teacher Button */}
          <IconButton onClick={handleCreateTeacherOpen}>
          <AddCircleOutlineRoundedIcon
            sx={{
              color: "#312ECB",
              fontSize: 100,
              opacity: 0.8,
            }}
          />
        </IconButton>

          {/* Download Template Button */}
          <div className='flex flex-row justify-between gap-2'>
          <button
            onClick={downloadTemplate}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download"}
          </button>

          {/* Upload Template Button */}
          <label className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            {isUploading ? "Uploading..." : "Upload"}
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
      </div>

      {/* Upload Result Messages */}
      {uploadResult && (
        <div className="space-y-2 mt-2">
          {renderResultMessage(
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />,
            "Successfully Imported",
            uploadResult.success,
            "green"
          )}

          {renderResultMessage(
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />,
            "Warnings",
            uploadResult.warnings,
            "yellow"
          )}

          {renderResultMessage(
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
            "Errors Occurred",
            uploadResult.errors,
            "red"
          )}
        </div>
      )}
    </div>
  );
};

export default AddAndUploadTeachers;