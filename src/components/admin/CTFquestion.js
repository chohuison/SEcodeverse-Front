import React, { useState, useEffect } from "react";
import "../../css/AdminCTFQuestion.css";
import "../../css/AdminCTFEnrollQuestion.css";
import QuestionTableComponent from "./QuestionTableComponent";
import axios from "axios";
const CTFquestion = () => {
  const [isCreateQuestion, setIsCreateQuestion] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [scoreValue, setScoreValue] = useState(0);
  const [leaguePk, setLeaguePk] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [content, setContent] = useState("");
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState([]);
  const [totalPages, setTotalpages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("HIGH");

  //수정
  const [isEdit, setIsEdit] = useState(false);
  const [selectQ, setSelctQ] = useState(false);

  useEffect(() => {
    const apiUrl = `${process.env.REACT_APP_DB_HOST}` + "/api/v1/ctf/question/";
    const page = 1;
    const params = {
      page: page,
      pageSize: 10,
      sort: sortType,
    };
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `${apiUrl}?${queryString}`;

    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setQuestion(response.data.list);
        setTotalpages(
          response.data.cnt % 10 > 0
            ? response.data.cnt / 10 + 1
            : response.data.cnt / 10
        );
        console.log(question);
        if (totalPages < 1) {
          setTotalpages(1);
        }
        console.log("ctfQuestion의", totalPages);
      })
      .catch((error) => {
        console.error("API 호출 중 에러:", error);
      });
  }, []);

  const buttonClick = (n) => {
    getQuestionList(n);
    setCurrentPage(n);
  };
  const handlePrevClick = () => {
    if (currentPage > 1) {
      const pagiging = currentPage - 1;
      getQuestionList(pagiging);
      setCurrentPage(pagiging);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      const pagiging = currentPage + 1;
      getQuestionList(pagiging);
      setCurrentPage(pagiging);
    }
  };
  const categoryhigh = () => {
    console.log("점수높은순 클릭됨");
    changeOrder("점수 높은순");
    setSortType("HIGH");
    getQuestionHigh("HIGH");
  };
  const categoryLow = () => {
    console.log("점수 낮은순 클릭됨");
    changeOrder("점수 낮은순");
    setSortType("LOW");
    getQuestionHigh("LOW");
  };
  const getQuestionHigh = (sortType) => {
    console.log(sortType);
    const apiUrl = `${process.env.REACT_APP_DB_HOST}` + "/api/v1/ctf/question/";
    const page = 1;
    const params = {
      page: page,
      pageSize: 10,
      sort: sortType,
    };
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `${apiUrl}?${queryString}`;

    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((response) => {
        console.log("문제 리스트는", response.data);
        setQuestion(response.data.list);
      })
      .catch((error) => {
        console.error("API 호출 중 에러:", error);
      });
  };
  const getQuestionList = (paging) => {
    console.log(sortType);
    const apiUrl = `${process.env.REACT_APP_DB_HOST}` + "/api/v1/ctf/question/";
    const page = paging;
    const params = {
      page: page,
      pageSize: 10,
      sort: sortType,
    };
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");

    const url = `${apiUrl}?${queryString}`;

    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((response) => {
        console.log("문제 리스트는", response.data);
        setQuestion(response.data.list);
      })
      .catch((error) => {
        console.error("API 호출 중 에러:", error);
      });
  };

  const handleLeaguePk = (e) => {
    setLeaguePk(e.target.value);
  };
  const hadnleTitleInputChange = (e) => {
    setTitleValue(e.target.value);
  };
  const handleScoreChange = (e) => {
    setScoreValue(e.target.value);
  };
  const handleOptionChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleContnentChange = (e) => {
    setContent(e.target.value);
  };
  const handleAnserChange = (e) => {
    setAnswer(e.target.value);
  };
  const [selectedCategory, setSelectedCategory] = useState("1");

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    console.log("카테고리 변경됨", e.target.value);
  };

  const onCTFQuestionRegister = async () => {
    console.log("사용자가 올린 파일 수는", selectedFiles);
    var imgUrl = [];
    if (selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        const uploadFile = selectedFiles[i];

        console.log(uploadFile);
        try {
          const presignedResponse = await axios.post(
            `${process.env.REACT_APP_DB_HOST}` + "/api/v1/s3/presigned",
            {
              imageName: uploadFile.name,
              folderName: "ctf",
            },
            {
              headers: {
                Authorization: localStorage.getItem("accessToken"),
              },
            }
          );

          const presignedUrl = presignedResponse.data.presigned_url;
          console.log("presignedUrl:", presignedUrl);
          console.log(uploadFile.type);
          console.log(uploadFile.name);

          const uploadResponse = await axios.put(presignedUrl, uploadFile, {
            headers: {
              "Content-Type": uploadFile.type,
            },
          });

          console.log("S3 업로드 성공", uploadResponse);

          const imageUrl = uploadResponse.request.responseURL;
          var fileName = "";
          if (uploadFile.type == "image/jpg") {
            fileName = imageUrl.substring(0, imageUrl.lastIndexOf(".jpg") + 4);
          } else if (uploadFile.type == "image/png") {
            fileName = imageUrl.substring(0, imageUrl.lastIndexOf(".png") + 4);
          } else if (uploadFile.type == "image/jpeg") {
            fileName = imageUrl.substring(0, imageUrl.lastIndexOf(".jpg") + 4);
          }
          console.log(imageUrl);
          console.log(fileName);
          imgUrl.push(fileName);
        } catch (error) {
          console.error("S3 업로드 실패", error);
        }
      }
    }
    var imgList = [];
    for (let i = 0; i < imgUrl.length; i++) {
      imgList.push({ imgUrl: imgUrl[i] });
      console.log("imgList넣을게");
    }
    console.log("imgUrl", imgUrl);
    console.log("imgList", imgList);

    var data = [];
    var questionType = "";
    if (selectedType === "objective") {
      questionType = "OBJECTIVE";
    } else {
      questionType = "SUBJECTIVE";
    }
    if (imgUrl.length > 0) {
      data = {
        leaguePk: leaguePk,
        categoryPk: selectedCategory,
        ctfQuestionType: questionType,
        name: titleValue,
        score: scoreValue,
        description: content,
        answer: answer,
        imgList: imgList, // imgUrl이 있는 경우 imgList를 추가합니다.
      };
    } else {
      data = {
        leaguePk: leaguePk,
        categoryPk: selectedCategory,
        ctfQuestionType: questionType,
        name: titleValue,
        score: scoreValue,
        description: content,
        answer: answer,
      };
    }

    axios
      .post(
        `${process.env.REACT_APP_DB_HOST}` + "/api/v1/admin/ctf/question",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      )
      .then((response) => {
        console.log(localStorage.getItem("access"));
        console.log(response.data);
      })
      .catch((error) => {
        console.error("리그 등록중 에러:", error);
      });
    setIsCreateQuestion(!isCreateQuestion);
  };

  const toggleCreateQuestion = () => {
    setIsCreateQuestion(!isCreateQuestion);
  };

  const toggleModifyQuestion = (questionIndex) => {
    setIsEdit(!isEdit);
    const questionPk = question.at(questionIndex).questionPk;
    questionDetail(questionPk);
    setSelectedCategory(selectQ.categoryPk);
  };
  // categoryName
  // :
  // "운영체제"
  // ctfQuestionType
  // :
  // "SUBJECTIVE"
  // description
  // :
  // "두 개 이상의 작업이 서로 상대방의 작업이 끝나기 만을 기다리고 있기 때문에 결과적으로 아무것도 완료되지 못하는 상태인 것을 뭐라고 할까요?"
  // imgUrlList
  // :
  // []
  // questionName
  // :
  // "다음 설명에 대한 답을 적으세요."
  // score
  // :
  // 5
  //문제리스트에서 questionPk는 value.questionPk로 접근하면됨
  const questionDetail = (questionPk) => {
    const url1 =
      `${process.env.REACT_APP_DB_HOST}` + `/api/v1/ctf/question/${questionPk}`;

    axios
      .get(url1, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setSelctQ(response.data);
      })
      .catch((error) => {
        console.error("API 호출 중 에러:", error);
      });
  };

  // accrodian
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("점수 높은순");

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const changeOrder = (option) => {
    setSelectedOption(option);
    setIsOpen(false); // 옵션을 선택한 후 아코디언을 닫음
  };

  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    console.log("selectedFiles", selectedFiles);
  };

  return (
    <>
      <div className="admin-main-board-right">
        <div className="admin-question-board-wrapper">
          <h1 className="admin-question-board-rightMain">CTF 문제 관리</h1>
          <div className="admin-question-board-topBar">
            <div name="admin-question-board-category-accordion-wrap">
              <div
                className="admin-question-accordion-header"
                onClick={toggleAccordion}
              >
                <sapn className="ctf-question-board-search-order-text">
                  {selectedOption}
                </sapn>
                <sapn className="ctf-question-board-search-order-icon">
                  {isOpen ? "▲" : "▼"}
                </sapn>
              </div>
              {isOpen && (
                <div className="ctf-question-accordion-content">
                  <div
                    className="ctf-question-board-search-order-text "
                    onClick={categoryhigh}
                  >
                    점수높은순
                  </div>
                  <div
                    className="ctf-question-board-search-order-text "
                    onClick={categoryLow}
                  >
                    점수낮은순
                  </div>
                </div>
              )}
            </div>
            <div className="admin-question-board-create-question">
              <span onClick={toggleCreateQuestion}>문제 생성</span>
            </div>
          </div>
          <div className="admin-question-board-table">
            <table className="admin-question-table">
              <thead>
                <tr>
                  <th className="admin-question-table-number">No.</th>
                  <th className="admin-question-table-name">문제 이름</th>
                  <th className="admin-question-table-score">점수</th>
                  <th className="admin-question-table-category">카테고리</th>
                  <th className="admin-question-table-modify"></th>
                  <th className="admin-question-table-delete"></th>
                </tr>
              </thead>
              <tbody>
                {question &&
                  question.map((value, index) => (
                    <QuestionTableComponent
                      key={index}
                      value={value}
                      toggleCreateQuestion={() => toggleModifyQuestion(index)}
                    />
                  ))}
              </tbody>
            </table>
          </div>

          <div className="community-paging">
            <button onClick={handlePrevClick}>&lt;</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => buttonClick(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button onClick={handleNextClick}>&gt;</button>
          </div>
        </div>
        {isEdit && (
          <div className="ctf-question-edit-popup-container">
            <div className="ctf-question-edit-popup-wrapper">
              <div className="ctf-question-edit-popup-title-box">
                <span className="ctf-question-edit-popup-title">
                  CTF 문제 수정
                </span>
                <div
                  className="ctf-question-edit-popup-cancel"
                  onClick={()=>setIsEdit(!isEdit)}
                ></div>
              </div>
              <div className="ctf-question-edit-popup-contents-box">
                <div className="ctf-question-edit-popup-contents-title-box">
                  <span className="ctf-question-edit-popup-contents-title">
                    문제 이름
                  </span>
                  <input
                    className="ctf-question-edit-popup-contents-title-input"
                    type="text"
                    value={selectQ.questionName}
                    onChange={hadnleTitleInputChange}
                  />
                </div>
                <div className="ctf-question-edit-popup-contents-middle-box">
                  <span className="ctf-question-edit-popup-contents-score">
                    문제 점수
                  </span>
                  <input
                    className="ctf-question-edit-popup-contents-score-input"
                    type="number"
                    value={selectQ.score}
                    onChange={handleScoreChange}
                  />
                  <span className="ctf-question-edit-popup-contents-score">
                    리그 pk
                  </span>
                  <input
                    className="ctf-question-edit-popup-contents-score-input"
                    type="number"
                    value={selectQ.leaguePk}
                    onChange={handleLeaguePk}
                  />
                  <span className="ctf-question-edit-popup-contents-category">
                    카테고리
                  </span>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="1">컴퓨터 네트워크</option>
                    <option value="2">웹</option>
                    <option value="3">자료구조</option>
                    <option value="4">SQL</option>
                    <option value="5">JSP</option>
                    <option value="6">컴퓨터 언어</option>
                    <option value="7">운영체제</option>
                    <option value="8">인공지능</option>
                    <option value="9">UML</option>
                    <option value="10">IoT</option>
                    <option value="11">모바일</option>
                    <option value="12">정보보안</option>
                    <option value="13">빅데이터</option>
                    <option value="14">기초지식</option>
                    <option value="15">데이터베이스</option>
                  </select>
                  <span className="ctf-question-edit-popup-contents-radio">
                    객관식
                  </span>
                  <input
                    className="ctf-question-edit-popup-contents-radio-option"
                    type="radio"
                    value="objective"
                    checked={selectedType === "objective"}
                    onChange={handleOptionChange}
                  />
                  <span className="ctf-question-edit-popup-contents-radio">
                    주관식
                  </span>
                  <input
                    className="ctf-question-edit-popup-contents-radio-option"
                    type="radio"
                    value="subjective"
                    checked={selectedType === "subjective"}
                    onChange={handleOptionChange}
                  />
                </div>
                <div className="ctf-question-edit-popup-contents-description-box">
                  <span className="ctf-question-edit-popup-contents-description">
                    문제 설명
                  </span>
                  <textarea
                    className="ctf-question-edit-popup-contents-description-input"
                    value={selectQ.description}
                    onChange={handleContnentChange}
                  />
                </div>
                <div className="ctf-question-edit-popup-contents-answer-box">
                  <span className="ctf-question-edit-popup-contents-answer">
                    문제 답안
                  </span>
                  <textarea
                    className="ctf-question-edit-popup-contents-answer-input"
                    value={selectQ.answer}
                    onChange={handleAnserChange}
                  />
                </div>
                <div className="ctf-question-edit-popup-contents-button-wrapper">
                  <div
                    className="ctf-question-edit-popup-contents-button"
                    onClick={onCTFQuestionRegister}
                  >
                    확인
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {isCreateQuestion && (
          <div className="ctf-question-edit-popup-container">
            <div className="ctf-question-edit-popup-wrapper">
              <div className="ctf-question-edit-popup-title-box">
                <span className="ctf-question-edit-popup-title">
                  CTF 문제 생성
                </span>
                <div
                  className="ctf-question-edit-popup-cancel"
                  onClick={toggleCreateQuestion}
                ></div>
              </div>
              <div className="ctf-question-edit-popup-contents-box">
                <div className="ctf-question-edit-popup-contents-title-box">
                  <span className="ctf-question-edit-popup-contents-title">
                    문제 이름
                  </span>
                  <input
                    className="ctf-question-edit-popup-contents-title-input"
                    type="text"
                    onChange={hadnleTitleInputChange}
                  />
                </div>
                <div className="ctf-question-edit-popup-contents-middle-box">
                  <span className="ctf-question-edit-popup-contents-score">
                    문제 점수
                  </span>
                  <input
                    className="ctf-question-edit-popup-contents-score-input"
                    type="number"
                    onChange={handleScoreChange}
                  />
                  <span className="ctf-question-edit-popup-contents-score">
                    리그 pk
                  </span>
                  <input
                    className="ctf-question-edit-popup-contents-score-input"
                    type="number"
                    onChange={handleLeaguePk}
                  />
                  <span className="ctf-question-edit-popup-contents-category">
                    카테고리
                  </span>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="1">컴퓨터 네트워크</option>
                    <option value="2">웹</option>
                    <option value="3">자료구조</option>
                    <option value="4">SQL</option>
                    <option value="5">JSP</option>
                    <option value="6">컴퓨터 언어</option>
                    <option value="7">운영체제</option>
                    <option value="8">인공지능</option>
                    <option value="9">UML</option>
                    <option value="10">IoT</option>
                    <option value="11">모바일</option>
                    <option value="12">정보보안</option>
                    <option value="13">빅데이터</option>
                    <option value="14">기초지식</option>
                    <option value="15">데이터베이스</option>
                  </select>
                  <span className="ctf-question-edit-popup-contents-radio">
                    객관식
                  </span>
                  <input
                    className="ctf-question-edit-popup-contents-radio-option"
                    type="radio"
                    value="objective"
                    checked={selectedType === "objective"}
                    onChange={handleOptionChange}
                  />
                  <span className="ctf-question-edit-popup-contents-radio">
                    주관식
                  </span>
                  <input
                    className="ctf-question-edit-popup-contents-radio-option"
                    type="radio"
                    value="subjective"
                    checked={selectedType === "subjective"}
                    onChange={handleOptionChange}
                  />
                </div>
                <div className="ctf-question-edit-popup-contents-description-box">
                  <span className="ctf-question-edit-popup-contents-description">
                    문제 설명
                  </span>
                  <textarea
                    className="ctf-question-edit-popup-contents-description-input"
                    value={content}
                    onChange={handleContnentChange}
                  />
                </div>
                <div className="ctf-question-edit-popup-contents-answer-box">
                  <span className="ctf-question-edit-popup-contents-answer">
                    문제 답안
                  </span>
                  <textarea
                    className="ctf-question-edit-popup-contents-answer-input"
                    value={answer}
                    onChange={handleAnserChange}
                  />
                </div>
                <div className="ctf-question-edit-popup-contents-img-box">
                  <input
                    className="ctf-question-edit-popup-contents-input-file"
                    type="file"
                    accept="image/jpg, image/png, image/jpeg"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
                <div className="ctf-question-edit-popup-contents-button-wrapper">
                  <div
                    className="ctf-question-edit-popup-contents-button"
                    onClick={onCTFQuestionRegister}
                  >
                    확인
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CTFquestion;
