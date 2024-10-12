import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Switch, Tooltip, CircularProgress } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { toast } from 'react-toastify'; 
import { useAuth } from '../../context/Authcontext';
import { motion } from "framer-motion";

const DirectivesConfiguration = () => {
  const [directives, setDirectives] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { apiDomain, headers, logoutUser } = useAuth();
  const directiveDescriptions = {
    tutor_free_period_constraint:"Ensures atleast one free period in a day",
    elective_group_timeslot:
      "Ensures that elective subjects are scheduled at the same time for all groups.",
    ensure_teacher_assigned:
      "Guarantees that every lesson has an assigned teacher.",
    ensure_timeslot_assigned: "Ensures all lessons are allocated a time slot.",
    consecutive_multi_block_lessons:
      "Ensures multi-block lessons are scheduled in consecutive periods on the same day.",
    tutor_lesson_load:
      "Ensures tutors have a balanced workload, with assigned lessons falling within the specified minimum and maximum limits per week.",
    daily_lesson_limit:
      "Prevents exceeding the maximum number of lessons per day, calculated as the maximum lessons per week divided by the number of working days.",
    prefer_consistent_teacher_for_subject:
      "Aims to assign the same teacher for a subject throughout the term.",
    prefer_subject_once_per_day:
      "Tries to schedule a subject only once per day.",
    avoid_teacher_consecutive_periods_overlapping_class:
      "Prevents back-to-back lessons for teachers.",
    avoid_continuous_subjects:
      "Prevents the same subject from being taught in consecutive periods.",
    avoid_continuous_teaching:
      "Ensures breaks between teaching periods for teachers.",
    avoid_consecutive_elective_lessons:
      "Prevents elective subjects from being scheduled back-to-back.",
  };
  

  useEffect(() => {
    fetchDirectives();
  }, []);

  const fetchDirectives = async () => {
    try {
      const response = await axios.get(`${apiDomain}/api/user/user-constraints/`, { headers });
      setDirectives(response.data);
      setIsLoading(false);
    } catch (err) {
      handleError(err);
    }
  };

  const updateDirective = async (key, value) => {
    try {
      await axios.put(`${apiDomain}/api/user/user-constraints/`, { [key]: value }, { headers });
      setDirectives(prev => ({ ...prev, [key]: value }));
      toast.success("Directive updated successfully");
    } catch (err) {
      handleError(err);
    }
  };

  const handleError = (err) => {
    if (err.response) {
      console.error("Response error:", err.response.status, err.response.data);
      if (err.response.status === 401) {
        toast.error("Error occurred: Unauthorized access");
        logoutUser();
      } else {
        toast.error(`Error occurred: ${err.response.data?.message || "Unexpected error"}`);
      }
    } else if (err.request) {
      console.error("No response received:", err.request);
      toast.error("Error occurred: No response from server");
    } else {
      console.error("Error", err.message);
      toast.error(`Error occurred: ${err.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  }

  const DirectiveItem = ({ name, description, value, onChange, disabled }) => (
    <div className="flex items-center justify-between p-4 bg-slate-200 dark:bg-dark-secondary rounded-lg shadow-custom-2 hover:shadow-custom-3 transition-shadow duration-300">
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-dark-primary dark:text-light-primary">
          {name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </span>
        <Tooltip title={description || "No description available"} arrow>
          <InfoIcon fontSize="small" className="text-light-accent dark:text-dark-accent cursor-help" />
        </Tooltip>
      </div>
      <Switch
        checked={value}
        onChange={onChange}
        color="primary"
        className="ml-2"
        disabled={disabled}
      />
    </div>
  );

  return (
      <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      }} className="container mx-auto px-4 py-8 dark:bg-dark-background text-dark-primary dark:text-light-primary overflow-y-scroll">
      <h1 className="text-3xl font-bold mb-6 text-center text-dark-primary dark:text-light-primary">
        Directives Configuration
      </h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-dark-accent dark:text-light-accent">
          Mandatory Directives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DirectiveItem
            name="Room Conflict"
            description="Prevents scheduling multiple classes in the same room at the same time"
            value={true}
            onChange={() => {}}
            disabled={true}
          />
          <DirectiveItem
            name="Teacher Conflict"
            description="Prevents scheduling a teacher for multiple classes at the same time"
            value={true}
            onChange={() => {}}
            disabled={true}
          />
          <DirectiveItem
            name="Student Group Conflict"
            description="Prevents scheduling a student group for multiple classes at the same time"
            value={true}
            onChange={() => {}}
            disabled={true}
          />
          <DirectiveItem
            name="elective_group_timeslot"
            description={directiveDescriptions.elective_group_timeslot}
            value={directives.elective_group_timeslot}
            onChange={() =>
              updateDirective(
                "elective_group_timeslot",
                !directives.elective_group_timeslot
              )
            }
            disabled={false}
          />
          <DirectiveItem
            name="ensure_teacher_assigned"
            description={directiveDescriptions.ensure_teacher_assigned}
            value={directives.ensure_teacher_assigned}
            onChange={() =>
              updateDirective(
                "ensure_teacher_assigned",
                !directives.ensure_teacher_assigned
              )
            }
            disabled={false}
          />
          <DirectiveItem
            name="ensure_timeslot_assigned"
            description={directiveDescriptions.ensure_timeslot_assigned}
            value={directives.ensure_timeslot_assigned}
            onChange={() =>
              updateDirective(
                "ensure_timeslot_assigned",
                !directives.ensure_timeslot_assigned
              )
            }
            disabled={false}
          />
          <DirectiveItem
            name="consecutive_multi_block_lessons"
            description={directiveDescriptions.consecutive_multi_block_lessons}
            value={directives.consecutive_multi_block_lessons}
            onChange={() =>
              updateDirective(
                "consecutive_multi_block_lessons",
                !directives.consecutive_multi_block_lessons
              )
            }
            disabled={false}
          />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-dark-accent dark:text-light-accent">
          Optional Directives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DirectiveItem
            name="tutor_free_period_constraint"
            description={directiveDescriptions.tutor_free_period_constraint}
            value={directives.tutor_free_period_constraint}
            onChange={() =>
              updateDirective(
                "tutor_free_period_constraint",
                !directives.tutor_free_period_constraint
              )
            }
            disabled={false}
          />
          <DirectiveItem
            name="tutor_lesson_load"
            description={directiveDescriptions.tutor_lesson_load}
            value={directives.tutor_lesson_load}
            onChange={() =>
              updateDirective(
                "tutor_lesson_load",
                !directives.tutor_lesson_load
              )
            }
            disabled={false}
          />
          <DirectiveItem
            name="daily_lesson_limit"
            description={directiveDescriptions.daily_lesson_limit}
            value={directives.daily_lesson_limit}
            onChange={() =>
              updateDirective(
                "daily_lesson_limit",
                !directives.daily_lesson_limit
              )
            }
            disabled={false}
          />
          <DirectiveItem
            name="prefer_consistent_teacher_for_subject"
            description={
              directiveDescriptions.prefer_consistent_teacher_for_subject
            }
            value={directives.prefer_consistent_teacher_for_subject}
            onChange={() =>
              updateDirective(
                "prefer_consistent_teacher_for_subject",
                !directives.prefer_consistent_teacher_for_subject
              )
            }
            disabled={false}
          />
          <DirectiveItem
            name="prefer_subject_once_per_day"
            description={directiveDescriptions.prefer_subject_once_per_day}
            value={directives.prefer_subject_once_per_day}
            onChange={() =>
              updateDirective(
                "prefer_subject_once_per_day",
                !directives.prefer_subject_once_per_day
              )
            }
            disabled={false}
          />
          <DirectiveItem
            name="avoid_teacher_consecutive_periods_overlapping_class"
            description={
              directiveDescriptions.avoid_teacher_consecutive_periods_overlapping_class
            }
            value={
              directives.avoid_teacher_consecutive_periods_overlapping_class
            }
            onChange={() =>
              updateDirective(
                "avoid_teacher_consecutive_periods_overlapping_class",
                !directives.avoid_teacher_consecutive_periods_overlapping_class
              )
            }
            disabled={false}
          />
          <DirectiveItem
            name="avoid_continuous_subjects"
            description={directiveDescriptions.avoid_continuous_subjects}
            value={directives.avoid_continuous_subjects}
            onChange={() =>
              updateDirective(
                "avoid_continuous_subjects",
                !directives.avoid_continuous_subjects
              )
            }
            disabled={false}
          />
          <DirectiveItem
            name="avoid_continuous_teaching"
            description={directiveDescriptions.avoid_continuous_teaching}
            value={directives.avoid_continuous_teaching}
            onChange={() =>
              updateDirective(
                "avoid_continuous_teaching",
                !directives.avoid_continuous_teaching
              )
            }
            disabled={false}
          />
          <DirectiveItem
            name="avoid_consecutive_elective_lessons"
            description={
              directiveDescriptions.avoid_consecutive_elective_lessons
            }
            value={directives.avoid_consecutive_elective_lessons}
            onChange={() =>
              updateDirective(
                "avoid_consecutive_elective_lessons",
                !directives.avoid_consecutive_elective_lessons
              )
            }
            disabled={false}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DirectivesConfiguration;