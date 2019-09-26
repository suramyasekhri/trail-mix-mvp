import React from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import Hiker from './components/Hiker.jsx';
import CommentsDisplay from "./components/CommentsDisplay.jsx";
import { Input, FormText } from 'reactstrap';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';



class TrailPage extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      userId: null,
      id: null,
      trail: [],
      hikers: [],
      comments: [],
      username: 'admin',
      weather: [],
      dropdownOpen: false,
      isLoggedIn: true,
    }

    this.postComment = this.postComment.bind(this);
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount () {

    const { id } = this.props.match.params;
    const { username, userId, weather, dropdownOpen, isLoggedIn } = this.props.location.state

    this.setState({
      username,
      id,
      userId,
      weather,
      dropdownOpen,
      isLoggedIn
    })

    fetch('/trail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            trailId: id,
        })
      })
      .then((res) => {
          return res.json();
      })
      .then((res) => {
        this.setState(state => {
            return {
                ...state,
                trail: res.trail.trails[0],
                comments: res.comments
            };
        });
      })

      fetch('/hikers', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              trailId: id,
          })
        })
        .then((res) => {
            return res.json();
        })
        .then((hikers) => {
          this.setState(state => {
              return {
                  ...state,
                  hikers: hikers,
              };
          });
        })

  };


  logout(e) {
    this.setState({isLoggedIn: false})
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  //adds comment and author to database and pulls back all comments for specified trail and sets to state
  postComment(id, comment, author) {
      fetch('/comments', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              id: id,
              comment: comment,
              author: author
          })
      })
      .then((res) => {
          return res.json();
      })
      .then((res) => {
          this.setState(state => {
              return {
                  ...state,
                  comments: res
              };
          });
      });
  };

  render() {

    const { id, name, url, stars, summary, location, length, difficulty, imgMedium, high } = this.state.trail;

    const { username, comments, hikers } = this.state;

    let allComments;
    let allHikers;

    if (comments.length !== 0) {
      allComments = comments.slice(0).reverse().map((x, index) => {
          return <CommentsDisplay key={index} comment={x.comment} author={x.author} />
      })
    }

    if (hikers.length !== 0) {
      allHikers = hikers.map((x, index) => {
          return <Hiker key={index} username={x.username} />
      })
    }

    let weather = 70;
    if (this.state.weather.length !== 0) {
      weather = Math.floor(this.state.weather.data[0].temperatureMin);
    }

    if (!this.state.isLoggedIn) return <Redirect to="/" />
    return (
      <div>
      <div className="navbars">
        <div className="navigation">
          <Link className="nav-item" to={{
            pathname: '/homepage',
            state: {
              id: this.state.userId,
              username: this.state.username,
              weather: this.state.weather,
              dropdownOpen: this.state.dropdownOpen,
              isLoggedIn: this.state.isLoggedIn
            }
          }}><img src="../assets/MARKER.png" width="50"></img></ Link>
          <Link className="nav-item my-favs" to={{
            pathname: '/favs',
            state: {
              userId: this.state.userId,
              username: this.state.username,
              weather: this.state.weather,
              dropdownOpen: this.state.dropdownOpen,
              isLoggedIn: this.state.isLoggedIn
            }
          }}>My Favs</Link>
          <Dropdown className="nav-item" id="userGreeting" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              Hello, {this.state.username}!
              </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={(e => this.logout(e))}>Logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="current-weather">Current weather {weather}&#8457;</div>
      </div>

        <div className="trailpage">
          <div className="trailPageContainer">


            <div className="trail-profile-container">
              <div className="trail-image">
                <img src={imgMedium} />
              </div>
              <div className="trail-information">
                  <div className="trail-header-name">
                    {name}
                  </div>

                  <div className="trail-detail">
                    <span>{location}</span>
                  </div>

                  <div className="trail-detail">
                    <span>{summary}</span>
                  </div>

                  <div className="trail-detail">
                    <span>{stars} stars</span>
                  </div>

                  <div className="trail-detail">
                    <span>{length} miles</span>
                  </div>

                  {allHikers &&
                  <div className="hiker-list">
                    <div className="hiker-header"><span>Previous Hikers</span></div>
                    <div>{ allHikers }</div>
                  </div>
                  }
              </div>
            </div>
          </div>

          <div className = "commentbox">
              <Input type="textarea" name="comment" id="commentForm" /><br />
              <div
                value="Submit"
                className="commentSubmit"
                onClick={(e) => {
                  const comment = document.getElementById('commentForm').value;
                  this.postComment(id, comment, username)
                  document.getElementById('commentForm').value = '';
              }}>
                Submit
              </div>

            </div>
          </div>
          <div className="comments-section">{ allComments }</div>
      </div>
    )
  }
}

export default TrailPage
