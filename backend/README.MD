Method for setting voting data
```
POST: /api/voting
```
REQUEST

Addresses must include the "0x" prefix
```azure
{
    "address": "XXXXXXXXXXXXXX",
    "public_address": "XXXXXXXXXXXXXX",
    "signature": "XXXXXXXXXXXXXX",
    "description": "XXXXXXXXXXXXXX"
}
```
```azure
signature = sig ( address string + description string )
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