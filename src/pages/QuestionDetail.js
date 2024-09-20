import React from "react";
import axios from 'axios';
import { Paper, Typography, List, ListItem } from '@mui/material';

function QuestionDetail({ match }) {
    const [question, setQuestion] = useState(null);
    const [answers, setAnswers] = useState([]);

    axios.defaults.baseURL = 'http://localhost:8080';

    useEffect(() => {
        const fetchQuestionAndAnwers = async () => {
            try {
                const questionId = match.params.id;
                const questionResponse = await axios.get(`/api/questions/${questionId}`);
                const answersResponse = await axios.get(`/api/answers/${questionId}`);
                setQuestion(questionResponse.data);
                setAnswers(answersResponse.data);
            } catch (error) {
                consolw.error("Failed to fetch question or answers", error);
            }
        };

        fetchQuestionAndAnwers();
    }, [match.params.id]);

    if (!question) return <div>Loading...</div>

    return (
        <Paper style={{ padding: '20px' }}>
            <Typography variant="h4">{question.content}</Typography>
            <Typography variant="subtitle1">작성 날짜: {new Date(question.created_at).toLocaleDateString()}</Typography>  {/* 작성 날짜 표시 */}
            <Typography variant="h5" style={{ marginTop: '20px' }}>답변</Typography>  {/* 답변 섹션 제목 */}
            <List>
                {answers.map((answer) => (
                    <ListItem key={answer.id}>
                        <Typography>{answer.content}</Typography>  {/* 답변 내용 */}
                        <Typography variant="caption">{new Date(answer.created_at).toLocaleDateString()}</Typography>  {/* 답변 작성 날짜 */}
                    </ListItem>
                ))}
            </List>
        </Paper>
    );
}

export default QuestionDetail;