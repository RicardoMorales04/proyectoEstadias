import mysql from "serverless-mysql";

export const conn = mysql({
    config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: process.env.DB_DATABASE
    }
});

export const query = async (q, values) => {
    try {
        const results = await conn.query(q, values);
        await conn.end();
        return results;
    } catch (e) {
        throw Error(e.message);
    }
};
