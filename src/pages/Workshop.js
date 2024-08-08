// import React, { useState, useEffect } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Checkbox, Avatar, FormControlLabel, Chip } from '@mui/material';
// import { useAuth } from '../../context/Authcontext';

// const UpdateSubjectForm = ({ open, onClose, subject, onUpdate }) => {
//   const { apiDomain, headers } = useAuth();
//   const [formData, setFormData] = useState(null);
//   const [availableSubjectAndTeachers, setAvailableSubjectAndTeachers] = useState([]);

//   useEffect(() => {
//     if (open && subject) {
//       setFormData({
//         name: subject.name,
//         lessons_per_week: subject.lessons_per_week,
//         is_elective: subject.is_elective,
//         teacher: subject.teacher,
//         options: subject.options || [],
//       });
//       fetchAvailableSubjectAndTeachers();
//     } else {
//       setFormData(null);
//       setAvailableSubjectAndTeachers([]);
//     }
//   }, [open, subject]);

//   const fetchAvailableSubjectAndTeachers = async () => {
//     if (subject && subject.id) {
//       try {
//         const response = await fetch(`${apiDomain}/api/class-room/subjects-with-teachers/${subject.gradeId}`, { headers });
//         const data = await response.json();
//         setAvailableSubjectAndTeachers(data);
//       } catch (error) {
//         console.error("Error fetching available teachers:", error);
//       }
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleTeacherToggle = (teacherId) => {
//     setFormData(prev => ({
//       ...prev,
//       teacher: prev.teacher.some(t => t.id === teacherId)
//         ? prev.teacher.filter(t => t.id !== teacherId)
//         : [...prev.teacher, availableSubjectAndTeachers.find(item => item.id === subject.subjectId)?.qualified_teachers.find(t => t.id === teacherId)]
//     }));
//   };

//   const handleOptionChange = (index, field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       options: prev.options.map((option, i) => 
//         i === index ? { ...option, [field]: value } : option
//       )
//     }));
//   };

//   const handleSubmit = () => {
//     if (formData) {
//       onUpdate(formData);
//     }
//     onClose();
//   };

//   if (!open || !formData) {
//     return null;
//   }

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>{formData.is_elective ? "Update Elective Subject" : "Update Core Subject"}</DialogTitle>
//       <DialogContent>
//         <TextField
//           margin="dense"
//           label="Subject Name"
//           fullWidth
//           name="name"
//           value={formData.name}
//           onChange={handleInputChange}
//           disabled={!formData.is_elective}
//         />
//         <TextField
//           margin="dense"
//           label="Lessons per Week"
//           type="number"
//           fullWidth
//           name="lessons_per_week"
//           value={formData.lessons_per_week}
//           onChange={handleInputChange}
//         />
        
//         {!formData.is_elective && (
//           <div>
//             <h4>Assigned Teachers</h4>
//             {(availableSubjectAndTeachers.find(item => item.id === subject.subjectId)?.qualified_teachers || []).map((teacher) => (
//             <Chip
//               key={teacher.id}
//               avatar={
//                 <Avatar
//                   alt={teacher.full_name}
//                   src={teacher.profile_image && `${apiDomain}${teacher.profile_image}`}
//                 />
//               }
//               label={teacher.full_name}
//               onClick={() => handleTeacherToggle(teacher.id)}
//               color={formData.teacher.some(t => t.id === teacher.id) ? "primary" : "default"}
//               sx={{ m: 0.5 }}
//             />
//           ))}
//           </div>
//         )}

//         {formData.is_elective && (
//           <div>
//             <h4>Options</h4>
//             {formData.options.map((option, index) => (
//               <div key={index}>
//                 <TextField
//                   margin="dense"
//                   label="Subject"
//                   value={option.subject.name}
//                   onChange={(e) => handleOptionChange(index, 'subject', { ...option.subject, name: e.target.value })}
//                 />
//                 <TextField
//                   margin="dense"
//                   label="Number of Students"
//                   type="number"
//                   value={option.number_of_students}
//                   onChange={(e) => handleOptionChange(index, 'number_of_students', e.target.value)}
//                 />
//                 <div>
//                   <h5>Assigned Teachers</h5>
//                   {availableSubjectAndTeachers.map(teacher => (
//                     <FormControlLabel
//                       key={teacher.id}
//                       control={
//                         <Checkbox
//                           checked={option.alotted_teachers.some(t => t.id === teacher.id)}
//                           onChange={() => {
//                             const updatedTeachers = option.alotted_teachers.some(t => t.id === teacher.id)
//                               ? option.alotted_teachers.filter(t => t.id !== teacher.id)
//                               : [...option.alotted_teachers, teacher];
//                             handleOptionChange(index, 'alotted_teachers', updatedTeachers);
//                           }}
//                         />
//                       }
//                       label={
//                         <div style={{ display: 'flex', alignItems: 'center' }}>
//                           <Avatar src={`${apiDomain}${teacher.profile_image}`} style={{ marginRight: 8 }} />
//                           {teacher.full_name}
//                         </div>
//                       }
//                     />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Cancel</Button>
//         <Button onClick={handleSubmit} color="primary">Update</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default UpdateSubjectForm;