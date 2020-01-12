// Canvas.js
import React, { Component } from 'react';

class Camera extends Component {
  constructor(props) {
    super(props);
    this.sensor = React.createRef();
    this.view = React.createRef();
    this.output = React.createRef();
    this.state = {
      constraints: {
        video: { facingMode: 'user' },
        audio: false
      }
    };
  }

  readAsDataURLSync = inputFile => {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
      temporaryFileReader.onerror = () => {
        temporaryFileReader.abort();
        reject(new DOMException('Problem parsing input file.'));
      };
      temporaryFileReader.onload = () => {
        resolve(temporaryFileReader.result);
      };
      temporaryFileReader.readAsDataURL(inputFile);
    });
  };

  takePhoto = async e => {
    console.log('take photo');

    // let sensor = new OffscreenCanvas(this.view.current.videoWidth, this.view.current.videoHeight);
    let sensor = this.sensor.current
    sensor.width = this.view.current.videoWidth
    sensor.height = this.view.current.videoHeight
    sensor.getContext('2d').drawImage(this.view.current, 0, 0);
    // let blob = await sensor.convertToBlob();
    // let dataUrl = await this.readAsDataURLSync(blob);
    let dataUrl = sensor.toDataURL()
    this.props.savePhoto(dataUrl, dataUrl => {
      this.output.current.src = dataUrl;
      this.output.current.classList.add('taken');
      this.props.history.push('/canvas');
    });
  };

  componentDidMount() {
    navigator.mediaDevices
      .getUserMedia(this.state.constraints)
      .then(stream => {
        // let track = stream.getTracks()[0];
        this.view.current.srcObject = stream;
      })
      .catch(err => {
        console.error('Oops.. Somethin Broke..', err);
      });
  }

  render() {
    return (
      <React.Fragment>
        <canvas id='sensor' ref={this.sensor}></canvas>
        <video autoPlay playsInline id='view' ref={this.view}></video>
        <img src='//:0' alt='' id='output' ref={this.output} />
        <button id='trigger' onClick={e => this.takePhoto(e)}>
          Take A Picture
        </button>
      </React.Fragment>
    );
  }
}

export default Camera;
