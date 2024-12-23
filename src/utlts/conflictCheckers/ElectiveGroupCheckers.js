


  export function validateElectiveGroups(data) {
    // Store all validation errors
    const errors = {};
  
    // Iterate through each grade
    data.forEach(grade => {
      // Iterate through each standard in the grade
      grade.standards.forEach(standard => {
        // Iterate through each elective group
        standard.electives_groups.forEach(group => {
          const groupKey = group?.group_id;
          errors[groupKey] = [];
  
          // Check for lessons per week consistency
          const lessonsPerWeekSet = new Set(
            group.elective_subjects.map(subject => subject.lessons_per_week)
          );
          
          if (lessonsPerWeekSet.size > 1) {
            errors[groupKey].push({
              type: "Inconsistent Lessons",
              details: `Found different lessons per week: ${Array.from(lessonsPerWeekSet).join(', ')}`,
         
            });
          }
  
          // Check for duplicate classrooms
          const classroomMap = new Map();
          
          group.elective_subjects.forEach(subject => {
            if (classroomMap.has(subject.classroom_id)) {
              // Found a duplicate classroom
              const existing = classroomMap.get(subject.classroom_id);
              errors[groupKey].push({
                type: "Concurrent Classrooms",
                classroom_name: subject.classroom_name,
                elective_subject_names: [
                  {
                    name: existing.elective_subject_name,
                    classroom: existing.classroom_name
                  },
                  {
                    name: subject.elective_subject_name,
                    classroom: subject.classroom_name
                  }
                ]
              });
            } else {
              classroomMap.set(subject.classroom_id, subject);
            }
          });
        });
      });
    });
  
    return errors;
  }
  
  // Example usage:
  
