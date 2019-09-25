using SohbetServer.WebSocketLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace SohbetServer.WebSocketHandlers
{
    public class TestHandler : WebSocketLib.WebSocketHandler
    {
        public TestHandler(WebSocketConnectionManager webSocketConnectionManager)
                                                    : base(webSocketConnectionManager)
        {
        }
        public override async Task OnMessage(WebSocket socket, WebSocketReceiveResult result, string receivedMessage)
        {
            await SendMessageAsync(socket, "ok");
        }
    }
}
