import { db } from "../database/database.connection.js";

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(
            `
            SELECT rentals.*, games.name AS "gamesName" , games.id AS "gamesId", customers.name AS "customersName", customers.id AS "customersId"
            FROM rentals
            JOIN customers ON customers.id = rentals."customerId"
            JOIN games ON games.id = rentals."gameId";`);

        const finalRentals = {
            ...rentals.rows[0],
            customer: rentals.rows.map(rec => ({id: rec.customersId , name: rec.customersName})),
            game: rentals.rows.map(rec => ({id: rec.gamesId, name: rec.gamesName}))
        }
        delete finalRentals.gamesName;
        delete finalRentals.customersName;
        delete finalRentals.customersId;
        delete finalRentals.gamesId;
        res.send(finalRentals);

    } catch (err) {
        res.status(500).send(err.message);

    }
}

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;
    try {
        const customerExists = await db.query(`SELECT * FROM customers WHERE id =$1;`, [customerId]);
        if(customerExists.rows.length === 0){
            return res.status(400).send("Cliente não existente.");   
        }

        const gameExists = await db.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);
        if(gameExists.rows.length === 0){
            return res.status(400).send("Jogo não existente.")
        }

        const rentalsINProgress = await db.query(`SELECT COUNT (*) FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL;`, [gameId]);
        const gameStockTotal = gameExists.rows[0].stockTotal;
        if(rentalsINProgress.rows[0].count >= gameStockTotal){
            return res.status(400).send("Não há jogos disponíveis para aluguel.");
        }

        const rentDate = new Date();
        const originalPrice = daysRented * gameExists.rows[0].pricePerDay;

        await db.query(`
        INSERT INTO rentals ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") 
        VALUES ($1, $2, $3, $4, $5, NULL, NULL);`, 
        [customerId, gameId, daysRented, rentDate, originalPrice]);
        res.sendStatus(201);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function finalRentals(req, res) {
    try {

    } catch (err) {

    }

}

export async function deleteRentals(req, res) {
    const {id} = req.params;
    try {
        const idExists = db.query(`SELECT * FROM rentals WHERE id=$1`,[id]);
        if((await idExists).rows.length === 0){
            return res.status(404).send("Id não existe.")
        }

    } catch (err) {

    }
}