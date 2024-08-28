import React, { useState, useEffect } from "react";
import "./QuestionPaperDashboard.css";
import Navbar from "../Navbar/Navbar";
import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import defaultImage from "../Assets/no-image-420x370-1.jpg";
import Nothing from "../Assets/nothing.svg";
import AlertModal from "../AlertModal/AlertModal";


const QuestionPaperDashboard = () => {
  const { state } = useLocation();
  const { className, semester, subject, marks } = state || {};
  const navigate = useNavigate();
  const { paperId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for the modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/paper/questionsbyid",
          { paperId }
        );
        setQuestions(res.data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
       
       
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [paperId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalMarks = questions.reduce(
    (sum, question) => sum + question.marks,
    0
  );

  const handleSubmit = () => {
    // Here, you would handle the submit logic.
    // Trigger a success modal on successful submission
    setModalMessage("Your question paper has been submitted successfully!");
    setIsError(false);
    setModalIsOpen(true);
  };

  return (
    <>
      <Navbar />
      <div className="question-list-container">
        {questions.length > 0 ? (
          <>
            <div className="question-header">
              <h2 className="question-subject">
                {className} {semester} ({subject})
              </h2>
              <h2 className="question-total-marks">
                Total Marks: &nbsp;{totalMarks}/{marks}
              </h2>
            </div>
            {totalMarks > marks && (
              <div className="error_message_questionDashboard">
                <p>
                  The total marks ({totalMarks}) exceed the allowed marks (
                  {marks}). Please remove <strong>{totalMarks - marks}</strong>{" "}
                  marks to submit the paper.
                </p>
              </div>
            )}
            <div className="question-table">
              {questions.map((question, index) => (
                <div className="questions-table" key={index}>
                  <div className="question-table-data">
                    <div className="compiler">
                      Compiler: {question.compilerReq}
                    </div>
                    <div className="marks">Marks: {question.marks}</div>
                    <div className="heading-description">
                      <h3 className="question_paper_h3">
                        {question.questionheading}
                      </h3>
                      <div className="description">
                        {question.questionDescription}
                      </div>
                    </div>
                    {question.image ? (
                      <div className="question-image">
                        <img src={question.image} alt="question" />
                      </div>
                    ) : (
                      <div className="question-image">
                        <img src={defaultImage} alt="question" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <center>
                {totalMarks < marks && (
                  <button
                    className="add-question-button2"
                    onClick={() =>
                      navigate(`/add-question/${paperId}`, {
                        state: { remainingMarks: marks - totalMarks },
                      })
                    }
                  >
                    <FaPlus />
                    <p>Add Question</p>
                  </button>
                )}
                {totalMarks === marks && (
                  <button
                    className="question_submit-button"
                    style={{ backgroundColor: "green", color: "white" }}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                )}
              </center>
            </div>
          </>
        ) : (
          <>
            <div className="no-questions-container">
              <center>
                <img alt="Nothing" src={Nothing} className="nothing" />
                <h2>No Questions Found</h2>
                <button
                  className="add-question-button"
                  onClick={() =>
                    navigate(`/add-question/${paperId}`, {
                      state: { remainingMarks: marks - totalMarks },
                    })
                  }
                >
                  <FaPlus />
                  <p>Create Your First Question</p>
                </button>
              </center>
            </div>
          </>
        )}
      </div>

      {/* Alert Modal */}
      < AlertModal
        isOpen={modalIsOpen} 
        onClose={() => setModalIsOpen(false)} 
        message={modalMessage} 
        iserror={isError} 
      />
    </>
  );
};

export default QuestionPaperDashboard;
