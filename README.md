# Shadclient with Lagrange

This a web client for tencent.

> Please take care of your own information when using this client and protect yourself from csrf attacks.

## Dependencies

- Solid-js
- Lagrange.Core
- shadcn-ui with solid-js
- unocss (with preset icons)
- iconify-json/teenyicons
- solid-js/use
- zoom-image

## Usage

### Backend (Lagrange.OneBot)

In the `appsettings.json`, set the following options:

```diff
{
    "Message": {
+       "IgnoreSelf": false,
+       "StringPost": false
    },
    "Implementations": [
        {
+           "Type": "ForwardWebSocket",
+           "Host": "127.0.0.1",
+           "Port": 8080,
            "ReconnectInterval": 5000,
            "HeartBeatInterval": 5000,
            "AccessToken": ""
        }
    ]
}
```

### Frontend (Shadclient)

- Open the website https://scq.widcard.win/ in your borwser (local WS connection on Safari is not supported).
- Click on the *Settings* button, and enter the Forward WebSocket URL of your Lagrange.OneBot backend (for example, `ws://127.0.0.1:8080`).
- Click on the *Link* button. If it toasts ***Connection established***, you are ready to use the client.

## License

MIT
