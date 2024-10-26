import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import "flex-splitter-directive";
import "flex-splitter-directive/styles.min.css";
import Questions from "../QuestionsDescription/QuestionsDescription";
import Editor from "../Editor/Editor";
import Test from "../Test/Test";
import "./Body.css";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const Body = () => {
  const bodyContentsRef = useRef(null); // Reference for body-contents
  const [isSmallWidth, setIsSmallWidth] = useState(false); // State to track if width < 200px
  const [output, setOutput] = useState("");  // State to store the output
  const {questionId} = useParams();
  const [question,setQuestion] = useState("");
  const location=useLocation();
  const url=location.state?.url || `${process.env.REACT_APP_BACKEND_URL}/student/getQuestionById`;

  // useEffect to observe the width of body-contents
  useEffect(() => {
    axios.post(
        url,
        {
            questionId: questionId
        }
    ).then((res)=>{
      setQuestion(res.data.question)}
    ).catch((err)=>{
      console.error(err);
    });

    const observer = new ResizeObserver((entries) => {
      if (bodyContentsRef.current) {
        const { width } = entries[0].contentRect;
        setIsSmallWidth(width < 200); // Set state based on width
      }
    });

    if (bodyContentsRef.current) {
      observer.observe(bodyContentsRef.current);
    }

    // Cleanup
    return () => {
      if (bodyContentsRef.current) {
        observer.unobserve(bodyContentsRef.current);
      }
      observer.disconnect();
    };

  }, []);

  return (
    <>
      <Navbar />
      <div className="compiler-body" data-flex-splitter-horizontal>
        <Questions question={question} />

        <div role="separator" tabIndex="1"></div>

        {/* Conditionally render based on width */}
        {isSmallWidth ? (
          <div className="body-contents-small" ref={bodyContentsRef}>
            {/* Render alternate content when width is less than 200px */}
            <p>Code</p>
          </div>
        ) : (
          <div className="body-contents" data-flex-splitter-vertical ref={bodyContentsRef}>
            {/* Pass setOutput function to Editor to update the output */}
            <Editor question={question} onOutput={setOutput} />
            <div role="separator" tabIndex="1"></div>
            {/* Pass the output state to the Test component */}
            <Test output={output} />
          </div>
        )}
      </div>
    </>
  );
};

// Define prop types for the Body component
Body.propTypes = {
  question: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
  }),
};

export default Body;
