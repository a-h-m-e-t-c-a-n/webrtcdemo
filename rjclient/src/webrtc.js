// Ahmet CAN 
// http://ahmetcan.com.tr 
// eposta@ahmetcan.com.tr
// 19.09.2019
//webrtc client 

class webrtc{
    websocket;
    retry;
    url;
    OnEvent;
    constructor() {
        this.OnEvent = new Map();
        this.peer_connections = {};
        this.peer_id = this.IDGenerator();
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            window.navigator.getUserMedia = window.navigator.mediaDevices.getUserMedia;
        }
        else {
            window.navigator.getUserMedia = window.navigator.getUserMedia || window.navigator.mozGetUserMedia || window.navigator.webkitGetUserMedia || window.navigator.msGetUserMedia;

        }


    } 
    getPeerId() {
        return this.peer_id;
    }
    setClientInfo(name) {
        this.name = name;
    }
    addEvent(type, cb) {
        var set = this.OnEvent[type];
        if (!set) {
            set = new Set();
            this.OnEvent[type] = set;
        }
        set.add(cb);
    }
    trigger(type,...prm) {
        var evt = this.OnEvent[type]
        if(evt)evt.forEach((cb) => cb(...prm,this));
    }

    //websocket connection implementations
    IDGenerator() {
        this.length = 8;
        this.timestamp = +new Date;

        var _getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        var ts = this.timestamp.toString();
        var parts = ts.split("").reverse();
        var id = "";

        for (var i = 0; i < this.length; ++i) {
            var index = _getRandomInt(0, parts.length - 1);
            id += parts[index];
        }

        return id;
    }
    connect(url, retry = true) {
        var _this = this;//websocket events have different context,we will reference this class for websocket events
        this.retry = this.retry || retry;

        var urlObj = new URL(url);
        urlObj.searchParams.set("id", this.peer_id);
        this.url = urlObj.toString();


        
        if (this.websocket) this.disconnect();
        this.websocket = new WebSocket(_this.url);


        this.websocket.onerror = function (error) {
            console.log("websocket error ->"+error);
            if (_this.retry) {
                _this.connect(url, retry);
            }
            _this.trigger("error",error);

        }
        this.websocket.onopen = function () {
            console.log("websocket has been opened");
            _this.trigger("opened");
            _this.keepalive_timer = setInterval(this.keepAlive, 15000);

            _this.register();
        };

        this.websocket.onmessage = function (evt) {
            var received_msg = evt.data;
            this.trigger("message",received_msg);
            this.OnMessage(received_msg);
        }.bind(this);

        this.websocket.onclose = function (evt) {
            console.log("websocket has been closed");
            _this.trigger("closed");
            if (_this.retry) {
                _this.connect(url, retry);
            }
        };
     
    }
    register() {
        var _this = this;
        
        var message = {
            type: "register",
            name: _this.name,
            useragent: navigator.userAgent,
        };
        _this.send(message);
    }
    keepAlive() {
        this.send({ type: 'keepalive', data: {} });
        console.log('Sent keepalive');
    }
    send(data) {
        this.websocket.send(JSON.stringify(data));
    }
    disconnect() {
        window.clearInterval(this.keepalive_timer);
        this.retry = false;
        this.websocket.close();
        this.websocket = null;
    }

    //signal server protocol implementations


    configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }], "sdpSemantics": 'plan-b' };
    RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.msRTCPeerConnection;
    RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription || window.msRTCSessionDescription;

     

   
    OnMessage(message) {
        var _this = this;
        var parsedMessage = JSON.parse(message);

        console.info('signal server message: {\n type = ' + parsedMessage.type + ', \n  data = ' + JSON.stringify(parsedMessage.data) + '\n}');

        switch (parsedMessage.type) {
            case 'call':
                _this.onInvite(parsedMessage);
                break;
            case 'ringing':
                _this.onRinging(parsedMessage);
                break;
            case 'offer':
                _this.onOffer(parsedMessage);
                break;
            case 'answer':
                _this.onAnswer(parsedMessage);
                break;
            case 'candidate':
                _this.onCandidate(parsedMessage);
                break;
            case 'peer_changed':
                _this.onPeers(parsedMessage);
                break;
            case 'leave':
                _this.onLeave(parsedMessage);
                break;
            case 'bye':
                _this.onBye(parsedMessage);
                break;
            case 'keepalive':
                console.log('keepalive response!');
                break;
            default:
                console.error('Unrecognized message', parsedMessage);
        }

       

    }
    async createLocalStream(type, audio = false, size = { width: 640, height: 400  }) {
        var _this = this;
        if (_this.local_stream) return _this.local_stream;
       
        var constraints = {
            audio: audio,
            video: type === 'video' ? size : false
        };
        _this.local_stream = await navigator.mediaDevices.getUserMedia(constraints);
        _this.trigger("open_local_stream", _this.local_stream);
        return _this.local_stream;
       
    }
    closeLocalStream() {
        var _this = this;
        if (_this.local_stream != null) {
            _this.closeMediaStream(_this.local_stream);
            _this.local_stream = null;
        }
    }
    call(peer_id,media) {
        var _this = this;
        if (!_this.local_stream) {
            throw new Error("local stream must be opened");
        }
        _this.createPeerConnection(peer_id, media, true, _this.local_stream);
        _this.trigger('new_call', _this.self_id, _this.session_id);
    };

   

    createOffer(pc,id,media) {
        var _this = this;
        pc.createOffer(function (desc) {
            console.log('create_offer: ', desc.sdp);
            pc.setLocalDescription(desc, function () {
                console.log('setLocalDescription', pc.localDescription);
                _this.sendOffer(id,media,pc.localDescription);
            }, _this.logError);
        }, _this.logError);
    }

    createPeerConnection(id, media, isOffer, localstream) {
        var _this = this;
        var pc = new RTCPeerConnection(this.configuration);
        _this.peer_connections["" + id] = pc;
        pc.onicecandidate = function (event) {
            console.log('onicecandidate', event);
            if (event.candidate) {
                _this.sendCandidate(id,event.candidate);
            }
        };

        pc.onnegotiationneeded = function () {
            console.log('onnegotiationneeded');
        };

        pc.oniceconnectionstatechange = function (event) {

            console.log('oniceconnectionstatechange', event);
            var currentState = event.currentTarget.iceConnectionState;
            if (currentState === 'connected') {
                //_this.createDataChannel(pc);
                console.log("video_connected");
                _this.trigger('video_connected', id, event.stream);

            }
            else if (currentState === 'disconnected') {
                console.log("video_disconnected");
                _this.trigger('video_disconnected', id, event.stream);

            }
            else if (currentState === 'failed' || currentState === 'closed') {
                console.log("video_closed");
                _this.removeConnection(id);

            }
        };
        pc.onsignalingstatechange = function (event) {
            console.log('onsignalingstatechange', event);
        };

        pc.onaddstream = function (event) {
            console.log('onaddstream', event);
            _this.trigger('on_add_stream',id ,event.stream);
        };

        pc.onremovestream = function (event) {
            console.log('onremovestream', event);
            _this.trigger('on_remove_stream',id,event.stream);
        };

        pc.addStream(localstream);

        if (isOffer) _this.createOffer(pc, id, media);
        return pc;
    }

    createDataChannel(pc) {
        if (pc.textDataChannel) {
            return;
        }
        var dataChannel = pc.createDataChannel("text");

        dataChannel.onerror = function (error) {
            console.log("dataChannel.onerror", error);
        };

        dataChannel.onmessage = function (event) {
            console.log("dataChannel.onmessage:", event.data);
        };

        dataChannel.onopen = function () {
            console.log('dataChannel.onopen');
        };

        dataChannel.onclose = function () {
            console.log("dataChannel.onclose");
        };

        pc.textDataChannel = dataChannel;
    }

    onPeers(message) {
        var _this = this;
        var peers = message.peers;
        console.log("peers = " + JSON.stringify(peers));
        _this.trigger('peers_changed', peers);
    }
    sendOffer(id,media,localDescription) {
        var _this = this;
        var message = {
            type: 'offer',
            to: id,
            media: media,
            description: localDescription
        };
        _this.send(message);
    }
    onOffer(message) {
        var _this=this;
        var data = message;
        var from = data.from;
        console.log("data:" + data);
        var media = data.media;
        _this.trigger('new_call', from);

        if (_this.local_stream) {
            var pc = _this.createPeerConnection(from, media, false, _this.local_stream);

            if (pc && data.description) {
                pc.setRemoteDescription(
                    new RTCSessionDescription(data.description), function () {
                        if (pc.remoteDescription.type == "offer") {//if offer
                            pc.createAnswer(function (desc) {
                                console.log('createAnswer: ', desc);
                                pc.setLocalDescription(desc, function () {
                                    console.log('setLocalDescription', pc.localDescription);
                                    _this.sendAnswer(from, pc.localDescription);
                                }, _this.logError);
                            }, _this.logError);
                        }//if offer
                    }, _this.logError);
            }
        }
        else {
            console.log("onOffer error local stream not open");
        }
    }
    sendAnswer(from, localDescription) {
        var _this = this;
        var message = {
            type: 'answer',
            to: from,
            description: localDescription
        };
        _this.send(message);
    }
   
    onAnswer(message) {
        var _this = this;
        var data = message;
        var from = data.from;
        var pc = null;
        if (from in _this.peer_connections) {
            pc = _this.peer_connections[from];
        }
        if (pc && data.description) {
            //console.log('on answer sdp', data);
            pc.setRemoteDescription(new RTCSessionDescription(data.description), function () { }, _this.logError);
        }
    }
    sendCandidate(toId, candidate) {
        var _this = this;

        var message = {
            type: 'candidate',
            to: toId,
            candidate: candidate
        };
        _this.send(message);
    }
    onCandidate(message) {
        var _this = this;
        var data = message;
        var from = data.from;
        var pc = null;
        if (from in _this.peer_connections) {
            pc = _this.peer_connections[from];
        }
        if (pc && data.candidate) {
            pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
    }

    onLeave(message) {
        var _this = this;
        var id = message.data;
        console.log('leave', id);
        _this.trigger('leave', id);
        _this.removeConnection(id);

        
    }
    removeConnection(id) {
        var _this = this;
        var peerConnections = _this.peer_connections;
        var pc = peerConnections[id];
        if (pc !== undefined) {
            pc.close();
            delete peerConnections[id];
            _this.trigger('connection_removed', id);

        }
    }
    sendBye() {
        var _this = this;
        var message = {
            type: 'bye'
        };
        _this.send(message);
    };
    onBye(message) {
        var _this = this;
        var data = message.data;
        var from = data.from;
        var to = data.to;
        console.log('bye: ', data.session_id);
        var peerConnections = _this.peer_connections;
        var pc = peerConnections[to] || peerConnections[from];
        if (pc !== undefined) {
            pc.close();
            delete peerConnections[to];
            _this.trigger('call_end', to);
        }
       
    }


    closeMediaStream(stream) {
        if (!stream) return;

        var tracks = stream.getTracks();

        for (var i = 0, len = tracks.length; i < len; i++) {
            tracks[i].stop();
        }
    }
    logError(error) {
        console.log("logError", error);
    };
}

export default webrtc;