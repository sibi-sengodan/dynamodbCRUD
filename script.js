function getAllStudents() {
    fetch("http://localhost:8000/get-all")
        .then((response) => response.json())
        .then((data) => {
            const table = document.getElementById("studentTable");
            table.innerHTML = "<tr><th>Customer ID</th><th>Name</th><th>City</th><th>Age</th><th>Edit</th><th>Delete</th></tr>";
            data.forEach((student) => {
                const row = table.insertRow(-1);
                const keys = ["customerid", "StudentName", "City", "Age"];
                keys.forEach((key) => {
                    const cell = row.insertCell();
                    cell.innerHTML = student[key];
                });
                const editCell = row.insertCell();
                editCell.innerHTML = `<button onclick="editStudent('${student.customerid}')">Edit</button>`;
                const deleteCell = row.insertCell();
                deleteCell.innerHTML = `<button onclick="deleteStudent('${student.customerid}')">Delete</button>`;
            });
        });
}

function addStudent() {
    // Create a form element
    const form = document.createElement("form");
    form.innerHTML = `
        <label for="customerid">Customer ID:</label>
        <input type="text" id="customerId" name="customerid"><br><br>

        <label for="name">Name:</label>
        <input type="text" id="StudentName" name="StudentName"><br><br>

        <label for="city">City:</label>
        <input type="text" id="City" name="City"><br><br>

        <label for="age">Age:</label>
        <input type="number" id="Age" name="Age"><br><br>

        <input type="submit" value="Submit">
    `;

    // Attach a submit event listener to the form
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Get the form data
        const formData = new FormData(form);

        // Create a JavaScript object from the form data
        const studentData = {};
        formData.forEach((value, key) => {
            studentData[key] = value;
        });

        // Make a POST request to the API to add the new student
        fetch("http://localhost:8000/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message); // Display a success message
                getAllStudents(); // Refresh the student table
                form.remove(); // Remove the form fields
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while adding the student.");
            });
    });

    // Append the form to the document
    document.body.appendChild(form);
}


function editStudent(customerid) {
    // Fetch the student data by customerid
    fetch(`http://localhost:8000/get-all`)
        .then((response) => response.json())
        .then((data) => {
            const studentToEdit = data.find((student) => student.customerid === customerid);

            if (studentToEdit) {
                // Create a form element
                const form = document.createElement("form");
                form.innerHTML = `
                    <label for="editedCustomerId">Customer ID:</label>
                    <input type="text" id="editedCustomerId" name="customerid" value="${studentToEdit.customerid}" readonly><br><br>

                    <label for="editedName">Name:</label>
                    <input type="text" id="editedName" name="StudentName" value="${studentToEdit.StudentName}"><br><br>

                    <label for="editedCity">City:</label>
                    <input type="text" id="editedCity" name="City" value="${studentToEdit.City}"><br><br>

                    <label for="editedAge">Age:</label>
                    <input type="number" id="editedAge" name="Age" value="${studentToEdit.Age}"><br><br>

                    <input type="submit" value="Save Changes">
                `;

                // Attach a submit event listener to the form
                form.addEventListener("submit", function (event) {
                    event.preventDefault(); // Prevent the default form submission behavior

                    // Get the form data
                    const formData = new FormData(form);

                    // Create a JavaScript object from the form data
                    const editedStudentData = {};
                    formData.forEach((value, key) => {
                        editedStudentData[key] = value;
                    });

                    // Make a PUT request to the API to edit the student
                    fetch(`http://localhost:8000/edit/${customerid}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(editedStudentData),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            alert(data.message); // Display a success message
                            getAllStudents(); // Refresh the student table
                            form.remove(); // Remove the edit form
                        })
                        .catch((error) => {
                            console.error("Error:", error);
                            alert("An error occurred while editing the student.");
                        });
                });

                // Append the form to the document
                document.body.appendChild(form);
            } else {
                alert("Student not found.");
            }
        })
        .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while fetching student data.");
        });
}


function deleteStudent(customerid) {
    // Confirm the deletion with the user
    const confirmDelete = confirm("Are you sure you want to delete this student?");

    if (confirmDelete) {
        // Make a DELETE request to the API to delete the student
        fetch(`http://localhost:8000/delete/${customerid}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message); // Display a success message
                getAllStudents(); // Refresh the student table
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("An error occurred while deleting the student.");
            });
    }
}

