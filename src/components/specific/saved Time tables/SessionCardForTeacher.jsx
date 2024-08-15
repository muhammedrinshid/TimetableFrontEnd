import React from 'react';
import { SubjectOutlined, RoomOutlined, GroupOutlined, School } from '@mui/icons-material';

const SessionCardForTeacher = ({ session }) => {
  const isElective = session.type === 'Elective';

  return (
    <div className={`session-card ${isElective ? 'elective' : 'core'}`}>
      <h2 className="subject">
        <SubjectOutlined className="icon" />
        {session.subject || session.elective_subject_name}
      </h2>
      <p className="room">
        <RoomOutlined className="icon" /> {session.room}
      </p>
      <p className={`session-type ${session.type.toLowerCase()}`}>{session.type}</p>
      <div className="class-details">
        {session.class_details.map((classDetail, index) => (
          <div key={index} className="class-info">
            <School className="icon" />
            <span className="class-name">
              {classDetail.standard} {classDetail.division}
            </span>
            {isElective && (
              <span className="student-count">
                <GroupOutlined className="icon-small" />
                {classDetail.number_of_students}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionCardForTeacher;