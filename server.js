const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// DB connection (CHANGE password if needed)
const db = mysql.createConnection({
    host: "localhost",
    user: "vinay",
    password: "1234",
    database: "car_rental"
});

db.connect(err => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("MySQL Connected");
});

// INSERT booking
app.post("/book", (req, res) => {
    const { name, car_id, start_date, end_date, total_price } = req.body;

    const sql = `
    INSERT INTO bookings (customer_id, car_id, start_date, end_date, total_price)
    VALUES (
        (SELECT customer_id FROM customers WHERE name = ? LIMIT 1),
        ?, ?, ?, ?
    )`;

    db.query(sql, [name, car_id, start_date, end_date, total_price], 
    (err, result) => {
        if (err) return res.send(err);
        res.send("Booking Saved");
    });
});

// GET bookings (your JOIN)
app.get("/bookings", (req, res) => {
    const sql = `
    SELECT customers.name, cars.model, bookings.start_date,
           bookings.end_date, bookings.total_price
    FROM bookings
    JOIN customers ON bookings.customer_id = customers.customer_id
    JOIN cars ON bookings.car_id = cars.car_id
    `;

    db.query(sql, (err, result) => {
        if (err) return res.send(err);
        res.json(result);
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));