// Ahmet CAN
// http://ahmetcan.com.tr 
// eposta@ahmetcan.com.tr
// 20.09.2019

import React from 'react';
class VideoView extends React.Component {
    constructor(props) {
        super(props);
        this.video = React.createRef();

    }
    componentDidUpdate() {
        console.log("componentDidUpdate")
        this.video.current.srcObject = this.props.stream;//after every render process we have to use srcObject property otherwise video wouldn't show stream

    }
    render() {
        return <video  ref={this.video} autoPlay playsInline></video>
    };
}

export default VideoView;
