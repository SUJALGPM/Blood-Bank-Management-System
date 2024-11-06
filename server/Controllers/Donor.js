const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDb = require('../Config/Db');

// Donor register API...
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

        // Check if the email already exists in the database
        const checkEmailSql = "SELECT * FROM donors WHERE email = ?";
        db.query(checkEmailSql, [email], async (err, result) => {
            if (err) {
                console.log('Failed to check if email exists:', err);
                return res.status(500).send({ message: "Internal server error." });
            } else if (result.length > 0) {
                return res.status(400).json({ error: 'Email already exists' });
            } else {
                // Create the donors table if it doesn't exist
                const createTableSql = `
                    CREATE TABLE IF NOT EXISTS donors (
                        id VARCHAR(224) PRIMARY KEY,
                        first_name VARCHAR(50) NOT NULL,
                        last_name VARCHAR(50) NOT NULL,
                        contact VARCHAR(50) NOT NULL,
                        email VARCHAR(100) UNIQUE NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        blood_group VARCHAR(10) NULL,
                        health_status VARCHAR(100) NULL,
                        age INT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    )
                `;

                db.query(createTableSql, async (err) => {
                    if (err) {
                        console.error('Error creating donors table:', err);
                        return res.status(500).json({ error: 'Failed to create donors table' });
                    } else {
                        console.log('Donors table created or already exists');

                        // Get the last donor's ID to generate a new ID
                        const lastIdSql = "SELECT id FROM donors ORDER BY created_at DESC LIMIT 1";
                        db.query(lastIdSql, async (err, result) => {
                            if (err) {
                                console.error('Failed to fetch last donor ID:', err);
                                return res.status(500).json({ error: 'Failed to register donor' });
                            }

                            // Generate new donor ID
                            let newDonorId = 'D001';
                            if (result.length > 0) {
                                const lastId = result[0].id;
                                const lastNum = parseInt(lastId.replace('D', ''));
                                newDonorId = 'D' + String(lastNum + 1).padStart(3, '0');
                            }

                            // Hash the password
                            const hashedPassword = await bcrypt.hash(password, 10);

                            // Insert new donor data with NULL for the remaining fields
                            const insertSql = "INSERT INTO donors (id, first_name, last_name, contact, email, password, blood_group, health_status, age) VALUES (?, ?, ?, ?, ?, ?, NULL, NULL, NULL)";
                            db.query(insertSql, [newDonorId, first_name, last_name, contact, email, hashedPassword], (err, data) => {
                                if (err) {
                                    console.error('Failed to register new donor:', err);
                                    return res.status(500).json({ error: 'Failed to register donor' });
                                } else {
                                    console.log('New donor registered successfully:', data);

                                    // Prepare response with registered user details
                                    const response = {
                                        message: 'New donor registered successfully',
                                        donor: {
                                            id: newDonorId,
                                            first_name: first_name,
                                            last_name: last_name,
                                            contact: contact,
                                            email: email,
                                            blood_group: null,
                                            health_status: null,
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

// Donor login API...
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
        const checkEmailSql = "SELECT * FROM donors WHERE email = ?";
        db.query(checkEmailSql, [email], async (err, result) => {
            if (err) {
                console.log('Failed to check email:', err);
                return res.status(500).send({ message: "Internal server error." });
            } else if (result.length === 0) {
                return res.status(400).json({ error: 'Invalid email or password' });
            } else {
                const donor = result[0];

                // Compare the password with the hashed password in the database
                const isMatch = await bcrypt.compare(password, donor.password);
                if (!isMatch) {
                    return res.status(400).json({ error: 'Invalid email or password' });
                }

                // Create a token (if you are using JWT)
                const token = jwt.sign({ id: donor.id, email: donor.email }, 'your_jwt_secret', { expiresIn: '1h' });

                // Prepare response with donor details
                const response = {
                    message: "Login successful",
                    donor: {
                      id: donor.id,
                      first_name: donor.first_name,
                      last_name: donor.last_name,
                      contact: donor.contact,
                      email: donor.email,
                      // Include the blood group, defaulting to "NA" if it's not available
                      age: donor.age ? donor.age : 0,
                      health_status: donor.health_status ? donor.health_status : "NA",
                      bloodGroup: donor.bloodGroup ? donor.bloodGroup : "NA",
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

//Donor Update profile api...
const updateProfileController = async (req, res) => {
    try {
        // Extract user ID from the request parameters (URL)
        const donorId = req.params.id;
        const { id: newId, first_name, last_name, contact, email, blood_group, health_status, age } = req.body;

        // Connect with the database
        const db = await connectDb();

        // SQL query to get the existing profile details
        const getProfileSql = "SELECT * FROM donors WHERE id = ?";
        db.query(getProfileSql, [donorId], (err, result) => {
            if (err) {
                console.error('Failed to retrieve donor profile:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            if (result.length === 0) {
                return res.status(404).json({ error: 'Donor not found' });
            }

            // Get existing donor details
            const existingDonor = result[0];

            // Prepare the updated values, using existing values if not provided in request
            const updatedId = newId !== undefined ? newId : donorId; // Use newId if provided
            const updatedFirstName = first_name !== undefined ? first_name : existingDonor.first_name;
            const updatedLastName = last_name !== undefined ? last_name : existingDonor.last_name;
            const updatedContact = contact !== undefined ? contact : existingDonor.contact;
            const updatedEmail = email !== undefined ? email : existingDonor.email;
            const updatedBloodGroup = blood_group !== undefined ? blood_group : existingDonor.blood_group;
            const updatedHealthStatus = health_status !== undefined ? health_status : existingDonor.health_status;
            const updatedAge = age !== undefined ? age : existingDonor.age;

            // SQL query to update the donor profile, including the ID
            const updateSql = `
                UPDATE donors
                SET id = ?, first_name = ?, last_name = ?, contact = ?, email = ?, blood_group = ?, health_status = ?, age = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `;
            db.query(updateSql, [updatedId, updatedFirstName, updatedLastName, updatedContact, updatedEmail, updatedBloodGroup, updatedHealthStatus, updatedAge, donorId], (err, data) => {
                if (err) {
                    console.error('Failed to update donor profile:', err);
                    return res.status(500).json({ error: 'Failed to update donor profile' });
                } else {
                    console.log('Donor profile updated successfully:', data);
                    return res.status(200).json({
                        message: 'Donor profile updated successfully',
                        data: {
                            donorId: updatedId, 
                            first_name: updatedFirstName,
                            last_name: updatedLastName,
                            contact: updatedContact,
                            email: updatedEmail,
                            blood_group: updatedBloodGroup,
                            health_status: updatedHealthStatus,
                            age: updatedAge
                        }
                    });
                }
            });
        });
    } catch (err) {
        console.error('Error in updateProfileController:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Make Donation API...
const makeDonationController = async (req, res) => {
    const { donor_id, donor_name, blood_type, quantity_ml, donation_date } = req.body;

    try {
        // Check for missing fields
        const missingFields = [];
        if (!donor_id) missingFields.push('donor_id');
        if (!donor_name) missingFields.push('donor_name'); 
        if (!blood_type) missingFields.push('blood_type');
        if (!quantity_ml) missingFields.push('quantity_ml');
        if (!donation_date) missingFields.push('donation_date');

        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
        }

        // Connect with the database
        const db = await connectDb();

        // Insert donation into blood table with donor_name from req.body
        const bloodInsertQuery = 'INSERT INTO blood (donor_id, donor_name, blood_type, quantity_ml, donation_date, inventory_status) VALUES (?, ?, ?, ?, ?, ?)';
        await db.query(bloodInsertQuery, [donor_id, donor_name, blood_type, quantity_ml, donation_date, 'IN']);

        // Update bloodbank table
        const bloodbankQuery = 'INSERT INTO bloodbank (blood_type, quantity_ml) VALUES (?, ?) ON DUPLICATE KEY UPDATE quantity_ml = quantity_ml + ?';
        await db.query(bloodbankQuery, [blood_type, quantity_ml, quantity_ml]);

        return res.status(201).json({ message: 'Donation recorded successfully.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get personal details..
const getDonorDetailsController = async (req, res) => {
    try {
        const donorId = req.params.id;
        const db = await connectDb();
        
        // Correctly formatted SQL query
        const sql = 'SELECT * FROM donors WHERE id = ?';

        // Use parameterized query to avoid SQL injection
        db.query(sql, [donorId], (err, result) => {
            if (err) {
                console.error('Failed to fetch donor details:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (result.length === 0) {
                return res.status(404).json({ error: 'Donor not found' });
            }

            return res.status(200).json({
                message: 'Donor details fetched successfully',
                data: result[0]
            });
        });
    } catch (error) {
        console.error('Error in getDonorDetails:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    registerController,
    loginController,
    updateProfileController,
    makeDonationController,
    getDonorDetailsController
}