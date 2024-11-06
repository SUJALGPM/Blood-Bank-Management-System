const { promisify } = require('util');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDb = require('../Config/Db');

// Register Donee API
const registerController = async (req, res) => {
    try {
        const { first_name, last_name, contact, email, password } = req.body;

        // Check for missing fields
        const missingFields = [];
        if (!first_name) missingFields.push('first_name');
        if (!last_name) missingFields.push('last_name');
        if (!contact) missingFields.push('contact');
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');

        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
        }

        // Connect with the database
        const db = await connectDb();

        // Check if the email or contact already exists in the database
        const checkUniqueSql = "SELECT * FROM donee WHERE email = ? OR contact = ?";
        db.query(checkUniqueSql, [email, contact], async (err, result) => {
            if (err) {
                console.log('Failed to check for existing email/contact:', err);
                return res.status(500).json({ error: "Internal server error." });
            } else if (result.length > 0) {
                return res.status(400).json({ error: 'Email or contact already exists' });
            } else {
                // Create the donee table if it doesn't exist, removing request_date, request_status, and quantity_ml
                const createTableSql = `
                    CREATE TABLE IF NOT EXISTS donee (
                        id VARCHAR(224) PRIMARY KEY,
                        first_name VARCHAR(50) NOT NULL,
                        last_name VARCHAR(50) NOT NULL,
                        email VARCHAR(100) UNIQUE NOT NULL,
                        contact VARCHAR(20) UNIQUE NOT NULL,
                        health_status VARCHAR(255) NULL,
                        blood_group VARCHAR(200) NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        password VARCHAR(224) NOT NULL,
                        age INT NULL
                    )
                `;

                db.query(createTableSql, async (err) => {
                    if (err) {
                        console.error('Error creating donee table:', err);
                        return res.status(500).json({ error: 'Failed to create donee table' });
                    } else {
                        console.log('Donee table created or already exists');

                        // Get the last donee's ID to generate a new ID
                        const lastIdSql = "SELECT id FROM donee ORDER BY created_at DESC LIMIT 1";
                        db.query(lastIdSql, async (err, result) => {
                            if (err) {
                                console.error('Failed to fetch last donee ID:', err);
                                return res.status(500).json({ error: 'Failed to register donee' });
                            }

                            // Generate new donee ID
                            let newDoneeId = 'DN001';
                            if (result.length > 0) {
                                const lastId = result[0].id;
                                const lastNum = parseInt(lastId.replace('DN', ''));
                                newDoneeId = 'DN' + String(lastNum + 1).padStart(3, '0');
                            }

                            // Hash the password
                            const hashedPassword = await bcrypt.hash(password, 10);

                            // Insert new donee data with default NULL or default values for optional fields
                            const insertSql = `
                                INSERT INTO donee (id, first_name, last_name, contact, email, password, health_status, blood_group, age)
                                VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, NULL)
                            `;
                            db.query(insertSql, [newDoneeId, first_name, last_name, contact, email, hashedPassword], (err, data) => {
                                if (err) {
                                    console.error('Failed to register new donee:', err);
                                    return res.status(500).json({ error: 'Failed to register donee' });
                                } else {
                                    console.log('New donee registered successfully:', data);

                                    // Prepare response with registered donee details
                                    const response = {
                                        message: 'New donee registered successfully',
                                        donee: {
                                            id: newDoneeId,
                                            first_name: first_name,
                                            last_name: last_name,
                                            contact: contact,
                                            email: email,
                                            health_status: null,
                                            blood_group: null,
                                            age: null
                                        }
                                    };

                                    return res.status(201).json(response);
                                }
                            });
                        });
                    }
                });
            }
        });
    } catch (err) {
        console.error('Error in registerController:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Donee Login API
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for missing fields
        const missingFields = [];
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');

        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
        }

        // Connect with the database
        const db = await connectDb();

        // Check if the donor exists in the database
        const checkEmailSql = "SELECT * FROM donee WHERE email = ?";
        db.query(checkEmailSql, [email], async (err, result) => {
            if (err) {
                console.log('Failed to check email:', err);
                return res.status(500).send({ message: "Internal server error." });
            } else if (result.length === 0) {
                return res.status(400).json({ error: 'Invalid email or password' });
            } else {
                const donee = result[0];

                // Compare the password with the hashed password in the database
                const isMatch = await bcrypt.compare(password, donee.password);
                if (!isMatch) {
                    return res.status(400).json({ error: 'Invalid email or password' });
                }

                // Create a token (if you are using JWT)
                const token = jwt.sign({ id: donee.id, email: donee.email }, 'your_jwt_secret', { expiresIn: '1h' });

                // Prepare response with donor details
                const response = {
                    message: "Login successful",
                    donee: {
                      id: donee.id,
                      first_name: donee.first_name,
                      last_name: donee.last_name,
                      contact: donee.contact,
                      email: donee.email,
                      // Include the blood group, defaulting to "NA" if it's not available
                      age: donee.age ? donee.age : 0,
                      health_status: donee.health_status ? donee.health_status : "NA",
                      bloodGroup: donee.bloodGroup ? donee.bloodGroup : "NA",
                      // You can also include the token if required
                      token: token,
                    },
                  };

                return res.status(200).json(response);
            }
        });
    } catch (err) {
        console.error('Error in loginController:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Donee Update Profile API
const updateProfileController = async (req, res) => {
    try {
        const doneeId = req.params.id;
        console.log("id :",doneeId);
        
        const { first_name, last_name, contact, email, health_status, blood_group } = req.body;

        const db = await connectDb();

        const getProfileSql = "SELECT * FROM donee WHERE id = ?";
        db.query(getProfileSql, [doneeId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: 'Donee not found' });
            }

            console.log("res :",result[0]);
            const existingDonee = result[0];
            
            const updatedFirstName = first_name || existingDonee.first_name;
            const updatedLastName = last_name || existingDonee.last_name;
            const updatedContact = contact || existingDonee.contact;
            const updatedEmail = email || existingDonee.email;
            const updatedHealthStatus = health_status || existingDonee.health_status;
            const updatedBloodGroup = blood_group || existingDonee.blood_group;

            // Validation check
            if (!updatedFirstName || !updatedLastName || !updatedContact || !updatedEmail) {
                return res.status(400).json({ error: 'Required fields are missing or invalid.' });
            }

            const updateSql = `
                UPDATE donee
                SET first_name = ?, last_name = ?, contact = ?, email = ?, health_status = ?, blood_group = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            db.query(updateSql, [updatedFirstName, updatedLastName, updatedContact, updatedEmail, updatedHealthStatus, updatedBloodGroup, doneeId], (err) => {
                if (err) {
                    console.error('SQL Error:', err); 
                    return res.status(500).json({ error: 'Failed to update donee profile' });
                }
                return res.status(200).json({
                    message: 'Donee profile updated successfully',
                    data: {
                        first_name: updatedFirstName,
                        last_name: updatedLastName,
                        contact: updatedContact,
                        email: updatedEmail,
                        health_status: updatedHealthStatus,
                        blood_group: updatedBloodGroup
                    }
                });
            });
        });
    } catch (err) {
        console.error('Error:', err);  
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Donee Receive Blood API
// const receiveBloodController = async (req, res) => {
//     const { donee_id, donee_name, blood_group, quantity_ml } = req.body;

//     // Check for required fields
//     if (!donee_id || !donee_name || !blood_group || !quantity_ml) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     try {
//         const db = await connectDb();
//         const query = promisify(db.query).bind(db); 

//         // Check if the donee_id exists
//         const checkDoneeQuery = 'SELECT id FROM donee WHERE id = ?';
//         const doneeResults = await query(checkDoneeQuery, [donee_id]);

//         if (doneeResults.length === 0) {
//             return res.status(404).json({ message: 'Donee not found' });
//         }

//         // Check blood availability in the bloodbank table
//         const checkAvailabilityQuery = 'SELECT quantity_ml FROM bloodbank WHERE blood_type = ?';
//         const availabilityResults = await query(checkAvailabilityQuery, [blood_group]);

//         if (availabilityResults.length === 0 || availabilityResults[0].quantity_ml < quantity_ml) {
//             return res.status(404).json({ message: 'Requested blood type not available' });
//         }

//         // Insert request into the blood table
//         const insertRequestQuery = `
//             INSERT INTO blood (donor_id, donor_name, donee_id, donee_name, blood_type, quantity_ml, request_date, request_status, donation_date, inventory_status) 
//             VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE(), 'PENDING', NULL, 'OUT')`;
        
//         const insertResult = await query(insertRequestQuery, [null, null, donee_id, donee_name, blood_group, quantity_ml]);

//         // Update bloodbank quantity
//         const updateBloodBankQuery = 'UPDATE bloodbank SET quantity_ml = quantity_ml - ? WHERE blood_type = ?';
//         await query(updateBloodBankQuery, [quantity_ml, blood_group]);

//         return res.status(201).json({ message: 'Request submitted successfully', requestId: insertResult.insertId });
//     } catch (err) {
//         console.error(err); // Log the error for debugging
//         return res.status(500).json({ error: 'An error occurred while processing your request' });
//     }
// };

const receiveBloodController = async (req, res) => {
    const { donee_id, donee_name, blood_group, quantity_ml } = req.body;

    // Check for required fields
    if (!donee_id || !donee_name || !blood_group || !quantity_ml) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const db = await connectDb();
        const query = promisify(db.query).bind(db); 

        // Check if the donee_id exists
        const checkDoneeQuery = 'SELECT id FROM donee WHERE id = ?';
        const doneeResults = await query(checkDoneeQuery, [donee_id]);

        if (doneeResults.length === 0) {
            return res.status(404).json({ message: 'Donee not found' });
        }

        // Check blood availability in the bloodbank table
        const checkAvailabilityQuery = 'SELECT quantity_ml FROM bloodbank WHERE blood_type = ?';
        const availabilityResults = await query(checkAvailabilityQuery, [blood_group]);

        if (availabilityResults.length === 0 || availabilityResults[0].quantity_ml < quantity_ml) {
            return res.status(404).json({ message: 'Requested blood type not available' });
        }

        // Insert request into the blood table with "PENDING" status
        const insertRequestQuery = `
            INSERT INTO blood (donor_id, donor_name, donee_id, donee_name, blood_type, quantity_ml, request_date, request_status, donation_date, inventory_status) 
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE(), 'PENDING', NULL, 'OUT')`;
        
        const insertResult = await query(insertRequestQuery, [null, null, donee_id, donee_name, blood_group, quantity_ml]);

        // First, fetch the blood_manager ID
        const managerIdQuery = 'SELECT id FROM blood_manager LIMIT 1';
        const managerResult = await query(managerIdQuery);

        if (managerResult.length === 0) {
            return res.status(404).json({ message: 'Blood manager not found' });
        }
        const managerId = managerResult[0].id;

        // Update the pending_requests JSON field in blood_manager
        const updateManagerQuery = `
            UPDATE blood_manager 
            SET pending_requests = JSON_ARRAY_APPEND(
                IFNULL(pending_requests, JSON_ARRAY()), 
                '$', 
                JSON_OBJECT(
                    'requestId', ?, 
                    'doneeId', ?, 
                    'doneeName', ?, 
                    'bloodType', ?, 
                    'quantityMl', ?, 
                    'requestDate', CURRENT_DATE(),
                    'requestStatus', 'PENDING'
                )
            )
            WHERE id = ?`;

        await query(updateManagerQuery, [insertResult.insertId, donee_id, donee_name, blood_group, quantity_ml, managerId]);

        return res.status(201).json({ message: 'Request submitted successfully', requestId: insertResult.insertId });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ error: 'An error occurred while processing your request' });
    }
};

// Get personal details..
const getDoneeDetailsController = async (req, res) => {
    try {
        const doneeId = req.params.id;
        const db = await connectDb();
        
        // Correctly formatted SQL query
        const sql = 'SELECT * FROM donee WHERE id = ?';

        // Use parameterized query to avoid SQL injection
        db.query(sql, [doneeId], (err, result) => {
            if (err) {
                console.error('Failed to fetch donor details:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (result.length === 0) {
                return res.status(404).json({ error: 'Donee not found' });
            }

            return res.status(200).json({
                message: 'Donee details fetched successfully',
                data: result[0]
            });
        });
    } catch (error) {
        console.error('Error in getDoneeDetails:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    registerController,
    loginController,
    updateProfileController,
    receiveBloodController,
    getDoneeDetailsController
};