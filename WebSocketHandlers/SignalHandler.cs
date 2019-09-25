using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using SohbetServer.WebSocketLib;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace SohbetServer.WebSocketHandlers
{
    public class SignalHandler : WebSocketLib.WebSocketHandler
    {
        private ConcurrentDictionary<string, PeerInfo> infoList = new ConcurrentDictionary<string, PeerInfo>();

        public class SignalData{
            public String type { get; set; }
            public String name { get; set; }
            public String useragent { get; set; }
            public List<PeerInfo> peers { get; set; }
            public String from { get; set; }
            public String to { get; set; }
            public String media { get; set; }
            public dynamic description { get; set; }
            public dynamic candidate { get; set; }

        }
        public class PeerInfo
        {
            public String peerid { get; set; }
            public String name { get; set; }
            public String useragent { get; set; }
        }


        public SignalHandler(WebSocketConnectionManager webSocketConnectionManager)
                                                    : base(webSocketConnectionManager)
        {
        }
        public override async Task OnConnected(WebSocket socket, HttpContext context)
        {
            WebSocketConnectionManager.AddSocket(context.Request.Query["id"], socket);//for demostration purpose ,we are getting id from query string
        }
        public override async Task OnDisconnected(WebSocket socket)
        {
            var peerid = WebSocketConnectionManager.GetId(socket);

            if (peerid != null)
            {
                infoList.TryRemove(peerid, out PeerInfo val);
                SendPeerChangedEvent();
            }
            
            await base.OnDisconnected(socket);

        }
        public async void OnRegister(string from,SignalData message)
        {
            PeerInfo peerInfo = new PeerInfo()
            {
                peerid=from,
                name = message.name,
                useragent = message.useragent
            };

            infoList.TryAdd(from, peerInfo);
            SendPeerChangedEvent();

        }
        public async void OnOffer(string from, SignalData message)
        {
            message.from = from;
            await SendMessageAsync(WebSocketConnectionManager.GetSocketById(message.to),JsonConvert.SerializeObject(message));
        }
        public async void OnCandidate(string from, SignalData message)
        {
            message.from = from;
            await SendMessageAsync(WebSocketConnectionManager.GetSocketById(message.to), JsonConvert.SerializeObject(message));
        }
        public async void OnAnswer(string from, SignalData message)
        {
            message.from = from;
            await SendMessageAsync(WebSocketConnectionManager.GetSocketById(message.to), JsonConvert.SerializeObject(message));
        }
        public async void SendPeerChangedEvent()
        {
            var peerChangedMessage=new SignalData();
            peerChangedMessage.type = "peer_changed";
            peerChangedMessage.peers = infoList.Values.ToList();
           
            await SendMessageToAllAsync(JsonConvert.SerializeObject(peerChangedMessage));

        }
        public override async Task OnMessage(WebSocket socket, WebSocketReceiveResult result, string receivedMessage)
        {
            var messageObj=JsonConvert.DeserializeObject<SignalData>(receivedMessage);
            var from=WebSocketConnectionManager.GetId(socket);
            if (from == null)
            {
                Console.WriteLine("OnMessage from id=null");
                return;
            }
            string type=messageObj.type;
            switch (type)
            {
                case "register": OnRegister(from, messageObj);break;
                case "offer": OnOffer(from, messageObj);break;
                case "candidate": OnCandidate(from, messageObj);break;
                case "answer": OnCandidate(from, messageObj);break;
            }

        }
    }
}
