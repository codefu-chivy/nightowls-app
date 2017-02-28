import React from "react";

export default class Search extends React.Component {
    constructor(props) {
        super(props);
    }
    handleButton = (e) => {
       let location = document.getElementById("search").value;
       if (!location) {
           alert("Please enter a search query");
           return;
       }
       let buttonVal = e.target.textContent;
       let query;
       if (buttonVal === "Search Bars") {
           query = buttonVal.slice(buttonVal.indexOf(" ") + 1).toLowerCase();
       }
       else {
           query = buttonVal.slice(buttonVal.indexOf(" ") + 1).toLowerCase().replace(/ /g, "");
       }
       fetch("/api-info", {
           method: "post",
           body: JSON.stringify({"data": {"query": query, "loc": location}}),
           headers: {
               "Content-Type": "application/json"
           }
       }).then((res) => {
           return res.json();
       }).then((json) => {
           this.props.changeState(json);
       })
    }
    render() {
        return (
            <div className="search">
              <input type="search" id="search" placeholder="Enter location. Use State/Country Abbrev. for greater accuracy"/>
              <div>
                <div className="button-container">
                  <button className="first search-buttons" onClick={this.handleButton}>Search Bars</button>
                </div>
                <div className="button-container">
                  <button className="search-buttons" onClick={this.handleButton}>Search Dance Clubs</button>
                </div>   
              </div>
            </div>
        )
    }
}