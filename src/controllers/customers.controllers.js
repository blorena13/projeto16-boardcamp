import { db } from "../database/database.connection.js";

export async function getCustumers(req, res) {
    try {
        const clientes = await db.query(`SELECT * FROM customers;`);
        res.send(clientes.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function getCustumersById(req, res) {
    const { id } = req.params;
    try {
        const clientesId = await db.query(`SELECT * FROM customers WHERE id=$1;`, [id]);
        res.send(clientesId.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function postCustumers(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
        const clientes = await db.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, $2, $3, $4);`, [name, phone, cpf, birthday]);
        res.sendStatus(201);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function newCustumers(req, res) {
    try {
        const clientes = await db.query(`UPDATE customers   where id=$1;`, [id]);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send(err.message);
    }
}