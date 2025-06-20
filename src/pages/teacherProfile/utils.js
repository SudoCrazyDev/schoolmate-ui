import PropTypes from 'prop-types';

export const updatePersonalInfoAPI = (values) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (values.firstName && values.firstName.toLowerCase() === 'error') {
        reject({ message: 'Failed to update personal info.' });
      } else {
        console.log('Mock API: Updating personal info with:', values);
        resolve({ message: 'Personal info updated successfully!', data: values });
      }
    }, 1500);
  });
};

export const updateEducationInfoAPI = (entries) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!entries || entries.length === 0) {
        reject({ message: 'No education entries submitted.' });
      } else {
        console.log('Mock API: Updating education info with:', entries);
        resolve({ message: 'Education information updated successfully!', data: entries });
      }
    }, 1500);
  });
};

export const sampleTrainingsData = [
  { id: 'train1', title: 'Advanced JavaScript Techniques', organizer: 'Tech Institute', dateCompleted: '2023-05-15', hours: 40, type: 'Workshop' },
  { id: 'train2', title: 'React Best Practices', organizer: 'DevCon Community', dateCompleted: '2022-11-20', hours: 24, type: 'Seminar' },
  { id: 'train3', title: 'Introduction to Docker and Kubernetes', organizer: 'Online Courses Hub', dateCompleted: '2023-09-01', hours: 16, type: 'Online Course' },
];

export const updateAwardsInfoAPI = (entries) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!entries || entries.length === 0) {
        reject({ message: 'No award entries submitted.' });
      } else {
        console.log('Mock API: Updating awards info with:', entries);
        entries.forEach(entry => {
          if (entry.images && entry.images.length > 0) {
            console.log(`Award "${entry.title}" has ${entry.images.length} image(s). First image name (mock): ${entry.images[0].name}`);
          }
        });
        resolve({ message: 'Awards information updated successfully!', data: entries });
      }
    }, 2000);
  });
};

export const fetchUserProfileAPI = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        personalInfo: {
          firstName: 'Jane',
          middleName: 'M.',
          lastName: 'Doe',
          extName: '',
          gender: 'Female',
          birthDate: '1990-01-15',
          placeOfBirth: 'City, Province',
          civilStatus: 'Married',
          height: '165',
          weight: '60',
          bloodType: 'O+',
          residentialAddressStreet: '123 Main St',
          residentialAddressCity: 'Anytown',
          residentialAddressProvince: 'State',
          residentialAddressZipCode: '12345',
          permanentAddressStreet: '123 Main St',
          permanentAddressCity: 'Anytown',
          permanentAddressProvince: 'State',
          permanentAddressZipCode: '12345',
          gsis: 'GSIS123',
          pagibig: 'PGBG123',
          philhealth: 'PHLTH123',
          sss: 'SSS123',
          tin: 'TIN123',
          employeeId: 'EMP123',
        },
        educationEntries: [
          { id: 'edu1', level: 'Bachelor of Science', school: 'State University', degree: 'Computer Science', yearGraduated: '2010', awards: "Dean's List" },
          { id: 'edu2', level: 'Master of Science', school: 'Tech Institute', degree: 'Software Engineering', yearGraduated: '2012', awards: 'With Honors' }
        ],
        // Updated to use 'trainingEntries' and new structure
        trainingEntries: [
          { id: 'userTrain1', title: 'Effective Communication Skills', organizer: 'Internal HR', dateCompleted: '2024-01-20', hours: 8, type: 'Seminar', description: 'Workshop on improving workplace communication.', certificateImage: null },
          { id: 'userTrain2', title: 'Data Privacy and Ethics Training', organizer: 'Compliance Dept', dateCompleted: '2023-11-05', hours: 4, type: 'Mandatory Training', description: 'Annual data privacy refresher.', certificateImage: 'privacy_cert_2023.png' },
        ],
        awards: [
          { id: 'award1', title: 'Teacher of the Year', description: 'Awarded for excellence in teaching at District Level.', date: '2022-05-01', images: [] /* existing images would be URLs/names */ },
          { id: 'award2', title: 'Innovation in Education Grant', description: 'Received grant for developing a new learning platform.', date: '2021-09-15', images: [] }
        ]
      });
    }, 1000);
  });
};


// Shared PropTypes Shapes

export const personalInfoShape = PropTypes.shape({
  firstName: PropTypes.string, // .isRequired if always expected
  middleName: PropTypes.string, // All personalInfo fields can be .isRequired depending on data guarantees
  lastName: PropTypes.string,
  extName: PropTypes.string,
  gender: PropTypes.string,
  birthDate: PropTypes.string, // Expecting YYYY-MM-DD
  placeOfBirth: PropTypes.string,
  civilStatus: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bloodType: PropTypes.string,
  residentialAddressStreet: PropTypes.string,
  residentialAddressCity: PropTypes.string,
  residentialAddressProvince: PropTypes.string,
  residentialAddressZipCode: PropTypes.string,
  permanentAddressStreet: PropTypes.string,
  permanentAddressCity: PropTypes.string,
  permanentAddressProvince: PropTypes.string,
  permanentAddressZipCode: PropTypes.string,
  gsis: PropTypes.string,
  pagibig: PropTypes.string,
  philhealth: PropTypes.string,
  sss: PropTypes.string,
  tin: PropTypes.string,
  employeeId: PropTypes.string,
});

export const educationEntryShape = PropTypes.shape({
  id: PropTypes.string.isRequired, // Updated id type
  level: PropTypes.string.isRequired,
  school: PropTypes.string.isRequired,
  degree: PropTypes.string.isRequired,
  yearGraduated: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  awards: PropTypes.string, // Optional
});

// New/Updated Training Entry Shape
export const trainingEntryShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  organizer: PropTypes.string.isRequired,
  dateCompleted: PropTypes.string.isRequired, // Assuming date is handled as string for form input
  hours: PropTypes.number, // Optional field
  type: PropTypes.string,  // Optional field
  description: PropTypes.string, // Optional field
  certificateImage: PropTypes.oneOfType([ // For File object during upload or string (URL/name) if displaying existing
    PropTypes.object,
    PropTypes.string
  ]),
});

export const awardEntryFileShape = PropTypes.shape({
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    // lastModified: PropTypes.number.isRequired, // Available on File objects
});

export const awardEntryShape = PropTypes.shape({
  id: PropTypes.string.isRequired, // Updated id type
  title: PropTypes.string.isRequired,
  description: PropTypes.string, // Optional
  date: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(awardEntryFileShape),
});

export const userProfileShape = PropTypes.shape({
    personalInfo: personalInfoShape,
    educationEntries: PropTypes.arrayOf(educationEntryShape),
    trainingEntries: PropTypes.arrayOf(trainingEntryShape), // Updated key and shape
    awards: PropTypes.arrayOf(awardEntryShape),
});

// New sample data for training entries reflecting the new shape
export const sampleTrainingEntriesData = [
  { id: 'sampleTrain1', title: 'Advanced React Patterns', organizer: 'Tech Summit', dateCompleted: '2023-10-15', hours: 16, type: 'Workshop', description: 'Deep dive into React hooks and performance.', certificateImage: null },
  { id: 'sampleTrain2', title: 'Project Management Fundamentals', organizer: 'Coursera', dateCompleted: '2022-05-20', hours: 40, type: 'Online Course', description: 'Basics of project planning and execution.', certificateImage: 'project_management_cert.pdf' },
];

export const updateTrainingsAPI = (trainingEntries) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Mock API: Received training entries for update:', trainingEntries);

      if (!trainingEntries) {
        return reject({ message: 'No training entries data received.' });
      }

      trainingEntries.forEach(entry => {
        if (entry.certificateImage && typeof entry.certificateImage === 'object') {
          console.log(`Mock API: Training "${entry.title}" has a certificate image "${entry.certificateImage.name}" to upload.`);
        } else if (entry.certificateImage && typeof entry.certificateImage === 'string') {
          console.log(`Mock API: Training "${entry.title}" has existing certificate image "${entry.certificateImage}".`);
        }
      });

      resolve({
        message: 'Training information updated successfully!',
        data: trainingEntries.map(entry => ({
          ...entry,
          certificateImageUrl: entry.certificateImage && typeof entry.certificateImage === 'object'
            ? `mockApi/uploads/${entry.certificateImage.name}`
            : entry.certificateImage,
        }))
      });
    }, 1500);
  });
};
