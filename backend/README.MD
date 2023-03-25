Method for setting voting data
```
POST: /api/voting
```
REQUEST
```azure
{
    "address": "XXXXXXXXXXXXXX",
    "public_address": "XXXXXXXXXXXXXX",
    "signature": "XXXXXXXXXXXXXX",
    "description": "XXXXXXXXXXXXXX"
}
```

Method for getting voting data
```
GET: /api/voting/<address>
```
RESPONSE
```azure
{
    "address": "XXXXXXXXXXXXXX",
    "public_address": "XXXXXXXXXXXXXX",
    "signature": "XXXXXXXXXXXXXX",
    "description": "XXXXXXXXXXXXXX"
}
```