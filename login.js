// Courses and subjects data
const courses = {
    BCA: [
        { id: '101', name: "Python" },
        { id: '102', name: "Data Structures" },
        { id: '103', name: "Java" }
    ],
    BCOM: [
        { id: '201', name: "Financial Accounting" },
        { id: '202', name: "Business Law" },
        { id: '203', name: "Marketing Management" }
    ],
    BBA: [
        { id: '301', name: "Organizational Behavior" },
        { id: '302', name: "Principles of Management" },
        { id: '303', name: "Business Strategy" }
    ],
    BSC: [
        { id: '401', name: "Physics" },
        { id: '402', name: "Chemistry" },
        { id: '403', name: "Electronics" }
    ],
    BTCCA: [
        { id: '501', name: "Networking" },
        { id: '502', name: "Software Engineering" },
        { id: '503', name: "Computer Architecture" }
    ],
    MPCS: [
        { id: '601', name: "Mathematics" },
        { id: '602', name: "Physics" },
        { id: '603', name: "Computer Science" }
    ],
    BTMBC: [
        { id: '701', name: "Microbiology" },
        { id: '702', name: "Biotechnology" },
        { id: '703', name: "Cell Biology" }
    ],
    MSTCS: [
        { id: '801', name: "Advanced Algorithms" },
        { id: '802', name: "Machine Learning" },
        { id: '803', name: "Cloud Computing" }
    ]
};


// Get references to elements
var adminLoginForm = document.getElementById('adminLoginForm');
var attendanceLoginForm = document.getElementById('attendanceLoginForm');
var adminDashboard = document.getElementById('adminDashboard');

// Toggle between Admin and Attendance Login
document.getElementById("adminLoginLink").addEventListener("click", function () {
    attendanceLoginForm.style.display = "none";
    adminLoginForm.style.display = "block";
});

document.getElementById("attendanceLoginLink").addEventListener("click", function () {
    adminLoginForm.style.display = "none";
    attendanceLoginForm.style.display = "block";
});

// Admin Login Form submission
document.getElementById("adminLogin").addEventListener("submit", function (event) {
    event.preventDefault();

    const adminUsername = document.getElementById("admin-username").value;
    const adminPassword = document.getElementById("admin-password").value;

    if (adminUsername === "admin" && adminPassword === "password@123") {
        adminLoginForm.style.display = "none";
        adminDashboard.style.display = "block";
    } else {
        alert("Invalid credentials.");
    }
});


// Show Student Details Button Click Event
document.getElementById("showStudentDetailsBtn").addEventListener("click", function () {
    document.getElementById("adminDashboard").style.display = "none";
    document.getElementById("studentDetails").style.display = "block";

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            let tableBody = document.getElementById("studentTableBody");
            tableBody.innerHTML = '';

            data.forEach(student => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${student.admnNo}</td>
                    <td>${student.name.toUpperCase()}</td>
                    <td>${student.course.toUpperCase()}</td>
                    <td>${student.email}</td>
                    <td>${student.phone}</td>
                    <td>${student.dob}</td>
                    <td>${student.semester}</td>
                    <td>${student.year}</td>
                    <td>${student.fathersName.toUpperCase()}</td>
                    <td>${student.fathersNumber}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error fetching student data:', error));
});


const monthDays = {
    1: 31, 2: 28, 3: 31, 4: 30, 5: 31, 6: 30, 7: 31, 8: 31, 9: 30, 
    10: 31, 11: 30, 12: 31
};

const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');
const subject1Classes = document.getElementById('subject1Classes');
const subject2Classes = document.getElementById('subject2Classes');
const subject3Classes = document.getElementById('subject3Classes');


// Function to generate input fields dynamically for each subject day
function generateInputFields(subjectClasses, subjectId, presentId, absentId, totalClassesId, days, savedData = []) {
    subjectClasses.innerHTML = ''; // Clear existing input fields

    const admissionNumber = document.getElementById('admissionNoDisplay').value;
    const course = document.getElementById('courseSelect').value;
    const month = monthSelect.value.padStart(2, '0'); // Get the month (e.g., 09)
    const year = yearSelect.value; // Get the selected year

    // Retrieve saved attendance records from localStorage
    let savedAttendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

    // Find the existing attendance record for the current student, course, month, and year
    let existingRecord = savedAttendanceRecords.find(record =>
        record.admissionNumber === admissionNumber &&
        record.course === course &&
        record.month === month &&
        record.year === year
    );

    // If no existing record, create an empty one for this subject
    if (!existingRecord) {
        existingRecord = {
            admissionNumber,
            course,
            month,
            year,
            subjects: [{}, {}, {}] // Empty subjects array (adjust based on number of subjects)
        };
        savedAttendanceRecords.push(existingRecord);
    }

    const subjectIndex = subjectId === 'subject1Classes' ? 0 : subjectId === 'subject2Classes' ? 1 : 2;

    let totalPresent = 0;
    let totalAbsent = 0;
    let totalClasses = days;

    // Initialize counts based on saved data
    for (let i = 1; i <= days; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.id = `${subjectId}-day-${i}`
        ;
        input.style.width = '15px';
        input.style.padding = '5px';
        input.placeholder = i;
        input.maxLength = 1; // Limit input to a single character
        input.setAttribute('data-day', i);

        subjectClasses.appendChild(input);

        // Pre-populate field if saved data exists for this day
        if (savedData[i - 1] && savedData[i - 1].status) {
            input.value = savedData[i - 1].status;

            if (savedData[i - 1].status === 'P') {
                totalPresent++;
            } else if (savedData[i - 1].status === 'A') {
                totalAbsent++;
            } else if (savedData[i - 1].status === 'N') {
                totalClasses--;
            }
        }

        // Add an event listener to update totals and save changes when the user types
        input.addEventListener('input', function () {
            const inputValue = this.value.trim().toUpperCase();
            const dayIndex = this.getAttribute('data-day') - 1; // Get the day index
            const previousValue = savedData[dayIndex] ? savedData[dayIndex].status : '';

            // Handle clearing of the input field first (i.e., when the user removes a 'P', 'A', or 'N')
            if (inputValue === '') {
                if (previousValue === 'P') {
                    totalPresent--; // Decrement present count if user removes 'P'
                } else if (previousValue === 'A') {
                    totalAbsent--; // Decrement absent count if user removes 'A'
                } else if (previousValue === 'N') {
                    totalClasses++; // Increment total classes if user removes 'N'
                }

                // Update totals in the UI
                document.getElementById(presentId).textContent = totalPresent;
                document.getElementById(absentId).textContent = totalAbsent;
                document.getElementById(totalClassesId).textContent = totalClasses;

                // Clear saved data for the day
                savedData[dayIndex] = { status: '' };
                return; // Exit early to avoid running the rest of the logic
            }

            // Check if the input is valid ('P', 'A', 'N')
            if (inputValue !== 'P' && inputValue !== 'A' && inputValue !== 'N') {
                this.value = ''; // Clear the input field if it's not valid
                return;
            }

            // Update totals based on the previous value (decrement if necessary)
            if (previousValue === 'P') {
                totalPresent--; // Decrement present count if previous value was 'P'
            } else if (previousValue === 'A') {
                totalAbsent--; // Decrement absent count if previous value was 'A'
            } else if (previousValue === 'N') {
                totalClasses++; // Increment total classes if previous value was 'N'
            }

            // Update totals based on the new input value (increment if necessary)
            if (inputValue === 'P') {
                totalPresent++; // Increment present count if new value is 'P'
            } else if (inputValue === 'A') {
                totalAbsent++; // Increment absent count if new value is 'A'
            } else if (inputValue === 'N') {
                totalClasses--; // Decrease total classes if new value is 'N'
            }

            // Update totals in the UI
            document.getElementById(presentId).textContent = totalPresent;
            document.getElementById(absentId).textContent = totalAbsent;
            document.getElementById(totalClassesId).textContent = totalClasses;

            // Update saved data for this day
            savedData[dayIndex] = { status: inputValue };

            // Save updated attendance records to localStorage
            existingRecord.subjects[subjectIndex].dailyAttendance = savedData;
            localStorage.setItem('attendanceRecords', JSON.stringify(savedAttendanceRecords));
        });
    }

    document.getElementById(presentId).textContent = totalPresent;
    document.getElementById(absentId).textContent = totalAbsent;
    document.getElementById(totalClassesId).textContent = totalClasses;
}




function updateAttendanceFields() {
    const month = parseInt(monthSelect.value);
    let days = monthDays[month];
    const year = parseInt(yearSelect.value);
    if (month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)) {
        days = 29; // Leap year adjustment for February
    }

    const admissionNumber = document.getElementById('admissionNoDisplay').value;
    const course = document.getElementById('courseSelect').value;

    // Retrieve saved attendance data from localStorage
    const savedAttendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const existingRecord = savedAttendanceRecords.find(record =>
        record.admissionNumber === admissionNumber &&
        record.course === course &&
        record.month === month.toString().padStart(2, '0') &&
        record.year === year.toString()
    );

    if (existingRecord) {
        const subjects = existingRecord.subjects || [{}, {}, {}]; // Default subjects if no data exists

        // Apply totals for each subject
        if (subjects[0].totals) {
            document.getElementById('subject1TotalPresent').textContent = subjects[0].totals.totalPresent || 0;
            document.getElementById('subject1TotalAbsent').textContent = subjects[0].totals.totalAbsent || 0;
            document.getElementById('subject1TotalClasses').textContent = subjects[0].totals.totalClasses || days;
        }
        if (subjects[1].totals) {
            document.getElementById('subject2TotalPresent').textContent = subjects[1].totals.totalPresent || 0;
            document.getElementById('subject2TotalAbsent').textContent = subjects[1].totals.totalAbsent || 0;
            document.getElementById('subject2TotalClasses').textContent = subjects[1].totals.totalClasses || days;
        }
        if (subjects[2].totals) {
            document.getElementById('subject3TotalPresent').textContent = subjects[2].totals.totalPresent || 0;
            document.getElementById('subject3TotalAbsent').textContent = subjects[2].totals.totalAbsent || 0;
            document.getElementById('subject3TotalClasses').textContent = subjects[2].totals.totalClasses || days;
        }


        // Generate input fields for each subject with saved data if available
        generateInputFields(subject1Classes, 'subject1Classes', 'subject1TotalPresent', 'subject1TotalAbsent', 'subject1TotalClasses', days, subjects[0].dailyAttendance || []);
        generateInputFields(subject2Classes, 'subject2Classes', 'subject2TotalPresent', 'subject2TotalAbsent', 'subject2TotalClasses', days, subjects[1].dailyAttendance || []);
        generateInputFields(subject3Classes, 'subject3Classes', 'subject3TotalPresent', 'subject3TotalAbsent', 'subject3TotalClasses', days, subjects[2].dailyAttendance || []);
    } else {
        // Clear the fields if no data exists
        generateInputFields(subject1Classes, 'subject1Classes', 'subject1TotalPresent', 'subject1TotalAbsent', 'subject1TotalClasses', days);
        generateInputFields(subject2Classes, 'subject2Classes', 'subject2TotalPresent', 'subject2TotalAbsent', 'subject2TotalClasses', days);
        generateInputFields(subject3Classes, 'subject3Classes', 'subject3TotalPresent', 'subject3TotalAbsent', 'subject3TotalClasses', days);
    }
}

// Initialize attendance fields when the page loads
document.addEventListener('DOMContentLoaded', function () {
    updateAttendanceFields(); // Populate fields with saved data
});

// Event listeners for changes in the month or year dropdown
monthSelect.addEventListener('change', updateAttendanceFields);
yearSelect.addEventListener('change', updateAttendanceFields);


// Get the number of days in the selected month and year
function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate(); // Get the last day of the month (0th day of next month)
}

// Handle month and year change
document.getElementById("monthSelect").addEventListener("change", function () {
    const selectedMonth = parseInt(this.value);
    const selectedYear = parseInt(document.getElementById("yearSelect").value);
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);


    generateInputFields('subject1Classes', 'subject1TotalPresent', 'subject1TotalAbsent', 'subject1TotalNoClass', daysInMonth);
    generateInputFields('subject2Classes', 'subject2TotalPresent', 'subject2TotalAbsent', 'subject2TotalNoClass', daysInMonth);
    generateInputFields('subject3Classes', 'subject3TotalPresent', 'subject3TotalAbsent', 'subject3TotalNoClass', daysInMonth);
});

document.getElementById("yearSelect").addEventListener("change", function () {
    const selectedMonth = parseInt(document.getElementById("monthSelect").value);
    const selectedYear = parseInt(this.value);
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);


    generateInputFields('subject1Classes', 'subject1TotalPresent', 'subject1TotalAbsent', 'subject1TotalNoClass', daysInMonth);
    generateInputFields('subject2Classes', 'subject2TotalPresent', 'subject2TotalAbsent', 'subject2TotalNoClass', daysInMonth);
    generateInputFields('subject3Classes', 'subject3TotalPresent', 'subject3TotalAbsent', 'subject3TotalNoClass', daysInMonth);
});

// Initialize input fields for the default selected month (January)
const initialMonth = parseInt(document.getElementById("monthSelect").value);
const initialYear = parseInt(document.getElementById("yearSelect").value);
const initialDaysInMonth = getDaysInMonth(initialMonth, initialYear);


// Auto fill attendance data
document.getElementById('admissionNoDisplay').addEventListener('input', function () {
    const admissionNumber = this.value.trim();

    if (!admissionNumber) return; // Skip further processing if admission number is empty

    fetch('data.json') // Fetch student data from json file
        .then(response => response.json())
        .then(data => {
            const student = data.find(student => student.admnNo === admissionNumber);
            const errorMessage = document.getElementById('errorMessage');
            if (student) {
                // Hide the error message if admission number is valid
                errorMessage.style.display = 'none';
                // Set semester and course
                document.getElementById('semesterDisplay').value = student.semester;
                const course = student.course.toUpperCase();
                document.getElementById('courseSelect').value = course;

                // Display subjects for the selected course
                displaySubjectsForCourse(course);

                // Retrieve saved attendance data from localStorage
                const savedAttendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
                const existingRecord = savedAttendanceRecords.find(record =>
                    record.admissionNumber === admissionNumber &&
                    record.course === course &&
                    record.month === monthSelect.value.padStart(2, '0') &&
                    record.year === yearSelect.value
                );

                if (existingRecord) {
                    // Display the saved attendance data
                    const subjects = existingRecord.subjects || [{}, {}, {}]; // Default subjects if no data exists

                    // Apply totals for each subject
                    if (subjects[0].totals) {
                        document.getElementById('subject1TotalPresent').textContent = subjects[0].totals.totalPresent || 0;
                        document.getElementById('subject1TotalAbsent').textContent = subjects[0].totals.totalAbsent || 0;
                        document.getElementById('subject1TotalClasses').textContent = subjects[0].totals.totalClasses || monthDays[monthSelect.value];
                    }
                    if (subjects[1].totals) {
                        document.getElementById('subject2TotalPresent').textContent = subjects [1].totals.totalPresent || 0;
                        document.getElementById('subject2TotalAbsent').textContent = subjects[1].totals.totalAbsent || 0;
                        document.getElementById('subject2TotalClasses').textContent = subjects[1].totals.totalClasses || monthDays[monthSelect.value];
                    }
                    if (subjects[2].totals) {
                        document.getElementById('subject3TotalPresent').textContent = subjects[2].totals.totalPresent || 0;
                        document.getElementById('subject3TotalAbsent').textContent = subjects[2].totals.totalAbsent || 0;
                        document.getElementById('subject3TotalClasses').textContent = subjects[2].totals.totalClasses || monthDays[monthSelect.value];
                    }

                    // Generate input fields for each subject with saved data if available
                    generateInputFields(subject1Classes, 'subject1Classes', 'subject1TotalPresent', 'subject1TotalAbsent', 'subject1TotalClasses', monthDays[monthSelect.value], subjects[0].dailyAttendance || []);
                    generateInputFields(subject2Classes, 'subject2Classes', 'subject2TotalPresent', 'subject2TotalAbsent', 'subject2TotalClasses', monthDays[monthSelect.value], subjects[1].dailyAttendance || []);
                    generateInputFields(subject3Classes, 'subject3Classes', 'subject3TotalPresent', 'subject3TotalAbsent', 'subject3TotalClasses', monthDays[monthSelect.value], subjects[2].dailyAttendance || []);
                } else {
                    // Clear the fields if no data exists
                    generateInputFields(subject1Classes, 'subject1Classes', 'subject1TotalPresent', 'subject1TotalAbsent', 'subject1TotalClasses', monthDays[monthSelect.value]);
                    generateInputFields(subject2Classes, 'subject2Classes', 'subject2TotalPresent', 'subject2TotalAbsent', 'subject2TotalClasses', monthDays[monthSelect.value]);
                    generateInputFields(subject3Classes, 'subject3Classes', 'subject3TotalPresent', 'subject3TotalAbsent', 'subject3TotalClasses', monthDays[monthSelect.value]);
                }
            } else {
                errorMessage.style.display = 'block';
                // Clear subjects if no student is found
                clearSubjects();
            }
        })
        .catch(error => console.error('Error fetching student data:', error));
});




// Corrected and updated displaySubjectsForCourse function
function displaySubjectsForCourse(course) {
    if (courses[course]) {
        courses[course].forEach((subject, index) => {
            const subjectNum = index + 1;
            // Update Subject ID in the table
            document.getElementById(`subject${subjectNum}Id`).textContent = subject.id;
            // Update Subject Name in the table
            document.getElementById(`subject${subjectNum}`).textContent = subject.name;
            // Also reset the class input fields for each subject
            const subjectClasses = document.getElementById(`subject${subjectNum}Classes`);
            const month = parseInt(monthSelect.value);
            const year = parseInt(yearSelect.value);
            const daysInMonth = getDaysInMonth(month, year);
            generateInputFields(subjectClasses, `subject${subjectNum}Classes`,`subject${subjectNum}TotalPresent`,`subject${subjectNum}TotalAbsent`, `subject${subjectNum}TotalClasses`, daysInMonth);
        });
    } else {
        clearSubjects();
    }
}


// Corrected clearSubjects function
function clearSubjects() {
    [1, 2, 3].forEach(num => {
        document.getElementById(`subject${num}Id`).textContent = num; // Reset to default numbers
        document.getElementById(`subject${num}`).textContent =`Subject ${num}`;
        document.getElementById(`subject${num}Classes`).innerHTML = '';
    });
}


// Handle changes in month and year
document.getElementById('monthSelect').addEventListener('change', updateAttendanceFields);
document.getElementById('yearSelect').addEventListener('change', updateAttendanceFields);

// Initial setup
updateAttendanceFields();


function clearSubjects() {
    [1, 2, 3].forEach(num => {
        document.getElementById(`subject${num}`).textContent = `Subject ${num}`;
        document.getElementById(`subject${num}Classes`).innerHTML = '';
    });
}


document.getElementById('saveAttendance').addEventListener('click', function (event) {
    event.preventDefault();
    const admissionNumber = document.getElementById('admissionNoDisplay').value;
    const semester = document.getElementById('semesterDisplay').value;
    const course = document.getElementById('courseSelect').value;
    const month = monthSelect.value.padStart(2, '0');
    const year = yearSelect.value;

    if (!admissionNumber || !semester || !course || !month || !year) {
        alert('Please make sure all fields are filled in.');
        return;
    }

    const attendanceRecord = {
        admissionNumber,
        semester,
        course,
        month,
        year,
        subjects: []
    };

    ['subject1', 'subject2', 'subject3'].forEach((subjectId, index) => {
        const courseSubjects = courses[course]; // Get the subjects for the selected course
        const subject = courseSubjects[index]; // Get the current subject from the course

        if (!subject || !subject.id) {
            console.error(`Subject ID missing for subject at index ${index}`);
        }

        const subjectName = subject.name;
        const subjectIdValue = subject.id;
        const totalPresent = document.getElementById(`${subjectId}TotalPresent`).textContent;
        const totalAbsent = document.getElementById(`${subjectId}TotalAbsent`).textContent;
        const totalClasses = document.getElementById(`${subjectId}TotalClasses`).textContent;

        const dailyAttendance = Array.from(document.querySelectorAll(`#${subjectId}Classes input`)).map((input, index) => {
            const day = (index + 1).toString().padStart(2, '0');
            return {
                date: `${day}/${month}/${year}`, // Format date as DD/MM/YYYY
                status: input.value.trim().toUpperCase() // Save attendance status (P, A, N)
            };
        });

        attendanceRecord.subjects.push({
            id: subjectIdValue, // Add the subject ID
            name: subjectName,
            totalPresent,
            totalAbsent,
            totalClasses,
            dailyAttendance
        });
    });

    let savedAttendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];

    const recordIndex = savedAttendanceRecords.findIndex(record => 
        record.admissionNumber === admissionNumber && 
        record.course === course && 
        record.month === month && 
        record.year === year

    );

    if (recordIndex >= 0) {
        savedAttendanceRecords[recordIndex] = attendanceRecord;
    } else {
        savedAttendanceRecords.push(attendanceRecord);
    }

    localStorage.setItem('attendanceRecords', JSON.stringify(savedAttendanceRecords));

     // Clear the admission number input field
     document.getElementById('admissionNoDisplay').value = '';

    alert(`Attendance saved successfully for admission number ${admissionNumber}`);
});



// Sample code to retrieve and view saved attendance (for reference)
function viewAttendance() {
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    console.log(attendanceRecords);
}


//Login submission
document.getElementById('loginform').addEventListener('submit', function (event) {
    event.preventDefault();

    var adminNo = document.getElementById('admin-number').value;
    var dob = document.getElementById('dob').value;

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const student = data.find(student => student.admnNo === adminNo && student.dob === dob);

            if (student) {
                // Store student data in localStorage
                localStorage.setItem('admissionNumber', adminNo);
                localStorage.setItem('studentName', student.name);
                localStorage.setItem('studentDob', dob);
                localStorage.setItem('studentCourse', student.course);

                // Redirect to the dashboard or next page
                window.location.href = 'nav.html';
            } else {
                alert('Invalid admission number or date of birth');
            }
        })
        .catch(error => console.error('Error fetching student data:', error));
});


// Go Back button functionality
document.getElementById("goBack").addEventListener("click", function () {
    adminDashboard.style.display = "none";
    adminLoginForm.style.display = "block";

        // Clear the username and password fields
        document.getElementById("admin-username").value = "";  
        document.getElementById("admin-password").value = ""; 
    
});

// Handle course selection
document.getElementById("courseSelect").addEventListener("change", function () {
    const selectedCourse = this.value;

    if (selectedCourse && courses[selectedCourse]) {
        document.getElementById("subject1").textContent = courses[selectedCourse][0];
        document.getElementById("subject2").textContent = courses[selectedCourse][1];
        document.getElementById("subject3").textContent = courses[selectedCourse][2];

        document.getElementById("subject1Classes").innerHTML = '';
        document.getElementById("subject2Classes").innerHTML = '';
        document.getElementById("subject3Classes").innerHTML = '';

        generateInputFields('subject1Classes', 'subject1TotalPresent', 'subject1TotalAbsent', 'subject1TotalNoClass');
        generateInputFields('subject2Classes', 'subject2TotalPresent', 'subject2TotalAbsent', 'subject2TotalNoClass');
        generateInputFields('subject3Classes', 'subject3TotalPresent', 'subject3TotalAbsent', 'subject3TotalNoClass');


    } else {
        clearSubjects();
    }
})