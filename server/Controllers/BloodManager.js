const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectDb = require('../Config/Db');


// Blood Manager register API
const registerBloodManagerController = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;

        // Check for missing fields
        const missingFields = [];
        if (!username) missingFields.push('username');
        if (!email) missingFields.push('email');
        if (!phone) missingFields.push('phone');
        if (!password) missingFields.push('password');

        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
        }

        // Connect with the database
        const db = await connectDb();

        // Check if the email already exists in the database
        const checkEmailSql = "SELECT * FROM blood_manager WHERE email = ?";
        db.query(checkEmailSql, [email], async (err, result) => {
            if (err) {
                console.log('Failed to check if email exists:', err);
                return res.status(500).send({ message: "Internal server error." });
            } else if (result.length > 0) {
                return res.status(400).json({ error: 'Email already exists' });
            } else {
                // Create the blood_manager table if it doesn't exist
                const createTableSql = `
                    CREATE TABLE IF NOT EXISTS blood_manager (
                        id VARCHAR(224) PRIMARY KEY,
                        username VARCHAR(50) NOT NULL,
                        email VARCHAR(100) UNIQUE NOT NULL,
                        phone VARCHAR(20) NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                    )
                `;

                db.query(createTableSql, async (err) => {
                    if (err) {
                        console.error('Error creating blood_manager table:', err);
                        return res.status(500).json({ error: 'Failed to create blood_manager table' });
                    } else {
                        console.log('blood_manager table created or already exists');

                        // Get the last manager's ID to generate a new ID
                        const lastIdSql = "SELECT id FROM blood_manager ORDER BY created_at DESC LIMIT 1";
                        db.query(lastIdSql, async (err, result) => {
                            if (err) {
                                console.error('Failed to fetch last manager ID:', err);
                                return res.status(500).json({ error: 'Failed to register blood manager' });
                            }

                            // Generate new manager ID
                            let newManagerId = 'M001';
                            if (result.length > 0) {
                                const lastId = result[0].id;
                                const lastNum = parseInt(lastId.replace('M', ''));
                                newManagerId = 'M' + String(lastNum + 1).padStart(3, '0');
                            }

                            // Hash the password
                            const hashedPassword = await bcrypt.hash(password, 10);

                            // Insert new blood manager data into the database
                            const insertSql = "INSERT INTO blood_manager (id, username, email, phone, password) VALUES (?, ?, ?, ?, ?)";
                            db.query(insertSql, [newManagerId, username, email, phone, hashedPassword], (err, data) => {
                                if (err) {
                                    console.error('Failed to register new blood manager:', err);
                                    return res.status(500).json({ error: 'Failed to register blood manager' });
                                } else {
                                    console.log('New blood manager registered successfully:', data);

                                    // Prepare response with registered user details
                                    const response = {
                                        message: 'New blood manager registered successfully',
                                        manager: {
                                            id: newManagerId,
                                            username: username,
                                            email: email,
                                            phone: phone
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
        console.error('Error in registerBloodManagerController:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Login Controller for Blood Manager
const loginBloodManagerController = async (req, res) => {
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

        // Check if the blood manager exists in the database
        const checkEmailSql = "SELECT * FROM blood_manager WHERE email = ?";
        db.query(checkEmailSql, [email], async (err, result) => {
            if (err) {
                console.error('Failed to check email:', err);
                return res.status(500).send({ message: "Internal server error." });
            } else if (result.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            } else {
                const manager = result[0];

                // Compare the password with the hashed password in the database
                const isMatch = await bcrypt.compare(password, manager.password);
                if (!isMatch) {
                    return res.status(401).json({ error: 'Invalid email or password' });
                }

                // Create a token (if you are using JWT)
                const token = jwt.sign({ id: manager.id, email: manager.email }, 'your_jwt_secret', { expiresIn: '1h' });

                // Prepare response with manager details
                const response = {
                    message: 'Login successful',
                    manager: {
                        id: manager.id,
                        username: manager.username,
                        email: manager.email,
                        phone: manager.phone,
                        token: token // Include the token in the response if required
                    }
                };

                return res.status(200).json(response);
            }
        });
    } catch (err) {
        console.error('Error in loginBloodManagerController:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Approve or Deny Request Controller
const approveOrDenyRequest = async (req, res) => {
    const { requestId, status } = req.body;

    if (!requestId || !status || !['approved', 'denied'].includes(status.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid request data. Please provide a valid requestId and status (approved or denied).' });
    }

    try {
        // Connect with the database
        const db = await connectDb();

        // Step 1: Get the blood request details from the blood table by requestId
        const requestsResult = await db.query(`SELECT * FROM blood WHERE id = ? AND request_status = 'PENDING'`, [requestId]);
        const requests = requestsResult[0] || [];
        console.log("data :",requests);
        

        if (!requests.length) {
            return res.status(404).json({ error: 'Request not found or already processed.' });
        }

        const request = requests[0];
        const { blood_type, quantity_ml } = request;

        if (status.toLowerCase() === 'approved') {
            // Step 2: Deduct the blood quantity in the bloodbank table if approved
            const bloodBankRecordsResult = await db.query(`SELECT * FROM bloodbank WHERE blood_type = ?`, [blood_type]);
            const bloodBankRecords = bloodBankRecordsResult[0] || [];

            if (!bloodBankRecords.length || bloodBankRecords[0].quantity_ml < quantity_ml) {
                return res.status(400).json({ error: 'Insufficient blood quantity in the blood bank.' });
            }

            await db.query(`UPDATE bloodbank SET quantity_ml = quantity_ml - ?, last_updated = NOW() WHERE blood_type = ?`, [quantity_ml, blood_type]);
        }

        // Step 3: Update the request status in the blood table
        await db.query(`UPDATE blood SET request_status = ?, updated_at = NOW() WHERE id = ?`, [status.toUpperCase(), requestId]);

        return res.status(200).json({ message: `Request ${status} successfully.` });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'An error occurred while processing the request.' });
    }
};

// Bloodbank table stock status Controller..
const bloodbankstock = async (req, res) => {
    try {
      // Connect with the database
      const db = await connectDb();
  
      // Query to fetch blood type and quantity from the bloodbank table
      db.query('SELECT blood_type, quantity_ml FROM bloodbank', (err, rows) => {
        if (err) {
          console.error('Error fetching blood bank stock:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        // Send the result as JSON
        res.status(200).json(rows);
      });
  
      // Close the database connection after the query
      db.end();
    } catch (err) {
      console.error('Database connection error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// BM Handle pending request get api Controller..
const FetchPendingRequests = async(req, res) => {
    try {
      // Connect with the database
      const db = await connectDb();
  
      // Query to fetch pending_requests from blood_manager table
      db.query('SELECT pending_requests FROM blood_manager', (err, results) => {
        if (err) {
          console.error('Error fetching pending requests:', err);
          res.status(500).json({ error: 'Internal Server Error' });
          return;
        }
  
        // Parse the pending_requests JSON string for each row
        const pendingRequests = results.map(row => JSON.parse(row.pending_requests));
  
        // Send the result as JSON
        res.status(200).json(pendingRequests);
      });
  
      // Close the database connection
      db.end();
    } catch (err) {
      console.error('Database connection error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// BM Recent donation fetch api Controller..
const recentDonations = async (req, res) => {
    try {
        const db = await connectDb();
        
        // SQL query to fetch recent donations where inventory_status is 'IN'
        // const getDonationsQuery = `
        //     SELECT * FROM blood 
        //     WHERE inventory_status = 'IN'
        //     ORDER BY created_at DESC
        // `;
        const getDonationsQuery = `
            SELECT * FROM blood 
            ORDER BY created_at DESC
        `;

        // Execute query and get results
        db.query(getDonationsQuery, (err, donationsResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'An error occurred while fetching donations' });
            }

            // Check if there are results
            if (!donationsResults || donationsResults.length === 0) {
                return res.status(404).json({ message: 'No recent donations found' });
            }

            // Map to include only the desired fields
            const filteredResults = donationsResults.map(({ donee_id, donee_name, request_date, request_status, ...rest }) => rest);

            // Return the filtered results
            return res.status(200).json(filteredResults);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while fetching donations' });
    }
}

// BM Recent blood request fetch API Controller...
const recentBloodRequests = async (req, res) => {
    try {
        const db = await connectDb();
        
        // SQL query to fetch recent blood requests
        const getBloodRequestsQuery = `
            SELECT * FROM blood 
            WHERE inventory_status = 'OUT' 
            ORDER BY request_date DESC
        `;

        // Execute query and get results
        db.query(getBloodRequestsQuery, (err, requestsResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'An error occurred while fetching blood requests' });
            }

            // Check if there are results
            if (!requestsResults || requestsResults.length === 0) {
                return res.status(404).json({ message: 'No recent blood requests found' });
            }

            // Create a new array excluding the specified fields
            const filteredResults = requestsResults.map(({ donor_id, donor_name, donation_date, ...rest }) => rest);

            // Return the filtered results
            return res.status(200).json(filteredResults);
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while fetching blood requests' });
    }
}


module.exports = {
    registerBloodManagerController,
    loginBloodManagerController,
    approveOrDenyRequest,
    bloodbankstock,
    FetchPendingRequests,
    recentDonations,
    recentBloodRequests
}
