import { db } from "../database/database.connection.js";

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(
            `
            SELECT rentals.*, games.name AS "gamesName" , games.id AS "gamesId", customers.name AS "customersName", customers.id AS "customersId"
            FROM rentals
            JOIN customers ON customers.id = rentals."customerId"
            JOIN games ON games.id = rentals."gameId";`);


        const finalRentals = rentals.rows.map(rec => {
            const { gamesName, customersName, customersId, gamesId, ...rest } = rec;
            return {
                ...rest,
                customer: { id: customersId, name: customersName },
                game: { id: gamesId, name: gamesName }
            };
        });

        res.send(finalRentals);

    } catch (err) {
        res.status(500).send(err.message);

    }
}

export async function postRentals(req, res) {
    const { customerId, gameId, daysRented } = req.body;

    if (daysRented <= 0) {
        return res.sendStatus(400);
    }
    try {
        const customerExists = await db.query(`SELECT * FROM customers WHERE id =$1;`, [customerId]);
        if (customerExists.rows.length === 0) {
            return res.status(400).send("Cliente não existente.");
        }

        const gameExists = await db.query(`SELECT * FROM games WHERE id=$1;`, [gameId]);
        if (gameExists.rows.length === 0) {
            return res.status(400).send("Jogo não existente.")
        }

        const rentalsINProgress = await db.query(`SELECT COUNT (*) FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL;`, [gameId]);
        const gameStockTotal = gameExists.rows[0].stockTotal;
        if (rentalsINProgress.rows[0].count >= gameStockTotal) {
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
    const { id } = req.params;
    try {
        const rental = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);
        if (rental.rows.length === 0) {
            return res.sendStatus(404);
        }

        const existingRental = rental.rows[0];
        if (existingRental.returnDate) {
            return res.sendStatus(400);
        }

        const createDate = new Date();
        const year = createDate.getFullYear();
        const month = String(createDate.getMonth()+1).padStart(2, '0');
        const day = String(createDate.getDate()).padStart(2, '0');
        const returnDate = `${year}/${month}/${day}`;
        
        const rentDate = existingRental.rentDate;
        const daysRented = existingRental.daysRented;
        const gamePricePerDay = existingRental.gamePricePerDay;

        const delayInDays = Math.ceil((returnDate - rentDate) / (1000 * 60 * 60 * 24)) - daysRented;
        const delayFee = Math.max(0, delayInDays) * gamePricePerDay;

        await db.query(`
        UPDATE rentals
        SET "returnDate" = $1, "delayFee" = $2
        WHERE id = $3;
`, [returnDate, delayFee, id]);

        return res.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }

}

export async function deleteRentals(req, res) {
    const { id } = req.params;
    try {
        const idExists = await db.query(`SELECT * FROM rentals WHERE id=$1;`, [id]);
        if (idExists.rows.length === 0) {
            return res.sendStatus(404);
        }

        const existingRental = rental.rows[0];
        if (existingRental.returnDate) {
            return res.sendStatus(400);
        }

        await db.query(`DELETE FROM rentals WHERE id=$1;`, [id]);
        return req.sendStatus(200);

    } catch (err) {
        res.status(500).send(err.message);
    }
}