// Canvas.js
import React, { Component } from 'react';
import Controls from './Controls';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.state = {
      startPos: [0, 0],
      endPos: [0, 0],
      currentPos: [0, 0],
      drawing: false,
      color: '#626c70',
      lineDash: [],
      tool: 'drawLine',
      shapes: [],
      midPos: () => {
        const x = (this.state.startPos[0] + this.state.currentPos[0]) / 2;
        const y = (this.state.startPos[1] + this.state.currentPos[1]) / 2;
        return [x, y];
      },
      rectWidth: () => {
        return this.state.currentPos[0] - this.state.startPos[0];
      },
      rectHeight: () => {
        return this.state.currentPos[1] - this.state.startPos[1];
      },
      arcRadius: () => {
        let radW = Math.abs(this.state.rectWidth() / 2);
        let radH = Math.abs(this.state.rectHeight() / 2);
        return radH < radW ? radW : radH;
      },
      xRad: () => {
        return Math.abs(this.state.rectWidth() / 2);
      },
      yRad: () => {
        return Math.abs(this.state.rectHeight() / 2);
      }
    };
  }

  saveShape() {
    //get state
    let shapes = this.state.shapes;
    //add line
    shapes.push({
      startPos: this.state.startPos,
      currentPos: this.state.endPos,
      endPos: this.state.endPos,
      color: this.state.color,
      lineDash: this.state.lineDash,
      tool: this.state.tool,
      midPos: this.state.midPos(),
      rectWidth: this.state.rectWidth(),
      rectHeight: this.state.rectHeight(),
      arcRadius: this.state.arcRadius()
    });
    //save state
    this.setState({ shapes });
    console.log(shapes);
    this.drawShapes();
  }

  drawShapes() {
    console.log('Draw Shapes');

    const ctx = this.canvas.current.getContext('2d');
    if (!this.state.drawing) ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    this.state.shapes.forEach(shape => {
      console.log(shape);
      ctx.beginPath();
      ctx.strokeStyle = shape.color;
      ctx.setLineDash(shape.lineDash);
      this[shape.tool](ctx, shape);
    });
  }

  touch(e) {
    e.preventDefault();
    if (e.button === 2) return;
    let clientX = this.state.currentPos[0];
    let clientY = this.state.currentPos[1];
    if (e.touches && e.touches.length) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    if (e.clientX & e.clientY) {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    switch (e.type) {
      case 'mousedown':
      case 'touchstart':
        this.setState({
          startPos: [clientX, clientY],
          currentPos: [clientX, clientY],
          drawing: true
        });
        break;
      case 'mouseup':
      case 'touchend':
        this.setState(
          {
            endPos: [clientX, clientY],
            drawing: false
          },
          this.saveShape
        );
        break;
      default:
        this.setState({
          currentPos: [clientX, clientY]
        });
        break;
    }
    if (!this.state.drawing) {
      return;
    }
    const ctx = this.canvas.current.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
    ctx.setLineDash(this.state.lineDash);
    ctx.strokeStyle = this.state.color;
    ctx.lineWidth = 4;
    this[this.state.tool](ctx, false);
    this.drawShapes();
  }

  drawLine = (ctx, shape) => {
    if (!shape) {
      shape = { startPos: this.state.startPos, currentPos: this.state.currentPos };
    }
    ctx.beginPath();
    ctx.moveTo(shape.startPos[0], shape.startPos[1]);
    ctx.lineTo(shape.currentPos[0], shape.currentPos[1]);
    ctx.stroke();
  };

  drawSquare = (ctx, shape) => {
    if (!shape) {
      shape = {
        startPos: this.state.startPos,
        rectHeight: this.state.rectHeight(),
        rectWidth: this.state.rectWidth()
      };
    }
    ctx.strokeRect(shape.startPos[0], shape.startPos[1], shape.rectWidth, shape.rectHeight);
  };

  drawCircle = (ctx, shape) => {
    if (!shape) {
      shape = { midPos: this.state.midPos(), arcRadius: this.state.arcRadius() };
    }
    ctx.beginPath();
    ctx.arc(shape.midPos[0], shape.midPos[1], shape.arcRadius, 0, 2 * Math.PI);
    ctx.stroke();
  };

  drawImage = () => {
    console.log('Draw Image');

    if (!this.canvas || !this.props.photoDataUrl) return;

    let img = new Image();
    return new Promise((resolve, reject) => {
      img.width = window.innerWidth;
      img.height = window.innerHeight;
      img.addEventListener(
        'load',
        () => {
          this.canvas.current
            .getContext('2d')
            .drawImage(img, 0, 0, this.canvas.current.width, this.canvas.current.height);
          console.log('resolve');
          resolve();
        },
        false
      );
      img.src = this.props.photoDataUrl;
    });
  };

  pickColor = e => {
    this.setState({
      color: getComputedStyle(e.target).color
    });
  };

  pickLine = lineDash => {
    this.setState({
      lineDash
    });
  };

  pickTool = tool => {
    this.setState({
      tool
    });
  };

  saveImage = async () => {
    console.log('Save Image');

    const ctx = this.canvas.current.getContext('2d');
    this.setState({ drawing: true }, async () => {
      console.log(ctx);
      ctx.clearRect(0, 0, this.canvas.current.width, this.canvas.current.height);
      console.log('Drawing Image');
      await this.drawImage();
      console.log('Drew Image');
      console.log('Drawing Shapes');
      this.drawShapes();
      console.log('Drew Shapes');
      console.log(this.canvas.current);
      // return;
      let dataUrl = this.canvas.current.toDataURL('image/png');
      console.log(dataUrl);
      this.props.saveImage(dataUrl);
      this.props.history.push('/file');
    });
  };

  componentDidMount() {
    console.log('canvas did mount');
    console.log(this.props.photoDataUrl);

    const canvas = this.canvas.current;

    function resizeCanvas(canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas(canvas);
    window.addEventListener('resize', resizeCanvas);

    canvas.style.background = `url(${this.props.photoDataUrl})`;
    canvas.style.backgroundRepeat = 'no-repeat';
    canvas.style.backgroundSize = `${canvas.width}px ${canvas.height}px`;
  }

  render() {
    return (
      <React.Fragment>
        <canvas
          id="canvas"
          className="Canvas"
          ref={this.canvas}
          onTouchStart={e => this.touch(e)}
          onMouseDown={e => this.touch(e)}
          onTouchEnd={e => this.touch(e)}
          onMouseUp={e => this.touch(e)}
          onMouseMove={e => this.touch(e)}
          onTouchMove={e => this.touch(e)}
        ></canvas>
        <Controls
          pickColor={this.pickColor}
          pickTool={this.pickTool}
          pickLine={this.pickLine}
          saveImage={this.saveImage}
        />
      </React.Fragment>
    );
  }
}

export default Canvas;
