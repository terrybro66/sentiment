import React, { useState } from "react";

function App() {
  const [review, setReview] = useState("musk is great");
  const [sentiment, setSentiment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      body: JSON.stringify({ review }),
      headers: new Headers({ "Content-Type": "application/json" }),
    };

    fetch("/api/nlp", options)
      .then((res) => res.json())
      .then(({ analysis }) => {
        setSentiment(analysis);
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  return (
    <>
      <h1 id="title">Please write a review for this product:</h1>
      <form onSubmit={handleSubmit}>
        <textarea value={review} onChange={(e) => setReview(e.target.value)} />
        <button type="submit">Analyze Sentiment</button>
      </form>

      <div id="emojiSection">{sentiment}</div>
    </>
  );
}

export default App;
