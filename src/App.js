
import React, { useState } from "react";
import "./App.css";
import { saveAs } from "file-saver";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function App() {
  const [fileContents, setFileContents] = useState("");
  const [wordCounts, setWordCounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const fetchTextFile = () => {
    setIsLoading(true);
    fetch("https://www.terriblytinytales.com/test.txt")
      .then(response => response.text())
      .then(data => {
        setFileContents(data);
        const words = data.toLowerCase().match(/\b\w+\b/g);
        const wordCounts = {};
        for (let i = 0; i < words.length; i++) {
          const word = words[i];
          if (word in wordCounts) {
            wordCounts[word] += 1;
          } else {
            wordCounts[word] = 1;
          }
        }
        const sortedWordCounts = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]);
        setWordCounts(sortedWordCounts.slice(0, 20));
        setIsLoading(false);
        setIsButtonVisible(false); // Hide the button after the first load
      })
      .catch(error => {
        console.error("Error fetching text file:", error);
        setIsLoading(false);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchTextFile();
  };

  const exportToCSV = () => {
    const csvContent = wordCounts.map(([word, count]) => `${word},${count}`).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "word_counts.csv");
  };

  return (
    <div>
      {isButtonVisible && (
        <div className="contains">
          <form onSubmit={handleSubmit}>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
      {fileContents && (
        <div className="text-file-contents">
          {fileContents.split("\n").map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}
      {wordCounts.length > 0 && (
        <div className="word-count-chart">
          <h2>20 Most Occurring Words</h2>
          <BarChart width={800} height={400} data={wordCounts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="0" interval={0} angle={-45} textAnchor="end" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="1" fill="#8884d8" />
          </BarChart>
        </div>
      )}
      {wordCounts.length > 0 && (
        <div className="export-button">
          <button onClick={exportToCSV}>Export</button>
        </div>
      )}
      {isLoading && <p>Loading...</p>}
    </div>
  );
}

export default App;
