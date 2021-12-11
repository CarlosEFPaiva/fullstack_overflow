import { receivedUser, savedUser, userParameters } from '../protocols/users';
import connection from '../database';

export async function getUser(params: userParameters): Promise<savedUser> {
    const {
        token,
        name,
    } = params;
    let queryText = `
        SELECT 
            students.id,
            students.name,
            students.token,
            classes.name AS "className"
        FROM students
        JOIN classes
            ON students.class_id = classes.id
        WHERE 1 = 1`;
    const queryParams = [];

    if (token) {
        queryParams.push(token);
        queryText += ` AND students.token = $${queryParams.length}`;
    }

    if (name) {
        queryParams.push(name);
        queryText += ` AND students.name = $${queryParams.length}`;
    }

    return (await connection.query(`${queryText};`, queryParams)).rows[0];
}

export async function upsert(user: receivedUser): Promise<savedUser> {
    const {
        name,
        className,
        token,
    } = user;

    const upsertedClassId: number = (await connection.query(`
        WITH existing_class AS (
            INSERT INTO classes
                (name)
            VALUES
                ($1)
            ON CONFLICT DO NOTHING
            RETURNING id
        )
        SELECT id FROM existing_class
        UNION ALL
        SELECT id
        FROM classes
        WHERE name = $1 
            AND NOT EXISTS (SELECT 1 FROM existing_class)
    ;`, [className])).rows[0].id;

    const insertedStudent = (await connection.query(`
        INSERT INTO students
            (name, class_id, token)
        VALUES
            ($1, $2, $3)
        RETURNING *
    ;`, [name, upsertedClassId, token])).rows[0];

    return insertedStudent;
}
