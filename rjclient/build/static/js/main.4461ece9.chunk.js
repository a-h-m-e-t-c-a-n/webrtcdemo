(window.webpackJsonprjshello=window.webpackJsonprjshello||[]).push([[0],{57:function(e,t,n){},74:function(e,t,n){e.exports=n(87)},84:function(e,t,n){e.exports=n.p+"static/media/background.1f462aec.jpg"},87:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),r=n(8),i=n.n(r),s=(n(57),n(17)),c=n(12),l=n(24),d=n(25),u=n(28),h=n(52),m=n(11),g=(o.a.Component,n(135)),p=n(136),f=n(43),v=n(134),w=n(148),b=n(4),k=n(49),y=n.n(k),C=n(63),E=n.n(C),_=n(137),O=n(128),S=n(147),D=n(132),j=n(129),R=n(139),A=n(133),M=n(138),P=n(48),T=n.n(P),N=n(62),x=function(){function e(){Object(s.a)(this,e),this.configuration={iceServers:[{url:"stun:stun.l.google.com:19302"}],sdpSemantics:"plan-b"},this.RTCPeerConnection=window.RTCPeerConnection||window.mozRTCPeerConnection||window.webkitRTCPeerConnection||window.msRTCPeerConnection,this.RTCSessionDescription=window.RTCSessionDescription||window.mozRTCSessionDescription||window.webkitRTCSessionDescription||window.msRTCSessionDescription,this.OnEvent=new Map,this.peer_connections={},this.peer_id=this.IDGenerator(),navigator.mediaDevices&&navigator.mediaDevices.getUserMedia?window.navigator.getUserMedia=window.navigator.mediaDevices.getUserMedia:window.navigator.getUserMedia=window.navigator.getUserMedia||window.navigator.mozGetUserMedia||window.navigator.webkitGetUserMedia||window.navigator.msGetUserMedia}return Object(c.a)(e,[{key:"getPeerId",value:function(){return this.peer_id}},{key:"setClientInfo",value:function(e){this.name=e}},{key:"addEvent",value:function(e,t){var n=this.OnEvent[e];n||(n=new Set,this.OnEvent[e]=n),n.add(t)}},{key:"trigger",value:function(e){for(var t=this,n=arguments.length,a=new Array(n>1?n-1:0),o=1;o<n;o++)a[o-1]=arguments[o];var r=this.OnEvent[e];r&&r.forEach((function(e){return e.apply(void 0,a.concat([t]))}))}},{key:"IDGenerator",value:function(){this.length=8,this.timestamp=+new Date;for(var e,t,n=this.timestamp.toString().split("").reverse(),a="",o=0;o<this.length;++o){a+=n[(e=0,t=n.length-1,Math.floor(Math.random()*(t-e+1))+e)]}return a}},{key:"connect",value:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=this;this.retry=this.retry||t;var a=new URL(e);a.searchParams.set("id",this.peer_id),this.url=a.toString(),this.websocket&&this.disconnect(),this.websocket=new WebSocket(n.url),this.websocket.onerror=function(a){console.log("websocket error ->"+a),n.retry&&n.connect(e,t),n.trigger("error",a)},this.websocket.onopen=function(){console.log("websocket has been opened"),n.trigger("opened"),n.keepalive_timer=setInterval(this.keepAlive,15e3),n.register()},this.websocket.onmessage=function(e){var t=e.data;this.trigger("message",t),this.OnMessage(t)}.bind(this),this.websocket.onclose=function(a){console.log("websocket has been closed"),n.trigger("closed"),n.retry&&n.connect(e,t)}}},{key:"register",value:function(){var e={type:"register",name:this.name,useragent:navigator.userAgent};this.send(e)}},{key:"keepAlive",value:function(){this.send({type:"keepalive",data:{}}),console.log("Sent keepalive")}},{key:"send",value:function(e){this.websocket.send(JSON.stringify(e))}},{key:"disconnect",value:function(){window.clearInterval(this.keepalive_timer),this.retry=!1,this.websocket.close(),this.websocket=null}},{key:"OnMessage",value:function(e){var t=JSON.parse(e);switch(console.info("signal server message: {\n type = "+t.type+", \n  data = "+JSON.stringify(t.data)+"\n}"),t.type){case"call":this.onInvite(t);break;case"ringing":this.onRinging(t);break;case"offer":this.onOffer(t);break;case"answer":this.onAnswer(t);break;case"candidate":this.onCandidate(t);break;case"peer_changed":this.onPeers(t);break;case"leave":this.onLeave(t);break;case"bye":this.onBye(t);break;case"keepalive":console.log("keepalive response!");break;default:console.error("Unrecognized message",t)}}},{key:"createLocalStream",value:function(){var e=Object(N.a)(T.a.mark((function e(t){var n,a,o,r,i=arguments;return T.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=i.length>1&&void 0!==i[1]&&i[1],a=i.length>2&&void 0!==i[2]?i[2]:{width:640,height:400},!(o=this).local_stream){e.next=5;break}return e.abrupt("return",o.local_stream);case 5:return r={audio:n,video:"video"===t&&a},e.next=8,navigator.mediaDevices.getUserMedia(r);case 8:return o.local_stream=e.sent,o.trigger("open_local_stream",o.local_stream),e.abrupt("return",o.local_stream);case 11:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"closeLocalStream",value:function(){null!=this.local_stream&&(this.closeMediaStream(this.local_stream),this.local_stream=null)}},{key:"call",value:function(e,t){if(!this.local_stream)throw new Error("local stream must be opened");this.createPeerConnection(e,t,!0,this.local_stream),this.trigger("new_call",this.self_id,this.session_id)}},{key:"createOffer",value:function(e,t,n){var a=this;e.createOffer((function(o){console.log("create_offer: ",o.sdp),e.setLocalDescription(o,(function(){console.log("setLocalDescription",e.localDescription),a.sendOffer(t,n,e.localDescription)}),a.logError)}),a.logError)}},{key:"createPeerConnection",value:function(e,t,n,a){var o=this,r=new RTCPeerConnection(this.configuration);return o.peer_connections[""+e]=r,r.onicecandidate=function(t){console.log("onicecandidate",t),t.candidate&&o.sendCandidate(e,t.candidate)},r.onnegotiationneeded=function(){console.log("onnegotiationneeded")},r.oniceconnectionstatechange=function(t){console.log("oniceconnectionstatechange",t);var n=t.currentTarget.iceConnectionState;"connected"===n?(console.log("video_connected"),o.trigger("video_connected",e,t.stream)):"disconnected"===n?(console.log("video_disconnected"),o.trigger("video_disconnected",e,t.stream)):"failed"!==n&&"closed"!==n||(console.log("video_closed"),o.removeConnection(e))},r.onsignalingstatechange=function(e){console.log("onsignalingstatechange",e)},r.onaddstream=function(t){console.log("onaddstream",t),o.trigger("on_add_stream",e,t.stream)},r.onremovestream=function(t){console.log("onremovestream",t),o.trigger("on_remove_stream",e,t.stream)},r.addStream(a),n&&o.createOffer(r,e,t),r}},{key:"createDataChannel",value:function(e){if(!e.textDataChannel){var t=e.createDataChannel("text");t.onerror=function(e){console.log("dataChannel.onerror",e)},t.onmessage=function(e){console.log("dataChannel.onmessage:",e.data)},t.onopen=function(){console.log("dataChannel.onopen")},t.onclose=function(){console.log("dataChannel.onclose")},e.textDataChannel=t}}},{key:"onPeers",value:function(e){var t=e.peers;console.log("peers = "+JSON.stringify(t)),this.trigger("peers_changed",t)}},{key:"sendOffer",value:function(e,t,n){var a={type:"offer",to:e,media:t,description:n};this.send(a)}},{key:"onOffer",value:function(e){var t=this,n=e,a=n.from;console.log("data:"+n);var o=n.media;if(t.trigger("new_call",a),t.local_stream){var r=t.createPeerConnection(a,o,!1,t.local_stream);r&&n.description&&r.setRemoteDescription(new RTCSessionDescription(n.description),(function(){"offer"==r.remoteDescription.type&&r.createAnswer((function(e){console.log("createAnswer: ",e),r.setLocalDescription(e,(function(){console.log("setLocalDescription",r.localDescription),t.sendAnswer(a,r.localDescription)}),t.logError)}),t.logError)}),t.logError)}else console.log("onOffer error local stream not open")}},{key:"sendAnswer",value:function(e,t){var n={type:"answer",to:e,description:t};this.send(n)}},{key:"onAnswer",value:function(e){var t=e,n=t.from,a=null;n in this.peer_connections&&(a=this.peer_connections[n]),a&&t.description&&a.setRemoteDescription(new RTCSessionDescription(t.description),(function(){}),this.logError)}},{key:"sendCandidate",value:function(e,t){var n={type:"candidate",to:e,candidate:t};this.send(n)}},{key:"onCandidate",value:function(e){var t=e,n=t.from,a=null;n in this.peer_connections&&(a=this.peer_connections[n]),a&&t.candidate&&a.addIceCandidate(new RTCIceCandidate(t.candidate))}},{key:"onLeave",value:function(e){var t=e.data;console.log("leave",t),this.trigger("leave",t),this.removeConnection(t)}},{key:"removeConnection",value:function(e){var t=this.peer_connections,n=t[e];void 0!==n&&(n.close(),delete t[e],this.trigger("connection_removed",e))}},{key:"sendBye",value:function(){this.send({type:"bye"})}},{key:"onBye",value:function(e){var t=e.data,n=t.from,a=t.to;console.log("bye: ",t.session_id);var o=this.peer_connections,r=o[a]||o[n];void 0!==r&&(r.close(),delete o[a],this.trigger("call_end",a))}},{key:"closeMediaStream",value:function(e){if(e)for(var t=e.getTracks(),n=0,a=t.length;n<a;n++)t[n].stop()}},{key:"logError",value:function(e){console.log("logError",e)}}]),e}(),I=o.a.forwardRef((function(e,t){return o.a.createElement(O.a,Object.assign({direction:"up",ref:t},e))})),L=function(e){function t(e){var n;Object(s.a)(this,t),(n=Object(l.a)(this,Object(d.a)(t).call(this,e))).handleChange=function(e){n.setState({peerid:e.target.value})},n.handleOnCall=function(e){n.webrtc.call(e,"video"),n.handleClose(),console.log("call")},n.handleClickOpen=function(){n.setState({open:!0})},n.handleClose=function(){n.setState({open:!1})},n.webrtc=new x,n.streams=new Map;var a="noname";return n.props.location.state&&(a=n.props.location.state.name),n.state={localstream:null,peers:[],peerid:null,streams:new Map,open:!1,name:a},n}return Object(u.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){this.startConnection()}},{key:"componentDidUpdate",value:function(){Array.from(this.streams).map((function(e){var t=Object(h.a)(e,2),n=t[0],a=t[1];document.getElementById(n).srcObject=a}))}},{key:"connectWebsocket",value:function(){var e=this;this.webrtc.setClientInfo(this.state.name),this.webrtc.connect("wss://webrtc-ahmetcan.herokuapp.com/signal",!0),this.webrtc.addEvent("opened",(function(e){})),this.webrtc.addEvent("message",(function(e){console.log(e)})),this.webrtc.addEvent("peers_changed",(function(t){console.log(t),e.setState({peers:t})})),this.webrtc.addEvent("on_add_stream",(function(t,n){e.streams.set(t,n),e.setState({streams:e.streams})})),this.webrtc.addEvent("on_remove_stream",(function(t,n){e.streams.delete(t),e.setState({streams:e.streams})}))}},{key:"startConnection",value:function(){var e=this,t=this;this.peer_id=this.webrtc.getPeerId(),this.webrtc.createLocalStream("video",!0).then((function(n){e.setState({localstream:n}),e.streams.set(e.peer_id,n),e.setState({streams:e.streams}),t.connectWebsocket()}))}},{key:"render",value:function(){var e=this,t=this.props.classes,n=this.state.peers.map((function(t){return o.a.createElement(j.a,{onClick:function(){e.handleOnCall(t.peerid)}},o.a.createElement(D.a,{primary:t.name+" PeerID:"+t.peerid}),o.a.createElement(A.a,null,o.a.createElement(v.a,{edge:"end","aria-label":"CALL",onClick:function(){e.handleOnCall(t.peerid)}},o.a.createElement(y.a,null))))}));return o.a.createElement("div",{className:t.root},o.a.createElement(g.a,{position:"static"},o.a.createElement(p.a,null,o.a.createElement(_.a,{edge:"start",color:"secondary","aria-label":"add",className:t.fab,onClick:this.handleClickOpen},o.a.createElement(y.a,null)),o.a.createElement(f.a,{variant:"h6",className:t.title},this.state.peers.length,"<= Connect To Peer"),o.a.createElement("a",{style:{color:"white"},href:"https://github.com/ahmetcancomtr",target:"_blank"},"Ahmet CAN/GitHub"))),o.a.createElement(M.a,{container:!0,spacing:3,direction:"row",justify:"center",alignItems:"center"},Array.from(this.state.streams).map((function(e){var t=Object(h.a)(e,2),n=t[0];t[1];return o.a.createElement(M.a,{item:!0,xs:!0},o.a.createElement("video",{style:{width:"100%",height:"100%"},id:n,autoPlay:!0,playsInline:!0}))}))),o.a.createElement(S.a,{fullScreen:!0,open:this.state.open,onClose:this.handleClose,TransitionComponent:I},o.a.createElement(g.a,{className:t.appBar},o.a.createElement(p.a,null,o.a.createElement(v.a,{edge:"start",color:"inherit",onClick:this.handleClose,"aria-label":"close"},o.a.createElement(E.a,null)),o.a.createElement(f.a,{variant:"h6",className:t.title},"Press Call Button On List"))),o.a.createElement(R.a,null,n)))}}]),t}(o.a.Component),U=Object(b.a)((function(e){return Object(w.a)(Object(m.a)({root:{flexGrow:1},menuButton:{marginRight:e.spacing(2)},title:{flexGrow:1},fab:{margin:e.spacing(1)},appBar:{position:"relative"}},"title",{marginLeft:e.spacing(2),flex:1}))}))(L),B=(n(84),n(145)),G=n(144),J=n(140),W=n(141),z=n(143),H=n(142),F=n(31),$=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(l.a)(this,Object(d.a)(t).call(this,e))).okHandle=function(){n.setState({isRedirect:!0})},n.onChangeHandle=function(e){n.setState({name:e.target.value})},n.state={name:null,isRedirect:!1},n}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){if(this.state.isRedirect)return o.a.createElement(F.a,{to:{pathname:"/app",state:{name:this.state.name}}});var e=this.props.classes;return o.a.createElement(o.a.Fragment,null,o.a.createElement("div",{className:"bg"},o.a.createElement("div",{className:"toptitle"},o.a.createElement("h2",null,"ReactJS WebRTC Demo (Asp.Net Core SinglePageApp)"),o.a.createElement("h3",null,o.a.createElement("a",{href:"https://github.com/ahmetcancomtr",style:{color:"#000000"}},"https://github.com/ahmetcancomtr"),o.a.createElement("br",null))),o.a.createElement(J.a,{className:e.card+" login-box"},o.a.createElement(W.a,{className:e.CardActionArea},o.a.createElement(H.a,null,o.a.createElement(B.a,{label:"Name",className:e.textField,value:this.state.name,onChange:this.onChangeHandle,margin:"normal",variant:"outlined"}))),o.a.createElement(z.a,null,o.a.createElement(G.a,{size:"small",variant:"contained",color:"primary",className:e.button,onClick:this.okHandle},"Ok")))))}}]),t}(o.a.Component),q=Object(b.a)((function(e){return Object(w.a)({button:{margin:e.spacing(1),marginLeft:"auto"},input:{display:"none"},CardActionArea:{height:"100px"},textField:{marginLeft:e.spacing(1),marginRight:e.spacing(1)}})}))($),K=n(47),Q=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(l.a)(this,Object(d.a)(t).call(this,e))).state={},n}return Object(u.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return o.a.createElement(K.a,null,o.a.createElement(F.b,{path:"/",exact:!0,component:q}),o.a.createElement(F.b,{path:"/app/",component:U}))}}]),t}(o.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(o.a.createElement(Q,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[74,1,2]]]);
//# sourceMappingURL=main.4461ece9.chunk.js.map