import React from "react";
import Search from "./search";
import {Tooltip, OverlayTrigger} from "react-bootstrap";
import jwtDecode from "jwt-decode";
const calculateDistance = require("../calculate-distance");

export default class Front extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            businessList: null,
            coordLat: "",
            coordLong: "",
            attending: false,
            sorted: 0,
            token: sessionStorage.getItem("token")
        }
    }
    componentDidMount = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            this.setState({
                coordLat: position.coords.latitude,
                coordLong: position.coords.longitude
            });
        });
    }
    changeState = (json) => {
        this.setState({
            businessList: json.data
        });
    };
    handleSort = (e) => {
        if (!Array.isArray(e)) {
            if (e.target.textContent === "Sort by distance") {
                this.setState({
                    businessList: this.state.businessList.sort((a, b) => {
                        return a.distance - b.distance;
                    })
                });
                this.setState({
                    sorted: 1
                })
            } 
            else if (e.target.textContent === "Sort by rating") {
                this.setState({
                    businessList: this.state.businessList.sort((a, b) => {
                        return b.rating - a.rating;
                    })
                });
                this.setState({
                    sorted: 2
                })   
            }
            else {
                this.setState({
                    businessList: this.state.businessList.sort((a, b) => {
                        return b.review_count - a.review_count;
                    })
                });
            }    
        }
        else {
            if (this.state.sorted === 1) {
                e.sort((a, b) => {
                    return a.distance - b.distance;
                });
                return e;
            }
            else if (this.state.sorted === 2) {
                e.sort((a, b) => {
                    return b.rating - a.rating;
                });
                return e;
            }
            else {
                e.sort((a, b) => {
                    return b.review_count - a.review_count;
                });
                return e;
            }
        }
    };
    handleAttend = (event, name, id, location, query) => {
        let username;
        if (!this.state.token) {
            event.preventDefault();
            alert("You must be signed in to access these features");
            return;
        }
        username = jwtDecode(this.state.token).data.username;
        let text = event.target.textContent;
        fetch("/add-bar", {
            method: "post",
            body: JSON.stringify({data: {name: name, username: username, id: id, location: location, query: query, text: text}}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then((res) => {
            return res.json();
        }).then((json) => {
            if (json.data === true) {
                alert("You are already added!");
            }
            else if (!json.data) {
                alert("You have not added yourself to this bar!");
            }
            else {
                if (!this.state.sort) {
                    this.setState({
                        businessList: json.data
                    })
                }
                else {
                    this.setState({
                        businessList: this.handleSort(json.data)
                    });
                }
            }
        })
    };
    render() {
        let heading = (
            <div className="heading">
                <h1 id="title">Night Owls</h1>
                <h2 id="subtitle">Explore the Night</h2>
            </div>
        )
        let list = this.state.businessList ? (
            <div className="list-container">
              <h1 id="whats-in">What's in {this.state.businessList[0].loc}?</h1>
              <button className="sort-button" onClick={this.handleSort}>Sort by distance</button>
              <button className="sort-button" onClick={this.handleSort}>Sort by rating</button>
              <button className="sort-button" onClick={this.handleSort}>Sort by review count</button>
              {this.state.businessList.map((object, id) => {
                  let image;
                  let distance = this.state.coordLat ? calculateDistance(object.location.coordinate.latitude, object.location.coordinate.longitude, this.state.coordLat, this.state.coordLong) : null;
                  if (distance) {
                      object.distance = distance;
                  }
                  if (!object.hasOwnProperty("image_url")) {
                    image = "../static/images/no_image.jpg";
                  }
                  else {
                    image = object.image_url;
                  }
                  return (
                      <div className="in-container" key={id}>
                        <div className="data img-container">
                          <img className="busImg" src={image} alt={object.name}/>
                          <img className="ratings" src={object.rating_img_url_large} alt="ratings"/>
                          <h4>{object.review_count} reviews</h4>
                          <a className="twitter" href={"http://twitter.com/intent/tweet?text=I'm going to " + object.name + " tonight"} target="_blank" onClick={(event) => this.handleAttend(event, object.name, object.id, object.loc, object.query)}><button className="add-remove">I'm going here tonight</button></a>
                          <button className="add-remove" onClick={(event) => this.handleAttend(event, object.name, object.id, object.loc, object.query)}>Remove Me</button>
                        </div>
                        <div className="data info-container">
                          <h2 className="info name">{object.name}</h2>
                          <h4 className="info">{distance}<span>{distance ? " km away" : ""}</span></h4>
                          <h4 className="info">{object.attendance + " going"}</h4>
                          <p className="review">Customers say: <a href={object.url} target="_blank">"{object.snippet_text}"</a></p>
                        </div>
                        <div className="data additional-info">
                          <h4>{object.location.display_address[0]}</h4>
                          <h4>{object.location.display_address[1]}</h4>
                          <h4>{object.location.display_address[2]}</h4>
                        </div>  
                      </div>            
                  )
              })}
              </div>
        ) : null;
        return (
            <div>
              <div id="heading-whole">
                {heading}
                <Search changeState={this.changeState} businessList={this.state.businessList}/>
              </div>
              {list}
            </div>      
        )
    }
}