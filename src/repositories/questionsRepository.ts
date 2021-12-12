import connection from '../database';
import QuestionError from '../errors/QuestionError';
import { answerParams, getParams, questionToSave, savedQuestion } from '../protocols/questions';

export async function getQuestions(getQuestionParams: getParams): Promise<savedQuestion[]> {
    const {
        questionId,
        unanswered,
    } = getQuestionParams;
    const queryParams = [];
    let queryText = `
        SELECT
            id,
            question,
            student,
            "className",
            "submitAt",
            answer,
            "answeredAt",
            "answeredBy",
            array_to_string(array_agg(distinct "tag"), ', ') AS tags
        FROM
            (SELECT
                questions.id,
                questions.question,
                asked_by.name AS "student",
                classes.name AS "className",
                questions.submitted AS "submitAt",
                questions.answer,
                questions.answered_at AS "answeredAt",
                answered_by.name AS "answeredBy",
                tags.name AS "tag"
            FROM
                questions
            JOIN questions_and_tags 
                ON questions_and_tags.question_id = questions.id
            JOIN tags 
                ON questions_and_tags.tag_id = tags.id
            JOIN students asked_by
                ON asked_by.id = questions.asked_by_id
            JOIN classes
                ON asked_by.class_id = classes.id
            LEFT OUTER JOIN students answered_by
                ON answered_by.id = questions.answered_by_id) AS aux
            WHERE 1 = 1`;
    if (questionId) {
        queryParams.push(questionId);
        queryText += `AND id = $${queryParams.length}`;
    }
    if (unanswered) {
        queryText += 'AND answer IS NULL';
    }

    queryText += `
        GROUP BY
            id,
            question,
            student,
            "className",
            "submitAt",
            answer,
            "answeredAt",
            "answeredBy"
    ;`;

    const result = await connection.query(queryText, queryParams);

    return result.rows;
}

async function insertTags(tags:string[]) {
    let queryText = `
        INSERT INTO tags
            (name)
        VALUES
        `;
    tags.forEach((tag, index) => {
        queryText += ` ($${index + 1})`;
        if (index !== tags.length - 1) {
            queryText += ' , ';
        }
    });
    queryText += ' ON CONFLICT DO NOTHING;';
    await connection.query(queryText, tags);
}

async function insertQuestion(receivedQuestion: questionToSave): Promise<savedQuestion> {
    const {
        question,
        studentId,
    } = receivedQuestion;
    const now = new Date();

    const insertedQuestion = (await connection.query(`
        INSERT INTO questions
            (question, asked_by_id, submitted)
        VALUES
            ($1, $2, $3)
        ON CONFLICT DO NOTHING
        RETURNING *
    ;`, [question, studentId, now])).rows[0];
    return insertedQuestion;
}

async function insertTagRelations(questionId: number, listOfTags: string[]) {
    let queryText = `
        INSERT INTO questions_and_tags
            (question_id, tag_id)
        VALUES
        `;
    listOfTags.forEach((tag, index) => {
        queryText += `($1, (SELECT id FROM tags WHERE name = $${index + 2}))`;
        if (index !== listOfTags.length - 1) {
            queryText += ' , ';
        }
    });
    await connection.query(`${queryText};`, [questionId, ...listOfTags]);
}

export async function add(receivedQuestion: questionToSave) {
    const { listOfTags } = receivedQuestion;

    await insertTags(listOfTags);
    const insertedQuestion = await insertQuestion(receivedQuestion);
    if (!insertedQuestion) {
        throw new QuestionError({
            name: 'QuestionAlreadyExists',
            message: 'Esta pergunta já existe!',
        });
    }
    await insertTagRelations(insertedQuestion.id, listOfTags);
    return insertedQuestion;
}

export async function answerQuestion(receivedAnswer: answerParams): Promise<savedQuestion> {
    const {
        answer,
        user,
        questionId,
    } = receivedAnswer;
    const now = new Date();
    const result = await connection.query(`
        UPDATE questions 
        SET
            answer = $1,
            answered_by_id = $2,
            answered_at = $3
        WHERE
            id = $4
        AND
            asked_by_id <> $2    
        AND
            answer IS NULL
        RETURNING *
        ;`, [answer, user.id, now, questionId]);
    return result.rows[0];
}
