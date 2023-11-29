import React, { useState, useEffect } from "react";
import QuestionTableComponent from "./QuestionTableComponent";
import "../../css/MyPage.css";
import axios from 'axios'

const MyWrongQuestion = () => {
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [questionList, setQuestionList] = useState([]);
  const [ totalPages, setTotalPages]=useState(0);
  useEffect(() => {
    const userPk = localStorage.getItem('access');
    const params = {
      page: 1,
      pageSize: 8,
    };
    axios
      .get(`/api/v1/question/wrong`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access')}`
        },
        params
      })
      .then(response => {
        console.log("wrongQuestion",response.data)
        setQuestionList(response.data);
        setTotalPages(
          response.data[0].cnt % 8 > 0
            ? Math.floor(response.data[0].cnt / 8) + 1
            : response.data[0].cnt / 8
        );
        console.log(response.data[0].cnt)
        console.log("totalPages",totalPages)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
  const getList = (paging) =>{

    const params = {
      page: paging,
      pageSize: 8,
    };
    axios
      .get(`/api/v1/question/wrong`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
        params,
      })
      .then((response) => {
        console.log(response.data)
        setQuestionList(response.data);
        console.log(typeof questionList)
      })
      .catch((error) => {
        console.error(error);
      });

  }
  const handlePrevClick = () => {
    if (currentPage > 1) {
      getList(currentPage-1)
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      getList(currentPage+1)
      setCurrentPage(currentPage + 1);
    }
  };

  const onClick = (n) => {
    setCurrentPage(n)
    getList(n)
  }

  return (
    <>
      <div className="mypageMain">
        <div className="question-wrapper">
          <table className="mypage-question-table">
            <thead>
              <tr>
                <th className="mypage-question-number">No.</th>
                <th className="mypage-question-name">문제이름</th>
                <th className="mypage-question-description">설명</th>
                <th className="mypage-question-grade">난이도</th>
              </tr>
            </thead>
            <tbody>
              <QuestionTableComponent questions={questionList} />
            </tbody>
          </table>
        </div>
        <div className="mypage-paging">
          <button onClick={handlePrevClick}>&lt;</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => onClick(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button onClick={handleNextClick}>&gt;</button>
        </div>
      </div>
    </>
  );
};

export default MyWrongQuestion;
