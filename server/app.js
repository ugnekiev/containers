const express = require("express");
const app = express();
const port = 3003;
app.use(express.json({ limit: '10mb' }));
const cors = require("cors");
app.use(cors());
const md5 = require('js-md5');
const uuid = require('uuid');
const mysql = require("mysql");
app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());


const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "shipments",

});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});


//////////////////LOGIN START/////////////////////////

const doAuth = function(req, res, next) {
    if (0 === req.url.indexOf('/admin')) { // admin
        const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
        con.query(
            sql, [req.headers['authorization'] || ''],
            (err, results) => {
                if (err) throw err;
                if (!results.length || results[0].role !== 10) {
                    res.status(401).send({});
                    req.connection.destroy();
                } else {
                    next();
                }
            }
        );
    } else if (0 === req.url.indexOf('/login-check') 
    || 0 === req.url.indexOf('/login')
    || 0 === req.url.indexOf('/')
    || 0 === req.url.indexOf('/stories')
    || 0 === req.url.indexOf('/donate')) {
        next();
    } else { // fron
        const sql = `
        SELECT
        name, role
        FROM users
        WHERE session = ?
    `;
        con.query(
            sql, [req.headers['authorization'] || ''],
            (err, results) => {
                if (err) throw err;
                if (!results.length) {
                    res.status(401).send({});
                    req.connection.destroy();
                } else {
                    next();
                }
            }
        );
    }
}
app.use(doAuth)

// AUTH
app.get("/login-check", (req, res) => {
    const sql = `
         SELECT
         name, role
         FROM users
         WHERE session = ?
        `;
    con.query(sql, [req.headers['authorization'] || ''], (err, result) => {
        if (err) throw err;
        if (!result.length) {
            res.send({ msg: 'error', status: 1 }); // user not logged
        } else {
            if ('admin' === req.query.role) {
                if (result[0].role !== 10) {
                    res.send({ msg: 'error', status: 2 }); // not an admin
                } else {
                    res.send({ msg: 'ok', status: 3 }); // is admin
                }
            } else {
                res.send({ msg: 'ok', status: 4 }); // is user
            }
        }
    });
});

app.post("/login", (req, res) => {
    const key = uuid.v4();
    const sql = `
    UPDATE users
    SET session = ?
    WHERE name = ? AND psw = ?
  `;
    con.query(sql, [key, req.body.user, md5(req.body.pass)], (err, result) => {
        if (err) throw err;
        if (!result.affectedRows) {
            res.send({ msg: 'error', key: '' });
        } else {
            res.send({ msg: 'ok', key, text: 'Good to see you ' + req.body.user + ' again.', type: 'info' });
        }
    });
});

app.post("/register", (req, res) => {
    const key = uuid.v4();
    const sql = `
    INSERT INTO users (name, psw, session)
    VALUES (?, ?, ?)
  `;
    con.query(sql, [req.body.name, md5(req.body.pass), key], (err, result) => {
        if (err) throw err;
        res.send({ msg: 'ok', key, text: 'Welcome!', type: 'info' });
    });
});
//////////////////LOGIN END///////////////////////////

app.listen(port, () => {
    console.log(`shipments in ${port} port!`)
});

//create
app.post("/containers", (req, res) => {
    const sql = `
    INSERT INTO containers (size, number)
    VALUES (?, ?)
    `;
    con.query(sql, [req.body.size, req.body.number], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.post("/parcels", (req, res) => {
    const sql = `
    INSERT INTO parcels (name, weight, image, flammable, perishable, container_id)
    VALUES (?, ?, ?, ?, ?, ?)
    `;
    con.query(sql, [req.body.name, req.body.weight, req.body.image, req.body.flamable, req.body.expiration, req.body.container_id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get("/parcels", (req, res) => {
    const sql = `
    SELECT *
    FROM parcels
    ORDER BY id 
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get("/containers", (req, res) => {
    const sql = `
    SELECT *
    FROM containers
    ORDER BY id 
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
//choose container from list
app.get("/parcels", (req, res) => {
    const sql = `
    SELECT containers.*, parcels.*
    FROM containers
    LEFT JOIN parcels
    ON parcels.container_id = containers.id
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.get("/containers/list", (req, res) => {
    const sql = `
    SELECT *
    FROM containers
    WHERE size = 'S' AND boxes_inside < 2 OR
          size = 'M' AND boxes_inside < 4 OR
          size = 'L' AND boxes_inside < 6
    `;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
//EDIT
app.put("/containers/:id", (req, res) => {
    const sql = `
    UPDATE containers
    SET size = ?, number =?
    WHERE id = ?
    `;
    con.query(sql, [req.body.size, req.body.number, req.params.id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

app.put("/parcels/:id", (req, res) => {
    const sql = `
    UPDATE parcels
    SET name = ?, weight = ?, image = ?, flammable = ?, perishable = ?, container_id =?
    WHERE id = ?
    `;
    con.query(sql, [req.body.name, req.body.weight, req.body.image, req.body.flamable, req.body.expiration, req.container_id, req.params.id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

//DELETE
app.delete("/containers/:id", (req, res) => {
    const sql = `
    DELETE FROM containers
    WHERE id = ?
    `;
    con.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});
