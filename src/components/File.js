import React from 'react';

class File extends React.Component {
  componentDidMount() {
    console.log(this.props.src);
  }
  render() {
    return <img src={this.props.src} alt='' />;
  }
}

export default File;
