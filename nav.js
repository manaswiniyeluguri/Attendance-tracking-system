document.addEventListener('DOMContentLoaded', function () {
    
    // Retrieve data from localStorage
    const admissionNumber = localStorage.getItem('admissionNumber');
    const studentName = localStorage.getItem('studentName') ? localStorage.getItem('studentName').toUpperCase() : '';
    const studentDob = localStorage.getItem('studentDob');
    const profileSem = localStorage.getItem('profileSem') || '';
    
    // Reset year, course, and father's name for every login
    localStorage.removeItem('profileYear');
    localStorage.removeItem('profileCourse');
    localStorage.removeItem('profileFatherName');
    
    // Display admission number and name in the nav bar
    document.getElementById('adminNoDisplay').textContent = admissionNumber || 'No admission number found';
    document.getElementById('nameDisplay').textContent = studentName || 'No name found';
    
    // Set default values in the profile form
    if (studentName) {
        document.getElementById('profileName').value = studentName;
    }
    if (studentDob) {
        document.getElementById('profileDob').value = new Date(studentDob).toISOString().split('T')[0];
    }
    
    // Display semester in the profile section
    document.getElementById('profileSem').value = profileSem;
    
    // Initialize the page to hide all content sections initially
    hideAllContent();
    
    // Home link click event to show the home content
    document.getElementById('homeLink').addEventListener('click', function (event) {
        event.preventDefault();
        showContent('homeContent');
    });
    
    // Profile link click event to show the profile content
    document.getElementById('profileLink').addEventListener('click', function (event) {
        event.preventDefault();
        showContent('profileContent');
        
        // Fetch student data from JSON and populate the profile form
        fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const student = data.find(student => student.admnNo === admissionNumber);
            if (student) {
                document.getElementById('profileName').value = student.name.toUpperCase();
                document.getElementById('profileDob').value = student.dob;
                document.getElementById('profileYear').value = student.year;
                document.getElementById('profileSem').value = student.semester;
                document.getElementById('profileCourse').value = student.course.toUpperCase();
                document.getElementById('profileFatherName').value = student.fathersName.toUpperCase();
            } else {
                alert('No student data found');
            }
        })
        .catch(error => {
            console.error('Error fetching student data:', error);
        });
    });
    
    // Attendance link click event to show the attendance content
    document.getElementById('attendanceLink').addEventListener('click', function (event) {
        event.preventDefault();
        displaySavedAttendance();
        showContent('attendanceContent');
    });
    
    // Event listener for "Attendance Tracking" link
    document.getElementById('attendenceTracking').addEventListener('click', function (event) {
        event.preventDefault();
        displayMonthlySummary();
        document.getElementById('attendanceContent').style.display = 'none';
        document.getElementById('attendanceContainer').style.display = 'block';
    });
    
    // Function to show the desired content and hide others
    function showContent(contentId) {
        hideAllContent();
        document.getElementById(contentId).style.display = 'block';
    }
    
    // Function to hide all content sections
    function hideAllContent() {
        document.getElementById('homeContent').style.display = 'none';
        document.getElementById('profileContent').style.display = 'none';
        document.getElementById('attendanceContent').style.display = 'none';
        document.getElementById('dispatchFineContent').style.display = 'none';
        document.getElementById('attendanceContainer').style.display = 'none';
    }
    
    // if (filteredRecords.length === 0) {
    //         alert("No attendance records found for this admission number.");
    //         return;
    //      // Display attendance records only when clicking the Attendance link
    // function displaySavedAttendance() {
    //     // Retrieve saved attendance records from localStorage
    //     const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    //     const loggedInAdmissionNumber = localStorage.getItem('admissionNumber');
        
    //     // Check if attendance records exist for the current student
    //     const filteredRecords = attendanceRecords.filter(record => record.admissionNumber === loggedInAdmissionNumber);
    //    }
        
    //     // Clear previous data in the left column
    //     const leftAttendanceData = document.getElementById('leftAttendanceData');
    //     leftAttendanceData.innerHTML = '';
        
    //     // Create an object to keep track of sections by month and year
    //     const attendanceSections = {};
      
        
    //     // Loop through the filtered records (each representing a different month)
    //     filteredRecords.forEach(record => {
    //         const sectionKey = `${record.month}-${record.year}`; // Unique key for each month-year combo

    //         let monthSection;
    //         let attendanceTable;

    //         // Check if a section for the same month and year already exists
    //         if (attendanceSections[sectionKey]) {
    //             // Use the existing section and table
    //             monthSection = attendanceSections[sectionKey].section;
    //             attendanceTable = attendanceSections[sectionKey].table;
    //         } else {
    //             // Create a new section for this month and year
    //             monthSection = document.createElement('div');
    //             monthSection.classList.add('attendance-section');

    //             // Display month and year in the header
    //             const monthYearHeader = document.createElement('h3');
    //             monthYearHeader.textContent = `Attendance for ${record.month}/${record.year}`;
    //             monthSection.appendChild(monthYearHeader);

    //             // Create a table for displaying attendance data
    //             attendanceTable = document.createElement('table');
    //             attendanceTable.classList.add('attendance-table'); // Optional: Add a class for styling

    //             // Create table headers for date and each subject ID
    //             const headerRow = document.createElement('tr');
    //             const dateHeader = document.createElement('th');
    //             dateHeader.textContent = 'Date';
    //             headerRow.appendChild(dateHeader);

    //             // Add a column for each subject (using subject IDs as headers)
    //             record.subjects.forEach(subject => {
    //                 const subjectHeader = document.createElement('th');
    //                 subjectHeader.textContent = `Subject ID: ${subject.id}`;
    //                 headerRow.appendChild(subjectHeader);
    //             });

    //             attendanceTable.appendChild(headerRow);
    //             monthSection.appendChild(attendanceTable);

    //             // Save the section and table in the object for future reference
    //             attendanceSections[sectionKey] = { section: monthSection, table: attendanceTable };

    //             // Add the section to the DOM
    //             leftAttendanceData.appendChild(monthSection);
    //         }

    //         // Loop through each day of attendance for the current month
    //         const numDays = record.subjects[0].dailyAttendance.length; // Assuming all subjects have the same number of days

    //         for (let i = 0; i < numDays; i++) {
    //             // Check if there's at least one valid status (P or A) for this day
    //             let hasValidStatus = false;

    //             record.subjects.forEach(subject => {
    //                 const status = subject.dailyAttendance[i].status.trim().toUpperCase();
    //                 if (status === 'P' || status === 'A') {
    //                     hasValidStatus = true;
    //                 }
    //             });

    //             // Only proceed if there is at least one valid attendance status
    //             if (hasValidStatus) {
    //                 const row = document.createElement('tr');

    //                 // Left Column: Add Date (only if there's valid attendance data)
    //                 const dateElement = document.createElement('td');
    //                 dateElement.textContent = record.subjects[0].dailyAttendance[i].date; // Date in DD/MM/YYYY format
    //                 row.appendChild(dateElement);

    //                 // Right Columns: Add Attendance Status (P/A) for each subject
    //                 record.subjects.forEach(subject => {
    //                     const statusElement = document.createElement('td');
    //                     const status = subject.dailyAttendance[i].status.trim().toUpperCase();

    //                     // Only append the status if it's 'P' or 'A'
    //                     if (status === 'P' || status === 'A') {
    //                         statusElement.textContent = status;
    //                     } else {
    //                         statusElement.textContent = ''; // Leave empty if no valid status
    //                     }

    //                     row.appendChild(statusElement);
    //                 });

    //                 attendanceTable.appendChild(row); // Add the row to the table
    //             }
    //         }
    //     });
    // }

    function displaySavedAttendance() {
        // Retrieve saved attendance records from localStorage
        const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
        const loggedInAdmissionNumber = localStorage.getItem('admissionNumber');
        
        // Check if attendance records exist for the current student
        const filteredRecords = attendanceRecords.filter(record => record.admissionNumber === loggedInAdmissionNumber);
        if (filteredRecords.length === 0) {
            alert("No attendance records found for this admission number.");
            return;
       }
        
        // Clear previous data in the left column
        const leftAttendanceData = document.getElementById('leftAttendanceData');
        leftAttendanceData.innerHTML = '';
        
        // Create an object to keep track of sections by month and year
        const attendanceSections = {};
      
        // Loop through the filtered records (each representing a different month)
        filteredRecords.forEach(record => {
            // Ensure 'record.month' and 'record.year' exist
            const sectionKey = `${record.month || 'Unknown'}-${record.year || 'Unknown'}`; // Default to 'Unknown' if data is missing

            let monthSection;
            let attendanceTable;

            // Check if a section for the same month and year already exists
            if (attendanceSections[sectionKey]) {
                // Use the existing section and table
                monthSection = attendanceSections[sectionKey].section;
                attendanceTable = attendanceSections[sectionKey].table;
            } else {
                // Create a new section for this month and year
                monthSection = document.createElement('div');
                monthSection.classList.add('attendance-section');

                // Display month and year in the header
                const monthYearHeader = document.createElement('h3');
                monthYearHeader.textContent = `Attendance for ${record.month || 'Unknown'}/${record.year || 'Unknown'}`;
                monthSection.appendChild(monthYearHeader);

                // Create a table for displaying attendance data
                attendanceTable = document.createElement('table');
                attendanceTable.classList.add('attendance-table'); // Optional: Add a class for styling

                // Create table headers for date and each subject ID
                const headerRow = document.createElement('tr');
                const dateHeader = document.createElement('th');
                dateHeader.textContent = 'Date';
                headerRow.appendChild(dateHeader);

                // Ensure 'subjects' array exists and is valid
                if (Array.isArray(record.subjects)) {
                // Add a column for each subject (using subject IDs as headers)
                record.subjects.forEach(subject => {
                    const subjectHeader = document.createElement('th');
                        subjectHeader.textContent = `Subject ID: ${subject.id || 'Unknown'}`; // Use 'Unknown' if no ID is provided
                    headerRow.appendChild(subjectHeader);
                });
                }

                attendanceTable.appendChild(headerRow);
                monthSection.appendChild(attendanceTable);

                // Save the section and table in the object for future reference
                attendanceSections[sectionKey] = { section: monthSection, table: attendanceTable };

                // Add the section to the DOM
                leftAttendanceData.appendChild(monthSection);
            }

            // Loop through each day of attendance for the current month
            const numDays = (record.subjects && record.subjects[0] && record.subjects[0].dailyAttendance) 
                ? record.subjects[0].dailyAttendance.length : 0;

            for (let i = 0; i < numDays; i++) {
                // Check if there's at least one valid status (P or A) for this day
                let hasValidStatus = false;

                record.subjects.forEach(subject => {
                    if (subject.dailyAttendance && subject.dailyAttendance[i]) {
                        const status = subject.dailyAttendance[i].status 
                            ? subject.dailyAttendance[i].status.trim().toUpperCase() : '';
                    if (status === 'P' || status === 'A') {
                        hasValidStatus = true;
                    }
                    }
                });

                // Only proceed if there is at least one valid attendance status
                if (hasValidStatus) {
                    const row = document.createElement('tr');

                    // Left Column: Add Date (only if there's valid attendance data)
                    const dateElement = document.createElement('td');
                    const date = record.subjects[0].dailyAttendance[i].date || 'Unknown'; // Handle missing date
                    dateElement.textContent = date; // Date in DD/MM/YYYY format
                    row.appendChild(dateElement);

                    // Right Columns: Add Attendance Status (P/A) for each subject
                    record.subjects.forEach(subject => {
                        const statusElement = document.createElement('td');
                        const status = subject.dailyAttendance[i] && subject.dailyAttendance[i].status 
                            ? subject.dailyAttendance[i].status.trim().toUpperCase() : '';

                        // Only append the status if it's 'P' or 'A'
                        if (status === 'P' || status === 'A') {
                            statusElement.textContent = status;
                        } else {
                            statusElement.textContent = ''; // Leave empty if no valid status
                        }

                        row.appendChild(statusElement);
                    });

                    attendanceTable.appendChild(row); // Add the row to the table
                }
            }
        });
    }    
    
    // Function to display monthly summary (attendance tracking) in a table
function displayMonthlySummary() {
    // Retrieve saved attendance records from localStorage
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const loggedInAdmissionNumber = localStorage.getItem('admissionNumber'); // Get logged-in student's admission number

    // Check if attendance records exist for the current student
    const filteredRecords = attendanceRecords.filter(record => record.admissionNumber === loggedInAdmissionNumber);

    if (filteredRecords.length === 0) {
        alert("No attendance records found for this admission number.");
        return;
    }

    // Initialize the container for the summary
    const container = document.getElementById('attendanceContainer');
    container.innerHTML = ''; // Clear previous data

    // Create the table for displaying monthly summaries
    const summaryTable = document.createElement('table');
    summaryTable.classList.add('summary-table'); // Optional: Add a class for styling

    // Create the table header
    const headerRow = document.createElement('tr');
    const monthHeader = document.createElement('th');
    monthHeader.textContent = 'Month-Year';
    headerRow.appendChild(monthHeader);

    const presentHeader = document.createElement('th');
    presentHeader.textContent = 'Present Days';
    headerRow.appendChild(presentHeader);

    const absentHeader = document.createElement('th');
    absentHeader.textContent = 'Absent Days';
    headerRow.appendChild(absentHeader);

    const totalHeader = document.createElement('th');
    totalHeader.textContent = 'Total Days';
    headerRow.appendChild(totalHeader);

    const percentageHeader = document.createElement('th');
    percentageHeader.textContent = 'Attendance (%)';
    headerRow.appendChild(percentageHeader);

    summaryTable.appendChild(headerRow);

    let totalPresentDays = 0;
    let totalAbsentDays = 0;
    let totalDays = 0;

    const monthlySummary = {};

    // Calculate the summary for each month
    filteredRecords.forEach(record => {
        const monthKey =`${record.month}-${record.year}`;

        if (!monthlySummary[monthKey]) {
            monthlySummary[monthKey] = {
                present: 0,
                absent: 0,
                total: 0
            };
        }

        // Loop through each subject's attendance for this month
        record.subjects.forEach(subject => {
            subject.dailyAttendance.forEach(day => {
                const status = day.status.trim().toUpperCase();

                if (status === 'P') {
                    monthlySummary[monthKey].present++;
                    totalPresentDays++;
                }
                if (status === 'A') {
                    monthlySummary[monthKey].absent++;
                    totalAbsentDays++;
                }
                if (status === 'P' || status === 'A') {
                    monthlySummary[monthKey].total++;
                    totalDays++;
                }
            });
        });
    });

    // Create and display rows for each month's summary
    Object.keys(monthlySummary).forEach(monthKey => {
        const monthSummaryRow = document.createElement('tr');

        const monthCell = document.createElement('td');
        monthCell.textContent = monthKey;
        monthSummaryRow.appendChild(monthCell);

        const presentDays = monthlySummary[monthKey].present;
        const absentDays = monthlySummary[monthKey].absent;
        const totalDaysInMonth = monthlySummary[monthKey].total;
        const percentage = (presentDays / totalDaysInMonth) * 100;

        const presentCell = document.createElement('td');
        presentCell.textContent = presentDays;
        monthSummaryRow.appendChild(presentCell);

        const absentCell = document.createElement('td');
        absentCell.textContent = absentDays;
        monthSummaryRow.appendChild(absentCell);

        const totalCell = document.createElement('td');
        totalCell.textContent = totalDaysInMonth;
        monthSummaryRow.appendChild(totalCell);

        const percentageCell = document.createElement('td');
        percentageCell.textContent = `${percentage.toFixed(2)}%`;
        monthSummaryRow.appendChild(percentageCell);

        summaryTable.appendChild(monthSummaryRow);
    });

    // Add a final row for the overall summary
    const overallSummaryRow = document.createElement('tr');
    overallSummaryRow.classList.add('overall-summary');

    const overallLabelCell = document.createElement('td');
    overallLabelCell.textContent = 'Overall Percentage';
    overallSummaryRow.appendChild(overallLabelCell);

    const overallPresentCell = document.createElement('td');
    overallPresentCell.textContent = totalPresentDays;
    overallSummaryRow.appendChild(overallPresentCell);

    const overallAbsentCell = document.createElement('td');
    overallAbsentCell.textContent = totalAbsentDays;
    overallSummaryRow.appendChild(overallAbsentCell);

    const overallTotalCell = document.createElement('td');
    overallTotalCell.textContent = totalDays;
    overallSummaryRow.appendChild(overallTotalCell);

    const overallPercentage = (totalPresentDays / totalDays) * 100;
    const overallPercentageCell = document.createElement('td');
    overallPercentageCell.textContent = `${overallPercentage.toFixed(2)}%`;
    overallSummaryRow.appendChild(overallPercentageCell);

    summaryTable.appendChild(overallSummaryRow);

    // Append the summary table to the container
    container.appendChild(summaryTable);
} 

document.getElementById('dispatchForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission
    dispatchFine(); // Call the separate function
    // Get email and phone values
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Check if both fields are filled
    if (email === '' || phone === '') {
        alert('Please fill in both email and phone number.');
        event.preventDefault(); // Prevent form submission if validation fails
    } else {
        dispatchFine(); // Call the function to dispatch the message
        alert('Message Sent Successfully!');
    }
    // Event listener for the "Send Message" button
    document.getElementById('submit').addEventListener('click', function () {
        alert('Message Sent Successfully!');
    });
});

// Password protection for "Fine" link
document.getElementById('dispatchLink').addEventListener('click', function (event) {
    event.preventDefault();
    const password = prompt("Enter Admin Password:");
    const adminPassword = "password@123";
    if (password === null) {
        return;
    }
    if (password === adminPassword) {
        showContent('dispatchFineContent');
        dispatchFine();
    } else {
        alert("Wrong password! This section is only for admins.");
    }
});


// Function to send the fine message
function dispatchFine() {
    // Retrieve saved attendance records from localStorage
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const loggedInAdmissionNumber = localStorage.getItem('admissionNumber'); // Get logged-in student's admission number

    // Check if attendance records exist for the current student
    const filteredRecords = attendanceRecords.filter(record => record.admissionNumber === loggedInAdmissionNumber);
    let grandTotalClasses = 0; // Total classes across all months
    let grandTotalPresent = 0; // Total present classes across all months

    // Loop through the filtered records and calculate the totals for each month
    filteredRecords.forEach(record => {
        record.subjects.forEach(subject => {
            subject.dailyAttendance.forEach(day => {
                const status = day.status.trim().toUpperCase();
                if (status === 'P' || status === 'A') {
                    grandTotalClasses++; // Increment total classes
                    if (status === 'P') {
                        grandTotalPresent++;
                    }
                }
            });
        });
    });

    // Calculate overall attendance percentage
    const overallAttendancePercentage = grandTotalClasses > 0 ? ((grandTotalPresent / grandTotalClasses) * 100).toFixed(2) : 0;

    // Generate message based on attendance percentage
    let message;
    if (overallAttendancePercentage < 75) {
        message = `Dear Parent/Student, your ward has less than 75% attendance (${overallAttendancePercentage}%). Please pay a fine of Rs. 3000.`;
    } else {
        message =`Dear Parent/Student, your ward has 75% attendance (${overallAttendancePercentage}%).`;
    }


     // Set the message in the textarea
     document.getElementById('message').value = message;

}
document.getElementById('phone').addEventListener('input', function (event) {
    // Allow only digits and the '+' symbol
    this.value = this.value.replace(/[^0-9+]/g, '');

    // Check if the length is less than 10
    if (this.value.length < 10) {
        this.setCustomValidity('Phone number must be at least 10 characters long.');
    } else {
        this.setCustomValidity(''); // Clear the custom validity message when input is valid
    }
});

// Function to get current date and time
function updateDateTime() {
    const now = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    return `${day}, ${month} ${date}, ${year} ${hours}:${minutes}:${seconds}`;
}

// Function to show date and time
function showDateTime() {
    document.getElementById('dateTimeDisplay').textContent = updateDateTime();
}

// Update date and time every second
setInterval(showDateTime, 1000);
});