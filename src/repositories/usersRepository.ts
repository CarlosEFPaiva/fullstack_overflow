import { newUser } from '../controllers/protocols/newUser';
import connection from '../database';

interface receivedUser extends newUser {
    token: string,
}

interface savedUser extends receivedUser {
    id: number,
}

export async function upsert(user: receivedUser): Promise<savedUser> {
    const {
        name,
        className,
        token,
    } = user;

    const savedStudent = (await connection.query(`
        SELECT 
            students.id,
            students.name,
            students.token,
            classes.name AS "className"
        FROM students
        JOIN classes
            ON students.class_id = classes.id
        WHERE students.name = $1;
    `, [name])).rows[0];

    if (savedStudent) {
        if (savedStudent.className !== className) {
            // throw error incorrect class
        }
        return savedStudent;
    }

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
