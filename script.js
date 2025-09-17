// Grade to grade points mapping for GPA calculation
const gradePoints = {
    'A': 4.0,
    'B': 3.0,
    'C': 2.0,
    'D': 1.0,
    'F': 0.0
};

class Course {
    constructor(name, code, credits) {
        this.name = name;
        this.code = code;
        this.credits = credits;
    }
}

class Enrollment {
    constructor(course, grade) {
        this.course = course;
        this.grade = grade.toUpperCase();
    }

    getGradePoints() {
        return gradePoints[this.grade] || 0;
    }
}

class Student {
    constructor(name) {
        this.name = name;
        this.enrollments = [];
    }

    enroll(course, grade) {
        const existing = this.enrollments.find(e => e.course.code === course.code);
        if (existing) {
            existing.grade = grade.toUpperCase();
        } else {
            this.enrollments.push(new Enrollment(course, grade));
        }
    }

    calculateGPA() {
        if (this.enrollments.length === 0) return 0.0;
        let totalPoints = 0;
        let totalCredits = 0;
        for (const e of this.enrollments) {
            totalPoints += e.getGradePoints() * e.course.credits;
            totalCredits += e.course.credits;
        }
        if (totalCredits === 0) return 0.0;
        return (totalPoints / totalCredits).toFixed(2);
    }
}

// Global state
const students = [];
const courses = [];

// DOM Elements
const studentNameInput = document.getElementById('student-name');
const addStudentBtn = document.getElementById('add-student-btn');
const courseNameInput = document.getElementById('course-name');
const courseCodeInput = document.getElementById('course-code');
const courseCreditsInput = document.getElementById('course-credits');
const addCourseBtn = document.getElementById('add-course-btn');
const selectStudent = document.getElementById('select-student');
const selectCourse = document.getElementById('select-course');
const gradeInput = document.getElementById('grade');
const enrollBtn = document.getElementById('enroll-btn');
const studentsTableBody = document.getElementById('students-table-body');
const studentList = document.getElementById('student-list');
const courseList = document.getElementById('course-list');

// UI Update Functions
function updateStudentDropdown() {
    selectStudent.innerHTML = '<option value="">Select Student</option>';
    students.forEach((student, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = student.name;
        selectStudent.appendChild(option);
    });
}

function updateCourseDropdown() {
    selectCourse.innerHTML = '<option value="">Select Course</option>';
    courses.forEach((course, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${course.name} (${course.code})`;
        selectCourse.appendChild(option);
    });
}

function renderStudentsTable() {
    studentsTableBody.innerHTML = '';
    students.forEach(student => {
        const tr = document.createElement('tr');

        const nameTd = document.createElement('td');
        nameTd.textContent = student.name;
        tr.appendChild(nameTd);

        const coursesTd = document.createElement('td');
        coursesTd.textContent = student.enrollments.length === 0 ? 'None' : student.enrollments.map(e => `${e.course.code} (${e.grade})`).join(', ');
        tr.appendChild(coursesTd);

        const gpaTd = document.createElement('td');
        gpaTd.textContent = student.calculateGPA();
        tr.appendChild(gpaTd);

        studentsTableBody.appendChild(tr);
    });
}

function renderStudentList() {
    studentList.innerHTML = '';
    students.forEach((student, index) => {
        const li = document.createElement('li');
        li.textContent = student.name;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'delete-btn';
        delBtn.onclick = () => {
            students.splice(index, 1);
            updateStudentDropdown();
            renderStudentsTable();
            renderStudentList();
        };
        li.appendChild(delBtn);
        studentList.appendChild(li);
    });
}

function renderCourseList() {
    courseList.innerHTML = '';
    courses.forEach((course, index) => {
        const li = document.createElement('li');
        li.textContent = `${course.name} (${course.code})`;
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'delete-btn';
        delBtn.onclick = () => {
            const removedCourseCode = courses[index].code;
            courses.splice(index, 1);
            students.forEach(student => {
                student.enrollments = student.enrollments.filter(e => e.course.code !== removedCourseCode);
            });
            updateCourseDropdown();
            renderStudentsTable();
            renderCourseList();
        };
        li.appendChild(delBtn);
        courseList.appendChild(li);
    });
}

// Event Listeners
addStudentBtn.addEventListener('click', () => {
    const name = studentNameInput.value.trim();
    if (name === '') {
        alert('Please enter a student name.');
        return;
    }
    students.push(new Student(name));
    studentNameInput.value = '';
    updateStudentDropdown();
    renderStudentsTable();
    renderStudentList();
});

addCourseBtn.addEventListener('click', () => {
    const name = courseNameInput.value.trim();
    const code = courseCodeInput.value.trim();
    const credits = parseInt(courseCreditsInput.value);

    if (name === '' || code === '' || isNaN(credits) || credits < 1) {
        alert('Please enter valid course details.');
        return;
    }
    if (courses.some(c => c.code === code)) {
        alert('Course code must be unique.');
        return;
    }

    courses.push(new Course(name, code, credits));
    courseNameInput.value = '';
    courseCodeInput.value = '';
    courseCreditsInput.value = '';
    updateCourseDropdown();
    renderCourseList();
});

enrollBtn.addEventListener('click', () => {
    const studentIndex = selectStudent.value;
    const courseIndex = selectCourse.value;
    const grade = gradeInput.value.trim().toUpperCase();

    if (studentIndex === '' || courseIndex === '') {
        alert('Please select both student and course.');
        return;
    }
    if (!gradePoints.hasOwnProperty(grade)) {
        alert('Please enter a valid grade (A, B, C, D, F).');
        return;
    }

    students[studentIndex].enroll(courses[courseIndex], grade);
    gradeInput.value = '';
    renderStudentsTable();
});

// Initial Render on Page Load
document.addEventListener('DOMContentLoaded', () => {
    updateStudentDropdown();
    updateCourseDropdown();
    renderStudentsTable();
    renderStudentList();
    renderCourseList();
});