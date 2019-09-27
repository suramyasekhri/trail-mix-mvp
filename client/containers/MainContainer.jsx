/**
 * ************************************
 *
 * @module  MainContainer
 * @author
 * @date
 * @description stateful component that renders MapDisplay and ListContainer
 *
 * ************************************
 */

import React, { Component } from "react";
import MapDisplay from "../components/MapDisplay.jsx";
import ListContainer from "./ListContainer.jsx";

//container that combines MapDisplay and ListContainer and passes down all necessary props
class MainContainer extends Component {

    render() {

        return (
            <div id="main-container">
                <ListContainer
                  trailData={this.props.trailData}
                  getTrail={this.props.getTrail}
                  dropdownOpen={this.props.dropdownOpen}
                  isLoggedIn={this.props.isLoggedIn}
                  showKey={this.props.showKey}
                  saveTrail={this.props.saveTrail}
                  removeTrail={this.props.removeTrail}
                  savedTrails={this.props.savedTrails}
                  userId={this.props.userId}
                  username={this.props.username}
                  weatherData={this.props.weatherData}
                  icon={this.props.icon}
                />
                <MapDisplay
                  id="map-display"
                  trailData={this.props.trailData}
                  getTrail={this.props.getTrail}
                  displayTrail={this.props.displayTrail}
                  latitude={this.props.latitude}
                  longitude={this.props.longitude}
                  zoom={this.props.zoom}
                />
            </div>
        );
    };
};

export default MainContainer;
