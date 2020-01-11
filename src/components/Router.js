// Canvas.js
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Canvas from './Canvas';
import Camera from './Camera';
import File from './File';
import NotFound from './NotFound';
import Nav from './Nav';

class Router extends Component {
  constructor(props) {
    super(props);
    this.state = { blob: null, photoDataUrl: null, imageDataUrl: null };
  }

  savePhoto = (blob, photoDataUrl, cb) => {
    this.setState({ blob, photoDataUrl }, () => {
      console.log(this.state.photoDataUrl);
      cb(this.state.photoDataUrl);
    });
  };

  saveImage = imageDataUrl => {
    this.setState({ imageDataUrl });
  };

  render() {
    return (
      <BrowserRouter>
        <Nav></Nav>
        <Switch>
          <Route path='/' exact render={props => <Camera {...props} savePhoto={this.savePhoto} />} />
          <Route path='/camera' exact render={props => <Camera {...props} savePhoto={this.savePhoto} />} />
          <Route
            path='/canvas'
            render={props => (
              <Canvas {...props} saveImage={this.saveImage} photoDataUrl={this.state.photoDataUrl} />
            )}
          />
          <Route path='/file' exact render={props => <File {...props} src={this.state.imageDataUrl} />} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
