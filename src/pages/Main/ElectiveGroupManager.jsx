import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/Authcontext";
import {
  CustomSelect,
  SearchInput,
  StyledAvatarGroup,
} from "../../components/Mui components";
import axios from "axios";
import { Avatar, IconButton, Tooltip } from "@mui/material";
import GradeSortMenu from "../../components/specific/ClassInSchool/GradeSortMenu";
import ElectiveGroupManagerClassCard from "./ElectiveGroupManager/ElectiveGroupManagerClassCard";
import EmptyElectiveGroupState from "../../components/empty state management components/EmptyElectiveGroupState";
import { HiOutlineRectangleGroup } from "react-icons/hi2";
import { motion } from "framer-motion";
import ElectiveGroupCard from "./ElectiveGroupManager/ElectiveGroupCard";
import { RiAddFill } from "react-icons/ri";
import PickElectiveSubjectRightSideDrawer from "./ElectiveGroupManager/PickElectiveSubjectRightSideDrawer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ElectiveGroupCreationDialog from "./ElectiveGroupManager/ElectiveGroupCreationDialog";
import DeleteConfirmationPopup from "../../components/common/DeleteConfirmationPopup";
import { toast } from "react-toastify";
import { useElectiveGroupsConflictChecker } from "../../hooks/useElectiveGroupsConflictChecker";
const getCharLightColor = (char) => {
  const singleChar = char.charAt(0);

  // Get the character code
  const charCode = singleChar.charCodeAt(0);

  // Use a prime number to create more spread in the color space
  const prime = 31;
  const hash = (charCode * prime) % 360;

  // Generate pastel colors by using high lightness and medium saturation
  return `hsl(${hash}, 70%, 80%)`;
};

const ElectiveGroupManager = () => {
  const { apiDomain, headers, handleError } = useAuth();
  const [electiveGroups, setElectiveGroups] = useState([]);
  const [conflicts, setConflicts] = useState({});
  const [whichGradeToDisplay, setWhichGradeToDisplay] = useState("");
  const [sortMethod, setSortMethod] = useState("Grade Name A-Z"); // Default sort method
  const [searchQuery, setSearchQuery] = useState("");
  const [isPickElectiveSubDrawerOpen, setIsPickElectiveSubDrawerOpen] =
    useState({ standardId: null });
  const [currentStandardIdForNewGroup, setCurrentStandardIdForNewGroup] =
    useState({isOpen:false,standardId:null,initialData:null,mode:"create"});
  const [isDeleteElectiveSubjectForm, setIsDeleteElectiveSubjectForm] =
    useState(null);
  const [electiveSubjects, setElectiveSubjects] = useState([]);

  useEffect(() => {
    fetchElectiveGroups();
  }, []);

  const fetchElectiveGroups = async () => {
    try {
      const response = await axios.get(
        `${apiDomain}/api/elective-group/groups/`,
        { headers }
      );
      setElectiveGroups(response.data);
    } catch (err) {
      handleError(err);
    }
  };

  const onsubmitElectivegroups = async () => {
    try {
      // Step 1: Create a dictionary with group_id as key and a list of elective subjects' names as value
      const formattedData = {};

      electiveGroups.forEach((grade) => {
        grade.standards.forEach((standard) => {
          standard.electives_groups.forEach((group) => {
            formattedData[group.group_id] = group.elective_subjects.map(
              (subject) => subject.elective_subject_id
            );
          });
        });
      });
      console.log("Formatted Data:", formattedData);

      // Step 2: Send the formatted data to the API
      const response = await axios.put(
        `${apiDomain}/api/elective-group/groups/`,
        { groups: formattedData },
        { headers }
      );

      toast.success("data updated successfully");
      fetchElectiveGroups();
    } catch (err) {
      // Step 4: Handle errors
      console.error("Error submitting elective groups:", err);
      handleError(err); // Assuming handleError manages error display/logging
    }
  };

  const handleGradeChange = (value) => {
    setWhichGradeToDisplay(value);
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenCreateNewDialog = (standardId,initialData=null,mode="create") => {
    setCurrentStandardIdForNewGroup({isOpen:true,standardId,initialData,mode});
  };
  const handleOpenDelateDialog = (electiveGroupId) => {
    setIsDeleteElectiveSubjectForm(electiveGroupId);
  };

  const handleCloseCreateNewDialog = () => {
    setCurrentStandardIdForNewGroup({isOpen:false});
  };

  const moveElectiveSubject = useCallback(
    (draggedItem, targetGroup, standardId) => {
      if (draggedItem?.from == "group") {
        setElectiveGroups((prevState) => {
          try {
            // Create a deep copy of the state
            const updatedElectiveGroups = JSON.parse(JSON.stringify(prevState));

            // Find the grade and standard in a single pass
            const grade = updatedElectiveGroups.find((grade) =>
              grade.standards.some(
                (standard) => standard.standard_id === standardId
              )
            );

            if (!grade) {
              console.error("Grade not found for standard ID:", standardId);
              return prevState;
            }

            const standard = grade.standards.find(
              (std) => std.standard_id === standardId
            );

            if (!standard) {
              console.error("Standard not found for ID:", standardId);
              return prevState;
            }

            // Find source and target groups
            const sourceGroup = standard.electives_groups.find(
              (group) => group.group_id === draggedItem.groupId
            );

            const targetElectiveGroup = standard.electives_groups.find(
              (group) => group.group_id === targetGroup.group_id
            );

            if (!sourceGroup || !targetElectiveGroup) {
              console.error("Source or target group not found");
              return prevState;
            }

            // Prevent dropping in the same group
            if (sourceGroup.group_id === targetElectiveGroup.group_id) {
              return prevState;
            }

            // Create a new subject object with all necessary properties including the ID
            const subjectToMove = {
              elective_subject_id: draggedItem.elective_subject_id, // Include the unique ID
              elective_subject_name: draggedItem.elective_subject_name,
              classroom_name: draggedItem.classroom_name,
              standard_id: draggedItem?.standard_id,
              classroom_id: draggedItem?.classroom_id,
              lessons_per_week: draggedItem.lessons_per_week,
              options: draggedItem.options || [],
            };

            // Remove from source group using the unique ID
            sourceGroup.elective_subjects =
              sourceGroup.elective_subjects.filter(
                (subject) =>
                  subject.elective_subject_id !==
                  draggedItem.elective_subject_id
              );

            // Add to target group
            targetElectiveGroup.elective_subjects.push(subjectToMove);

            return updatedElectiveGroups;
          } catch (error) {
            console.error("Error in moveElectiveSubject:", error);
            return prevState;
          }
        });
      }
      if (draggedItem?.from === "drawer") {
        setElectiveGroups((prevState) => {
          try {
            // Create a deep copy of the state
            const updatedElectiveGroups = JSON.parse(JSON.stringify(prevState));

            // Find the grade and standard in a single pass
            const grade = updatedElectiveGroups.find((grade) =>
              grade.standards.some(
                (standard) => standard.standard_id === standardId
              )
            );

            if (!grade) {
              console.error("Grade not found for standard ID:", standardId);
              return prevState;
            }

            const standard = grade.standards.find(
              (std) => std.standard_id === standardId
            );

            if (!standard) {
              console.error("Standard not found for ID:", standardId);
              return prevState;
            }

            const targetElectiveGroup = standard.electives_groups.find(
              (group) => group.group_id === targetGroup.group_id
            );

            if (!targetElectiveGroup) {
              console.error("Target group not found");
              return prevState;
            }

            // Create a new subject object with all necessary properties including the ID
            const subjectToMove = {
              elective_subject_id: draggedItem.elective_subject_id, // Include the unique ID
              elective_subject_name: draggedItem.elective_subject_name,
              classroom_name: draggedItem.classroom_name,
              lessons_per_week: draggedItem.lessons_per_week,
              options: draggedItem.options || [],
            };

            // Remove from source group using the unique ID
            setElectiveSubjects((prev) =>
              prev.filter(
                (subject) =>
                  subject.elective_subject_id !==
                  draggedItem.elective_subject_id
              )
            );

            // Add to target group
            targetElectiveGroup.elective_subjects.push(subjectToMove);

            return updatedElectiveGroups;
          } catch (error) {
            console.error("Error in moveElectiveSubject:", error);
            return prevState;
          }
        });
      }
    },
    []
  );
  const removeElectiveSubjectFromGroup = async (
    standardId,
    standardName,
    groupId,
    electiveSubjectId
  ) => {
    try {
      // Send the request to remove the subject from the group
      const response = await axios.patch(
        `${apiDomain}/api/elective-group/remove-elective-group/${electiveSubjectId}/`,
        {},
        { headers }
      );

      // Clone the groups to avoid direct mutation
      setElectiveGroups((prevGroups) => {
        const updatedGroups = JSON.parse(JSON.stringify(prevGroups)); // Deep clone to avoid direct mutation

        // Find the standard and group
        updatedGroups.forEach((grade) => {
          grade.standards.forEach((standard) => {
            if (standard.standard_id === standardId) {
              standard.electives_groups.forEach((group) => {
                if (group.group_id === groupId) {
                  // Filter out the elective subject and collect the removed subject
                  const remainingElectives = [];
                  group.elective_subjects.forEach((subject) => {
                    if (subject.elective_subject_id === electiveSubjectId) {
                    } else {
                      remainingElectives.push(subject);
                    }
                  });
                  group.elective_subjects = remainingElectives;
                }
              });
            }
          });
        });

        return updatedGroups;
      });
      setIsPickElectiveSubDrawerOpen({
        standardId: standardId,
        standardName: standardName,
      });
      toast.success("Elective block removed successfully")
    } catch (error) {
      handleError(error);
    }
  };
  const handleConfirmElectiveGroupDelete = async () => {
    if (isDeleteElectiveSubjectForm) {
      try {
        const response = await axios.delete(
          `${apiDomain}/api/elective-group/group/${isDeleteElectiveSubjectForm}`,
          {
            headers: headers,
          }
        );
        toast.success("Successfully deleted");
        setIsDeleteElectiveSubjectForm(null);
        setElectiveGroups((prevGrades) =>
          prevGrades.map((grade) => ({
            ...grade,
            standards: grade.standards.map((standard) => ({
              ...standard,
              electives_groups: standard.electives_groups.filter(
                (group) => group.group_id !== isDeleteElectiveSubjectForm
              ),
            })),
          }))
        );
      } catch (error) {
        console.error("There was an error deleting the Elective Group:", error);
        toast.error("Error occurred");
      }
    }
  };
  const options = [
    ...electiveGroups.map((grade) => ({
      value: grade?.grade_name,
      label: grade?.grade_name,
    })),
  ];
  const filteredGrades = whichGradeToDisplay
    ? electiveGroups.filter((grade) => grade.grade_name === whichGradeToDisplay)
    : electiveGroups;

  const openSubjectPickerToggleDrawer = (standardId, standardName) => {
    setIsPickElectiveSubDrawerOpen({
      standardId: standardId,
      standardName: standardName,
    });
  };
  const checkedConflicts = useElectiveGroupsConflictChecker(electiveGroups);
  useEffect(() => {
    setConflicts(checkedConflicts);
  }, [checkedConflicts, setConflicts]);
  return (
    <DndProvider backend={HTML5Backend}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.6, -0.05, 0.01, 0.99],
        }}
        className="relative flex flex-col w-full h-[calc(100vh-5rem)] 3xl:h-[calc(60rem-5rem)] max-h-[calc(100vh-5rem)] 3xl:max-h-[calc(60rem-5rem)] pl-8 pr-4"
      >
        {/* header and control section */}
        <div className="flex-none">
          {/* header */}
          <div className="flex flex-row justify-between items-center mb-4">
            <h2 className="text-3xl font-Inter font-semibold">
              Elective Groups in School{" "}
            </h2>

            <div className="bg-white rounded-3xl p-2 px-4 shadow-custom-8 pl">
              <StyledAvatarGroup max={4}>
                {electiveGroups.map((grade) => (
                  <Avatar
                    sx={{
                      bgcolor: getCharLightColor(grade?.grade_name || "c"),
                      color: "text.primary",
                      width: 30,
                      height: 30,
                      fontSize: ".5rem",
                      fontWeight: "bold",
                    }}
                  >
                    {grade?.grade_short_name}
                  </Avatar>
                ))}
              </StyledAvatarGroup>
            </div>
          </div>

          {/* controle */}
          <div className="relative flex flex-row justify-between gap-10 pr-6">
            <div className="p-1 bg-white rounded-2xl basis-2/5 h-fit shadow-custom-8">
              <SearchInput value={searchQuery} onChange={handleSearchChange} />{" "}
            </div>

            <div className="p-1 bg-white rounded-2xl basis-2/5 h-fit shadow-custom-8">
              <CustomSelect
                value={whichGradeToDisplay}
                onChange={handleGradeChange}
                options={options}
              />{" "}
            </div>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-2xl hover:bg-blue-700"
              onClick={onsubmitElectivegroups}
            >
              {"Update Groups"}
            </button>
            <div className="p-1 bg-white rounded-2xl shadow-custom-8">
              <GradeSortMenu setSortType={setSortMethod} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-row flex-1 h-full">
          <div className="flex-1 overflow-y-auto pb-24">
            {filteredGrades?.map((grade) => {
              const filteredAndSortedStandards = [...grade.standards]
                .filter(
                  (standard) =>
                    searchQuery === "" ||
                    standard.standard_short_name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .sort((a, b) => {
                  switch (sortMethod) {
                    case "Grade Name A-Z":
                      return a.standard_short_name.localeCompare(
                        b.standard_short_name
                      );
                    case "Grade Name Z-A":
                      return b.standard_short_name.localeCompare(
                        a.standard_short_name
                      );
                    case "Divisions High to Low":
                      return (
                        b.electives_groups.length - a.electives_groups.length
                      );
                    case "Divisions Low to High":
                      return (
                        a.electives_groups.length - b.electives_groups.length
                      );
                    default:
                      return 0;
                  }
                });
              return (
                <div className="w-full min-h-44 my-2 flex items-center justify-start flex-col border-b-2 border-slate-300 py-6">
                  <p className="text-sm font-medium text-slate-50 font-Inter my-2 p-2 rounded-xl bg-light-primary bg-opacity-75 flex items-center sticky top-0 z-10">
                    <HiOutlineRectangleGroup className="mr-2" />{" "}
                    {grade.grade_name}
                  </p>

                  {filteredAndSortedStandards.length == 0 ? (
                    <EmptyElectiveGroupState grade={grade.grade_name} />
                  ) : (
                    <div className="flex flex-col w-full max-w-full">
                      {filteredAndSortedStandards.map((standard) => {
                        return (
                          <div className="flex flex-row justify-start my-3 gap-5 items-center flex-wrap border-b last:border-none pb-4">
                            <div className="">
                              <ElectiveGroupManagerClassCard
                                handleOpenCreateNewDialog={
                                  handleOpenCreateNewDialog
                                }
                                grade={grade}
                                standard={standard}
                              />
                            </div>
                            {standard?.electives_groups?.map(
                              (electiveGroup, index) => (
                                <ElectiveGroupCard
                                  groupErrors={
                                    conflicts[electiveGroup?.group_id]
                                  }
                                  moveElectiveSubject={moveElectiveSubject}
                                  toggleDrawer={openSubjectPickerToggleDrawer}
                                  electiveGroup={electiveGroup}
                                  standardId={standard?.standard_id}
                                  standardName={standard?.standard_name}
                                  handleOpenDelateDialog={
                                    handleOpenDelateDialog
                                  }
                                  removeElectiveSubjectFromGroup={
                                    removeElectiveSubjectFromGroup
                                  }
                                  handleOpenCreateNewDialog={handleOpenCreateNewDialog}
                                />
                              )
                            )}
                            <div className="flex flex-col h-full bg-white shadow-custom-8 backdrop-filter backdrop-blur-[20%] bg-opacity-30 rounded-lg p-5">
                              <Tooltip title="Add">
                                <IconButton
                                  onClick={() =>
                                    handleOpenCreateNewDialog(
                                      standard.standard_id
                                    )
                                  }
                                  sx={{
                                    backgroundColor: (theme) =>
                                      theme.palette.primary.main, // Use primary color
                                    "&:hover": {
                                      backgroundColor: (theme) =>
                                        theme.palette.primary.dark, // Darker shade on hover
                                    },
                                    color: "white", // Icon color
                                    padding: 1.5, // Adjust padding for better spacing
                                    borderRadius: "50%", // Round icon button
                                  }}
                                >
                                  <RiAddFill size={24} />{" "}
                                  {/* Adjust icon size */}
                                </IconButton>
                              </Tooltip>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div>
            <PickElectiveSubjectRightSideDrawer
              onClose={() =>
                setIsPickElectiveSubDrawerOpen({
                  standardId: null,
                })
              }
              isPickElectiveSubDrawerOpen={isPickElectiveSubDrawerOpen}
              electiveSubjects={electiveSubjects}
              setElectiveSubjects={setElectiveSubjects}
            />
          </div>
        </div>
      </motion.div>
      <ElectiveGroupCreationDialog
        open={currentStandardIdForNewGroup.isOpen}
        onClose={handleCloseCreateNewDialog}
        setElectiveGroups={setElectiveGroups}
        currentStandardIdForNewGroup={currentStandardIdForNewGroup}
      />
      <DeleteConfirmationPopup
        isOpen={isDeleteElectiveSubjectForm}
        onClose={() => setIsDeleteElectiveSubjectForm(null)}
        onConfirm={handleConfirmElectiveGroupDelete}
      />
    </DndProvider>
  );
};

export default ElectiveGroupManager;
