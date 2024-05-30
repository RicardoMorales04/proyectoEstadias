import mysql from "serverless-mysql"

export const conn = mysql({
    config:{
        host: 'localhost',
        user: 'root',
        password: '',
        port: 3306,
        database: 'taller_IA'
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