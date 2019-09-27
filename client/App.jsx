import React, { Component } from 'react';
import MainContainer from "./containers/MainContainer.jsx";
import { BrowserRouter as Router, Route, Switch, Link, Redirect} from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import ReactAnimatedWeather from 'react-animated-weather';

const googleMapsUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const googleMaps_API_KEY = 'AIzaSyAgJUQeWjM55IdJbPXVRa3i-5N6uLvptI8';
const hikingProject_API_KEY = '200601261-d71b1d3a8f073c58c93d34bf907171f1'
const darkSky_API_KEY = '0b5c5fab0ec2f6d0ad4dd955eea69e1c';

// state includes data retrieved from REI API, selects selected trail
// holds trail specific comments pulled from database
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userId: null,
            username: null,
            trailData: [],
            savedTrails: [],
            selectedTrail: null,
            comments: [],
            searchInput: '',
            latitude: 34.0522, // initially set to Los Angeles
            longitude: -118.2437, // initially set to Los Angeles
            zoom: 8,
            weatherData: [],
            dropdownOpen: false,
            isLoggedIn: true,
            icon: 'CLEAR_DAY',
            color: 'black',
            size: 25,
            animate: true
        }

      this.getTrail = this.getTrail.bind(this);
      this.saveTrail = this.saveTrail.bind(this);
      this.removeTrail = this.removeTrail.bind(this);
      this.displayTrail = this.displayTrail.bind(this);
      this.handleSearchInput = this.handleSearchInput.bind(this);
      this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
      this.toggle = this.toggle.bind(this);

    };

    logout(e) {
      this.setState({isLoggedIn: false})
    }

    toggle() {
      this.setState(prevState => ({
        dropdownOpen: !prevState.dropdownOpen
      }));
    }

    handleSearchInput(e) {
        let input = e.target.value;
        input = input.replace(' ', '+')
        this.setState({ searchInput: input })
    }

    handleSearchSubmit(e) {
        e.preventDefault()
        const gUrl = googleMapsUrl + this.state.searchInput + '&key=' + googleMaps_API_KEY;
        fetch(gUrl)
        .then((res) => res.json())
        .then((res) => {
            const lat = res.results[0].geometry.location.lat;
            const lng = res.results[0].geometry.location.lng;
            this.setState({ latitude: lat, longitude: lng })
        })
        .then((res) => {
            const hUrl = `https://www.hikingproject.com/data/get-trails?lat=${this.state.latitude}&lon=${this.state.longitude}&maxDistance=20&maxResults=100$minStars=3&key=${hikingProject_API_KEY}`
            fetch(hUrl)
            .then((res) => res.json())
            .then((res) => {
                this.setState(state => {
                    return {
                        ...state,
                        trailData: res.trails
                    }
                })
            })
        })
        .then((res) => {
<<<<<<< HEAD
          //console.log('hellooooo')
          //weatherupdate
            const wUrl = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSky_API_KEY}/${this.state.latitude},${this.state.longitude}`;
            console.log(`wUrl: ${wUrl}`)
            fetch(wUrl)
                .then((res) => res.json())
                .then((res) => {
                    this.setState({ weatherData: res.daily });
                    //console.log(`Weather array info: ${this.state.weatherData.data[0].temperatureMin}`)
                })
        })
        this.setState({zoom: 10})
=======
           const wUrl = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${darkSky_API_KEY}/${this.state.latitude},${this.state.longitude}`;
           console.log(`wUrl: ${wUrl}`)
           fetch(wUrl)
               .then((res) => res.json())
               .then((res) => {
                 let icon = res.daily.data[0].icon;
                 let iconArray = icon.split('');
                 let newIconStr = iconArray.reduce((str, char) => {
                   if (char === '-') {
                     str += '_';
                     return str;
                   }
                   str += char;
                   return str;
                 }, '')
                 let upperIcon = newIconStr.toUpperCase()
                 this.setState({ weatherData: res.daily, icon: upperIcon });
                 console.log(`Weather array info: ${this.state.icon}`)
               })
       })
      this.setState({zoom: 10})
>>>>>>> 6260e284217bcf72c032d54deb4f56d995e31e1c
    }



    // fetches data from REI API and sets to state when the page loads
    componentDidMount() {

            const { id, username, icon, weather } = this.props.location.state

            this.setState({
              userId: id,
              username: username,
              icon: icon,
              // weatherData: weatherData,
            });

            fetch('/data')
            .then((res) => {
                return res.json();
            })
            .then((res) => {
              this.setState(state => {
                  return {
                      ...state,
                      trailData: res.trails
                  };
               });
            });

            fetch('/favs', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: id,
              })
            })
            .then((res) => {
              return res.json();
            })
            .then((res) => {
              this.setState(state => {
                return {
                  ...state,
                  savedTrails: res.trails
                };
              });
            })
    };

    //invoked by on-click function in TrailDisplay, sets selected trail in state
    getTrail(id) {
        let trailsArr = this.state.trailData.slice();
        let chosenTrail;
        for (let i = 0; i < trailsArr.length; i++) {
            if (trailsArr[i].id === +id) {
                chosenTrail = trailsArr[i];
                this.setState({selectedTrail: chosenTrail})
            };
        };

        fetch('/comments', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                id: id
            }
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

    saveTrail(event, props) {
      event.preventDefault();

      fetch('/trail/add', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              id: this.state.userId,
              userId: this.state.userId,
              reiId: props.id,
              length: props.length,
              difficulty: props.difficulty,
              location: props.location,
              name: props.name,
          })
      })
      .then((res) => {
          return res.json();
      })
      .then((res) => {
        this.setState(state => {
          return {
            ...state,
            savedTrails: res.trails
          };
        });
      })
    }

    removeTrail(event, props) {
      event.preventDefault();

      fetch('/trail/remove', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              id: this.state.userId,
              userId: this.state.userId,
              reiId: props.id,
          })
      })
      .then((res) => {
          return res.json();
      })
      .then((res) => {
        this.setState(state => {
          return {
            ...state,
            savedTrails: res.trails
          };
        });
      })
    }

    //invoked when clicking on the map popups
    displayTrail(selectedHike) {
        this.setState({selectedTrail: selectedHike});
    }

    //renders MainContainer and conditionally renders TrailContainer
    render() {

        let weather = 70;

        if (this.state.weatherData.length !== 0) {
          weather = Math.floor(this.state.weatherData.data[0].temperatureMin);
        }

        if (!this.state.isLoggedIn) return <Redirect to="/" />
        return (
        <div>
            <div className="current-weather">
                <ReactAnimatedWeather
                  icon={this.state.icon}
                  color={this.state.color}
                  size={this.state.size}
                  animate={this.state.animate}
              /> <div className="weather-number">{weather}&#8457;</div>
            </div>
            <div className="navbars">
              <div className="navigation">
                <Link className="nav-item" to="/homepage"><img src="../assets/MARKER.png" width="50"></img></Link>
                <Link className="nav-item my-favs" to={{
                  pathname: '/favs',
                  state: {
                    userId: this.state.userId,
                    username: this.state.username,
                    weather: this.state.weatherData,
                    dropdownOpen: this.state.dropdownOpen,
                    isLoggedIn: this.state.isLoggedIn,
                    icon: this.state.icon
                  }
                }}>My Favs</ Link>
                <Dropdown className="nav-item" id="userGreeting" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                  <DropdownToggle caret>
                    Hello, {this.state.username}!
                    </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={(e => this.logout(e))}>Logout</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>

            <div className='appContainer'>
              <div id="searchForm">
                <form onSubmit={this.handleSearchSubmit}>
                  <label>
                  <input
                    type="text"
                    value={this.state.searchLocation}
                    onChange={this.handleSearchInput}
                    placeholder="Find your trail..."
                  />
                  </label>
                  <input className="submitButton" type="submit" value="Search" />
                </form>
              </div>
                <MainContainer
                  className='mainContainer'
                  latitude={this.state.latitude}
                  longitude={this.state.longitude}
                  weatherData={this.state.weatherData}
                  trailData={this.state.trailData}
                  getTrail={this.getTrail}
                  icon={this.state.icon}
                  selectedTrail={this.state.selectedTrail}
                  displayTrail={this.displayTrail}
                  savedTrails={this.state.savedTrails}
                  zoom={this.state.zoom}
                  saveTrail={this.saveTrail}
                  removeTrail={this.removeTrail}
                  dropdownOpen={this.state.dropdownOpen}
                  isLoggedIn={this.state.isLoggedIn}
                  userId={this.state.userId}
                  username={this.state.username} />
            </div>
          </div>
        );
    };
};


export default App;
