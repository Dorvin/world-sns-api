# world-sns-api

## API

```
POST /login

Request Body
{
    "code": "world-login-code"
}

Response Body
{
    "user": {
        "email": "",
        "name": "",
        "givenName": "",
        "familyName": "",
        "likelyHuman": "strong" | "weak",
        "credentialType": "orb" | null,
        "worldBalance": 0,
        "todayAvailableVoteCount": 5,
        "reliability": {
            "total": 10
            "good": 8,
            "bad": 1,
            "score": 0.7
        }
    }
    "session": "session-token"
}
```
```
GET /users/me

Header
World-Sns-Session: "session-token"

Response Body
{
    "email": "",
    "name": "",
    "givenName": "",
    "familyName": "",
    "likelyHuman": "strong" | "weak",
    "credentialType": "orb" | null,
    "worldBalance": 0,
    "todayAvailableVoteCount": 5,
    "reliability": {
        "total": 10
        "good": 8,
        "bad": 1,
        "score": 0.7
    }
}
```
```
GET /users/{email}

Header
World-Sns-Session: "session-token"

Response Body
{
    "email": "",
    "name": "",
    "givenName": "",
    "familyName": "",
    "likelyHuman": "strong" | "weak",
    "credentialType": "orb" | null,
    "worldBalance": 0,
    "todayAvailableVoteCount": 5,
    "reliability": {
        "total": 10
        "good": 8,
        "bad": 1,
        "score": 0.7
    }
}
```
```
POST /posts

Header
World-Sns-Session: "session-token"

Request Body
{
    "content": ""
}

Response Body
{
    "id": 1,
    "content": "",
    "createdAt": 12312312,
    "state": "onChallenge" | "undefined" | "confirmed" | "bad",
    "vote": {
        "good": 11,
        "bad: 2,
    },
    "claimable": false,
    "user": {
        "email": "",
        "name": "",
        "givenName": "",
        "familyName": "",
        "likelyHuman": "strong" | "weak",
        "credentialType": "orb" | null,
        "worldBalance": 0,
        "todayAvailableVoteCount": 5,
        "reliability": {
            "total": 10
            "good": 8,
            "bad": 1,
            "score": 0.7
        }
    }
}
```
```
GET /posts?state=confirmed&likelyHuman=strong

Response Body
{
    "posts": [
        {
            "id": 1,
            "content": "",
            "createdAt": 12312312,
            "state": "onChallenge" | "undefined" | "confirmed" | "bad",
            "vote": {
                "good": 11,
                "bad: 2,
            },
            "claimable": false,
            "user": {
                "email": "",
                "name": "",
                "givenName": "",
                "familyName": "",
                "likelyHuman": "strong" | "weak",
                "credentialType": "orb" | null,
                "worldBalance": 0,
                "todayAvailableVoteCount": 5,
                "reliability": {
                    "total": 10
                    "good": 8,
                    "bad": 1,
                    "score": 0.7
                }
            }
        },
        ...
    ]
}
```
```
POST /posts/{id}/votes

Header
World-Sns-Session: "session-token"

Request Body
{
    "vote": "good" | "bad"
}

Response Body
{
    "id": 1,
    "content": "",
    "createdAt": 12312312,
    "state": "onChallenge" | "undefined" | "confirmed" | "bad",
    "vote": {
        "good": 11,
        "bad: 2,
    },
    "claimable": false,
    "user": {
        "email": "",
        "name": "",
        "givenName": "",
        "familyName": "",
        "likelyHuman": "strong" | "weak",
        "credentialType": "orb" | null,
        "worldBalance": 0,
        "todayAvailableVoteCount": 5,
        "reliability": {
            "total": 10
            "good": 8,
            "bad": 1,
            "score": 0.7
        }
    }
}
```
```
POST /posts/{id}/claim

Header
World-Sns-Session: "session-token"

Response Body
{
    "id": 1,
    "content": "",
    "createdAt": 12312312,
    "state": "onChallenge" | "undefined" | "confirmed" | "bad",
    "vote": {
        "good": 11,
        "bad: 2,
    },
    "claimable": false,
    "user": {
        "email": "",
        "name": "",
        "givenName": "",
        "familyName": "",
        "likelyHuman": "strong" | "weak",
        "credentialType": "orb" | null,
        "worldBalance": 0,
        "todayAvailableVoteCount": 5,
        "reliability": {
            "total": 10
            "good": 8,
            "bad": 1,
            "score": 0.7
        }
    }
}
```

## Dependency

To install dependencies:

```bash
bun install
```

## Run

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.10. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
