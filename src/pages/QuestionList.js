import React, { useEffect, useState } from "react";   //React, 훅 import
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material'; // MUI 컴포넌트 import
import axios from 'axios'; // 데이터 통신용 Axios import
import Pagination from "@mui/material/Pagination"; // 페이지네이션 컴포넌트 import

function QuestionList() {
    const [questions, setQuestions] = useState([]); // 질문 목록 상태
    const [page, setPage] = useState(1); // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태

    axios.defaults.baseURL = 'http://localhost:8080';


    // 서버로부터 질문 목록을 가져오는 함수 (Axios 사용)
    const fetchQuestions = async (page) => {
        try {
            const response = await axios.get(`api/questions/view?page=${page}`);
            setQuestions(response.data.questions);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error("Failed to fetch questions", error);
        }
    };
    // 페이지나 다른 의존성이 변경될 때마다 질문 목록을 가져오는 함수 호출
    useEffect(() => {
        fetchQuestions(page);
    }, [page]);

    // 페이지네이션에서 페이지가 변경될 때 실행되는 함수
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>번호</TableCell>
                        <TableCell>질문</TableCell>
                        <TableCell>추천 여부</TableCell>
                        <TableCell>해결 여부</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {questions.map((question) => (
                        <TableRow key={question.id}>
                            <TableCell>{question.id}</TableCell>
                            <TableCell>
                                <Button href={`/questions/${question.id}`}>{question.content}</Button>
                            </TableCell>
                            <TableCell>{question.isRecommended ? '필독' : '일반'}</TableCell>
                            <TableCell>{question.isSolved ? '해결됨' : '미해결'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                style={{ marginTop: '20px', justifyContent: 'center', display: 'flex' }}
            />
        </TableContainer>
    );
}

export default QuestionList;