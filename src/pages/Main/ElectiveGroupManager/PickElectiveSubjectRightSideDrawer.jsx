import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/Authcontext";
import axios from "axios";
import { FolderX, GraduationCap, X, RefreshCw } from "lucide-react";
import { useQuery } from "react-query";
import DrawerElectiveSubjectBlock from "./DrawerElectiveSubjectBlock";

const PickElectiveSubjectRightSideDrawer = ({
  onClose,
  isPickElectiveSubDrawerOpen,
  setElectiveSubjects,
  electiveSubjects,
}) => {
  const { apiDomain, headers, handleError } = useAuth();

  const fetchElectiveSubjects = async (standardId) => {
    try {
      const url = standardId
        ? `${apiDomain}/api/elective-group/standard-elective-subjects/${standardId}/`
        : `${apiDomain}/api/elective-group/standard-elective-subjects/`;
      const response = await axios.get(url, { headers });

      return response.data; // Returning the data directly
    } catch (err) {
      handleError(err);
      throw err; // Ensure that the error is properly handled by React Query
    }
  };

  const standardId = isPickElectiveSubDrawerOpen?.standardId;

  const {
    data: fetchedElectiveSubjects,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    ["electiveSubjects", standardId],
    () => fetchElectiveSubjects(standardId),
    {
      onSuccess: (data) => setElectiveSubjects(data),staleTime:0
    }
    
  );

  useEffect(() => {
    // If no elective subjects are loaded initially, set them
    if (!electiveSubjects && fetchedElectiveSubjects) {
      setElectiveSubjects(fetchedElectiveSubjects);
    }
  }, [fetchedElectiveSubjects, electiveSubjects, setElectiveSubjects]);

  const standardName = isPickElectiveSubDrawerOpen?.standardName;

  return (
    <div
      className="w-[320px] h-full bg-white flex flex-col"
      role="dialog"
      aria-label="Elective Subjects Drawer"
    >
      {/* Header */}
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 min-w-0">
            <GraduationCap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-semibold text-gray-800 break-words">
                {standardName ? (
                  <>
                    Elective Subjects
                    <span className="block text-base text-gray-600 font-normal mt-0.5">
                      for {standardName}
                    </span>
                  </>
                ) : (
                  "Ungrouped Elective Subjects in this School"
                )}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                {standardName
                  ? "Drag subjects to assign them to elective groups"
                  : "Drag subjects to assign them to groups or manage them as ungrouped"}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* Refresh button */}
            <button
              onClick={() => refetch()} // Triggers the refetch
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              aria-label="Refresh Elective Subjects"
            >
              <RefreshCw className="w-5 h-5 text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-row flex-wrap gap-2">
          {isLoading ? (
            <div className="text-center">Loading...</div>
          ) : isError ? (
            <div className="text-center text-red-500">
              Error loading subjects.
            </div>
          ) : !electiveSubjects || electiveSubjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg">
              <FolderX className="w-12 h-12 text-gray-400 mb-3" />
              <h3 className="text-gray-600 font-medium mb-1">
                No Elective Subjects
              </h3>
              <p className="text-sm text-gray-500">
                {standardName
                  ? `There are currently no elective subjects available for ${standardName}`
                  : "There are currently no elective subjects available"}
              </p>
            </div>
          ) : (
            electiveSubjects.map((electiveSubject) => (
              <DrawerElectiveSubjectBlock
                key={electiveSubject.id}
                electiveSubject={electiveSubject}
                standardId={isPickElectiveSubDrawerOpen.standardId}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PickElectiveSubjectRightSideDrawer;
