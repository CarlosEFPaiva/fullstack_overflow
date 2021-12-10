import connection from '../database';
import { newQuestion } from '../controllers/protocols/newQuestions';

interface questionToSave {
    question: string,
    studentId: number,
    listOfTags: string[],
}

interface savedQuestion extends newQuestion {
    id: number,
    submitAt: string,
    answer?: string,
    answeredBy?: string,
    answeredAt?: string,
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

    const insertedQuestion = (await connection.query(`
        INSERT INTO questions
            (question, asked_by_id)
        VALUES
            ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING *
    ;`, [question, studentId])).rows[0];
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
    return connection.query(`${queryText};`, [questionId, ...listOfTags]);
}

export async function add(receivedQuestion: questionToSave) {
    const { listOfTags } = receivedQuestion;

    await insertTags(listOfTags);
    const insertedQuestion = await insertQuestion(receivedQuestion);
    if (!insertedQuestion) {
        // throw error
    }
    await insertTagRelations(insertedQuestion.id, listOfTags);
    return insertedQuestion;
}
