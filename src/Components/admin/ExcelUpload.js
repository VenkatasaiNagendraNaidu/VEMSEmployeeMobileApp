import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

function ExcelUpload() {
    const [searchTerm, setSearchTerm] = useState('');
    const [file, setFile] = useState(null); // For file input
    const fileInputRef = useRef(null);
    const [data, setData] = useState([]); // For employee data
    const [tripsData, setTripsData] = useState([]); // For trips data
    const [isAddingEmployee, setIsAddingEmployee] = useState(false); // For "Add Employee" form
    const [employeeImage, setEmployeeImage] = useState(null); //for employee image
    const [newEmployee, setNewEmployee] = useState({
        employeeImg: '', // New field for image URL
        EmployeeID: '',
        EmployeeName: '',
        Gender: '',
        Address: '',
        City: '',
        latitude: '',
        longitude: '',
        Email: '',
        ContactNumber: '',
        EContactNumber: ''
    });
    const [editingEmployeeID, setEditingEmployeeID] = useState(null); // For tracking which employee is being edited
    const [editedEmployee, setEditedEmployee] = useState({}); // For holding the edited data

    // Handle file selection
    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    // Handle search term change
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle file upload to the backend
    const handleSaveToDatabase = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:5000/emp/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('File uploaded successfully');
            // Clear file input after successful upload
            setFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Reset file input
            }
            // Refresh table data after successful upload
            fetchEmployeeData();
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Failed to upload file');
        }
    };

    // Handle form input change for new employee
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle image selection for employee
    const handleImageUpload = (e) => {
        const selectedImage = e.target.files[0];
        setEmployeeImage(selectedImage);
    };

    // Handle form submission to add a new employee
    const handleAddEmployee = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('employeeImg', employeeImage); // Append image file
        formData.append('EmployeeID', newEmployee.EmployeeID);
        formData.append('EmployeeName', newEmployee.EmployeeName);
        formData.append('Gender', newEmployee.Gender);
        formData.append('Address', newEmployee.Address);
        formData.append('City', newEmployee.City);
        formData.append('latitude', newEmployee.latitude);
        formData.append('longitude', newEmployee.longitude);
        formData.append('Email', newEmployee.Email);
        formData.append('ContactNumber', newEmployee.ContactNumber);
        formData.append('EContactNumber', newEmployee.EContactNumber);

        try {
            await axios.post('http://localhost:5000/emp/add-employee', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Employee added successfully');
            setIsAddingEmployee(false);
            // Clear form fields after successful submission
            setNewEmployee({
                employeeImg: '',
                EmployeeID: '',
                EmployeeName: '',
                Gender: '',
                Address: '',
                City: '',
                latitude: '',
                longitude: '',
                Email: '',
                ContactNumber: '',
                EContactNumber: ''
            });
            setEmployeeImage(null); // Clear image field
            // Refresh table data after successful form submission
            fetchEmployeeData();
        } catch (error) {
            console.error('Error adding employee:', error);
            alert('Failed to add employee');
        }
    };

    // // Handle edit employee
    // const handleEditEmployee = async (EmployeeID) => {
    //     try {
    //         const response = await axios.get(`http://localhost:5000/emp/updateemployee/${EmployeeID}`).
    //         then((response) => {
    //             //alert message json from response
    //             console.log(JSON.stringify(response.data));
    //             alert('Employee data fetched for editing');
    //             })
    //             .catch((error) => {
    //                 console.error('Error fetching employee data:', error);
    //                 alert('Failed to fetch employee data');
    //                 });                   
    //         // Logic to handle editing (set state for the form, etc.)
    //     } catch (error) {
    //         console.error('Error fetching employee data:', error);
    //         alert('Failed to fetch employee data');
    //     }
    // };

    // Handle employee edit button click
    const handleEditEmployee = (employee) => {
        setEditingEmployeeID(employee.EmployeeID); // Set the ID of the employee being edited
        setEditedEmployee(employee); // Populate editedEmployee with current data
    };

    // Handle input changes in the edit form
    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEmployee((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle saving the edited employee data
    const handleSaveEditedEmployee = async () => {
        const formData = new FormData();
        formData.append('employeeImg', employeeImage); // Append image file if changed
        Object.keys(editedEmployee).forEach(key => formData.append(key, editedEmployee[key]));
        
        try {
            await axios.post(`http://localhost:5000/emp/updateemployee/${editingEmployeeID}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Employee updated successfully');
            setEditingEmployeeID(null); // Exit editing mode
            setEmployeeImage(null); // Clear image field
            fetchEmployeeData(); // Refresh table data
            
        } catch (error) {
            console.error('Error updating employee:', error);
            alert('Failed to update employee');
        }
    };

    // Handle delete employee
    const handleDeleteEmployee = async (EmployeeID) => {
        try {
            await axios.post(`http://localhost:5000/emp/deleteemployee/${EmployeeID}`);
            alert('Employee deleted successfully');
            // Refresh table data after deletion
            fetchEmployeeData();
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Failed to delete employee');
        }
    };

    // Fetch employee data from the backend
    const fetchEmployeeData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/emp/showemployee');
            setData(response.data);
        } catch (error) {
            console.error('Error fetching employee data:', error);
        }
    };

    // Fetch trips data from the backend
    const fetchTripsData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/emp/showtrips');
            setTripsData(response.data);
        } catch (error) {
            console.error('Error fetching trips data:', error);
        }
    };

    const formatDateTime = (dateTime) => {
        return new Date(dateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' }); // Convert to your required time zone
    };

    // Combine employee and trips data to create a report
    const generateExcelReport = () => {
        const reportData = tripsData.map(trip => {
            const employee = data.find(emp => emp.EmployeeID === trip.EmployeeID);
            return {
                "Booking ID": trip.id,
                "Employee ID": trip.EmployeeID,
                "Date": formatDateTime(trip.date),
                "In Time": trip.inTime,
                "Out Time": trip.outTime,
                "Employee Name": employee ? employee.EmployeeName : '',
                "Latitude": employee ? employee.latitude : '',
                "Longitude": employee ? employee.longitude : '',
                "Address": employee ? employee.Address : '',
                "City": employee ? employee.City : '',
            };
        });

        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
        XLSX.writeFile(workbook, 'TripsReport.xlsx');
    };

    // Fetch employee data on component mount
    useEffect(() => {
        fetchEmployeeData();
        fetchTripsData();
    }, []);

    // Filter employee data based on search term
    const filteredData = data.filter(employee =>
        employee.EmployeeName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <div className='mm-ff'>
                <h1 className='employ-head'>Employee</h1>
                
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search by Name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="search-input"
                />

                {/* File Upload Input */}
                <input
                    className='input-file-xl'
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                />

                {/* Upload Button */}
                <button
                    className="upload-excel"
                    onClick={handleSaveToDatabase}
                    disabled={!file}  // Button disabled if no file selected
                >
                    Upload
                </button>

                {/* Add Employee Button */}
                <button
                    className="add-employee-button"
                    onClick={() => setIsAddingEmployee(true)}
                >
                    Add Employee    
                </button>

                {/* Download Excel Report Button */}
                <button className="download-report" onClick={generateExcelReport}>
                    Download Excel Report
                </button>

                {/* Form to add employee */}
                {isAddingEmployee && (
                    <form className="add-employee-form" onSubmit={handleAddEmployee}>
                        <input
                            type="text"
                            name="EmployeeID"
                            placeholder="Employee ID"
                            value={newEmployee.EmployeeID}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="EmployeeName"
                            placeholder="Name"
                            value={newEmployee.EmployeeName}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="Gender"
                            placeholder="Gender"
                            value={newEmployee.Gender}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="Address"
                            placeholder="Address"
                            value={newEmployee.Address}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="City"
                            placeholder="City"
                            value={newEmployee.City}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="latitude"
                            placeholder="Latitude"
                            value={newEmployee.latitude}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="longitude"
                            placeholder="Longitude"
                            value={newEmployee.longitude}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="email"
                            name="Email"
                            placeholder="Email"
                            value={newEmployee.Email}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="ContactNumber"
                            placeholder="Contact Number"
                            value={newEmployee.ContactNumber}
                            onChange={handleInputChange}
                            required
                        />
                        <input
                            type="text"
                            name="EContactNumber"
                            placeholder="Emergency Contact"
                            value={newEmployee.EContactNumber}
                            onChange={handleInputChange}
                            required
                        />
                        {/* New field for employee profile image */}
                        <input
                            type="file"
                            name="employeeImg"
                            accept="image/*"
                            onChange={handleImageUpload}
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                )}

                {/* Employee Data Table */}
                {data.length > 0 && (
                    <table className="employee-table">
                        <thead>
                            <tr>
                                <th>Profile Image</th> {/* Display profile image */}
                                <th>Employee ID</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Address</th>
                                <th>City</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Email</th>
                                <th>Contact Number</th>
                                <th>Emergency Contact</th>   
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredData.map((employee) => (
                            <tr key={employee.EmployeeID}>
                                <td><img src={employee.employeeImg} alt="Profile" width="50" height="50" /></td>
                                <td>{employee.EmployeeID}</td>
                                {editingEmployeeID === employee.EmployeeID ? (
                                    <>
                                        {/* Render input fields when in edit mode */}
                                        <td><input type="text" name="EmployeeName" value={editedEmployee.EmployeeName} onChange={handleEditInputChange} /></td>
                                        <td><input type="text" name="Gender" value={editedEmployee.Gender} onChange={handleEditInputChange} /></td>
                                        <td><input type="text" name="Address" value={editedEmployee.Address} onChange={handleEditInputChange} /></td>
                                        <td><input type="text" name="City" value={editedEmployee.City} onChange={handleEditInputChange} /></td>
                                        <td><input type="text" name="latitude" value={editedEmployee.latitude} onChange={handleEditInputChange} /></td>
                                        <td><input type="text" name="longitude" value={editedEmployee.longitude} onChange={handleEditInputChange} /></td>
                                        <td>{employee.Email}</td>
                                        <td><input type="text" name="ContactNumber" value={editedEmployee.ContactNumber} onChange={handleEditInputChange} /></td>
                                        <td><input type="text" name="EContactNumber" value={editedEmployee.EContactNumber} onChange={handleEditInputChange} /></td>
                                        <td>
                                            <button onClick={handleSaveEditedEmployee}>Save</button>
                                            <button onClick={() => setEditingEmployeeID(null)}>Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        {/* Render static values when not in edit mode */}
                                        <td>{employee.EmployeeName}</td>
                                        <td>{employee.Gender}</td>
                                        <td>{employee.Address}</td>
                                        <td>{employee.City}</td>
                                        <td>{employee.latitude}</td>
                                        <td>{employee.longitude}</td>
                                        <td>{employee.Email}</td>
                                        <td>{employee.ContactNumber}</td>
                                        <td>{employee.EContactNumber}</td>
                                        <td>
                                            <button onClick={() => handleEditEmployee(employee)}>Edit</button>
                                            <button onClick={() => handleDeleteEmployee(employee.EmployeeID)}>Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                    </table>
                )}

                {/* Trips Data Table */}
                {tripsData.length > 0 && (
                    <table className="trips-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Employee ID</th>
                                <th>Date</th>
                                <th>In Time</th>
                                <th>Out Time</th>
                            </tr>
                        </thead>
                        <tbody>
                        {tripsData.map((trip) => (
                            <tr key={trip.id}>
                                <td>{trip.id}</td>
                                <td>{trip.EmployeeID}</td>
                                <td>{formatDateTime(trip.date)}</td>
                                <td>{trip.inTime}</td>
                                <td>{trip.outTime}</td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                )}

            </div>
        </div>
    );
}

export default ExcelUpload;