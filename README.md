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
        "email": "0x280720931601047342a0b80d57d5594d91c879b27664dab4c787edfb8e6bb36d@id.worldcoin.org",
        "name": "World ID User",
        "givenName": "World ID",
        "familyName": "User",
        "verificationLevel": "orb",
        "worldBalance": 10,
        "todayAvailableVoteCount": 5,
        "votedAt": 0,
        "reliability": {
            "total": 0,
            "onChallenge": 0,
            "undefined": 0,
            "confirmed": 0,
            "bad": 0
        }
    },
    "sessionToken": "xXEQQZl"
}
```
```
GET /users/me

Header
World-Sns-Session: "session-token"

Response Body
{
    "user": {
        "email": "0x280720931601047342a0b80d57d5594d91c879b27664dab4c787edfb8e6bb36d@id.worldcoin.org",
        "name": "World ID User",
        "givenName": "World ID",
        "familyName": "User",
        "verificationLevel": "orb",
        "worldBalance": 10,
        "todayAvailableVoteCount": 5,
        "votedAt": 0,
        "reliability": {
            "total": 0,
            "onChallenge": 0,
            "undefined": 0,
            "confirmed": 0,
            "bad": 0
        }
    }
}
```
```
GET /users/{email}

Header
World-Sns-Session: "session-token"

Response Body
{
    "user": {
        "email": "0x280720931601047342a0b80d57d5594d91c879b27664dab4c787edfb8e6bb36d@id.worldcoin.org",
        "name": "World ID User",
        "givenName": "World ID",
        "familyName": "User",
        "verificationLevel": "orb",
        "worldBalance": 10,
        "todayAvailableVoteCount": 5,
        "votedAt": 0,
        "reliability": {
            "total": 0,
            "onChallenge": 0,
            "undefined": 0,
            "confirmed": 0,
            "bad": 0
        }
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
    "post": {
        "id": 1,
        "content": "test post content",
        "createdAt": 1716216384969,
        "state": "onChallenge",
        "vote": {
            "good": 0,
            "bad": 0,
            "goodVoterEmails": [],
            "badVoterEmails": []
        },
        "claimed": false,
        "replies": [],
        "user": {
            "email": "0x280720931601047342a0b80d57d5594d91c879b27664dab4c787edfb8e6bb36d@id.worldcoin.org",
            "name": "World ID User",
            "givenName": "World ID",
            "familyName": "User",
            "verificationLevel": "orb",
            "worldBalance": 10,
            "todayAvailableVoteCount": 5,
            "votedAt": 0,
            "reliability": {
                "total": 1,
                "onChallenge": 1,
                "undefined": 0,
                "confirmed": 0,
                "bad": 0
            }
        }
    }
}
```
```
GET /posts?state=onChallenge&verificationLevel=orb

Response Body
{
    "posts": [
        {
            "id": 1,
            "content": "test post content",
            "createdAt": 1716216384969,
            "state": "onChallenge",
            "vote": {
                "good": 0,
                "bad": 0,
                "goodVoterEmails": [],
                "badVoterEmails": []
            },
            "claimed": false,
            "replies": [],
            "user": {
                "email": "0x280720931601047342a0b80d57d5594d91c879b27664dab4c787edfb8e6bb36d@id.worldcoin.org",
                "name": "World ID User",
                "givenName": "World ID",
                "familyName": "User",
                "verificationLevel": "orb",
                "worldBalance": 10,
                "todayAvailableVoteCount": 5,
                "votedAt": 0,
                "reliability": {
                    "total": 9,
                    "onChallenge": 9,
                    "undefined": 0,
                    "confirmed": 0,
                    "bad": 0
                }
            }
        }
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
    "post": {
        "id": 2,
        "content": "test post content2",
        "createdAt": 1716216537904,
        "state": "onChallenge",
        "vote": {
            "good": 0,
            "bad": 1,
            "goodVoterEmails": [],
            "badVoterEmails": [
                "0x280720931601047342a0b80d57d5594d91c879b27664dab4c787edfb8e6bb36d@id.worldcoin.org"
            ]
        },
        "claimed": false,
        "replies": [],
        "user": {
            "email": "0x280720931601047342a0b80d57d5594d91c879b27664dab4c787edfb8e6bb36d@id.worldcoin.org",
            "name": "World ID User",
            "givenName": "World ID",
            "familyName": "User",
            "verificationLevel": "orb",
            "worldBalance": 10,
            "todayAvailableVoteCount": 3,
            "votedAt": 1716216635130,
            "reliability": {
                "total": 29,
                "onChallenge": 29,
                "undefined": 0,
                "confirmed": 0,
                "bad": 0
            }
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
    "post": {
        "id": 2,
        "content": "test post content2",
        "createdAt": 1716216537904,
        "state": "bad",
        "vote": {
            "good": 0,
            "bad": 1,
            "goodVoterEmails": [],
            "badVoterEmails": [
                "0x280720931601047342a0b80d57d5594d91c879b27664dab4c787edfb8e6bb36d@id.worldcoin.org"
            ]
        },
        "claimed": true,
        "replies": [],
        "user": {
            "email": "0x280720931601047342a0b80d57d5594d91c879b27664dab4c787edfb8e6bb36d@id.worldcoin.org",
            "name": "World ID User",
            "givenName": "World ID",
            "familyName": "User",
            "verificationLevel": "orb",
            "worldBalance": 10,
            "todayAvailableVoteCount": 3,
            "votedAt": 1716216635130,
            "reliability": {
                "total": 29,
                "onChallenge": 29,
                "undefined": 0,
                "confirmed": 0,
                "bad": 0
            }
        }
    }
}
```
```
POST /posts/{id}/replies

Header
World-Sns-Session: "session-token"

Request Body
{
    "reply: "reply content"
}

Response Body
{
    "post": {
        "id": 2,
        "content": "test post content2",
        "createdAt": 1716216537904,
        "state": "onChallenge",
        "vote": {
            "good": 0,
            "bad": 1,
            "goodVoterEmails": [],
            "badVoterEmails": [
                "0x280720931601047342a0b80d57d5594d91c879b27664dab4c787edfb8e6bb36d@id.worldcoin.org"
            ]
        },
        "claimed": false,
        "replies": [
            {
                "content": "first reply of this post",
                "createdAt": 1716216818370,
                "user": {
                    "email": "0x280720931601047342a0b80d57d5594d91c879b27664dab4c787edfb8e6bb36d@id.worldcoin.org",
                    "name": "World ID User",
                    "givenName": "World ID",
                    "familyName": "User",
                    "verificationLevel": "orb",
                    "worldBalance": 10,
                    "todayAvailableVoteCount": 3,
                    "votedAt": 1716216635130,
                    "reliability": {
                        "total": 51,
                        "onChallenge": 51,
                        "undefined": 0,
                        "confirmed": 0,
                        "bad": 0
                    }
                }
            }
        ],
        "user": {
            "email": "0x280720931601047342a0b80d57d5594d91c879b27664dab4c787edfb8e6bb36d@id.worldcoin.org",
            "name": "World ID User",
            "givenName": "World ID",
            "familyName": "User",
            "verificationLevel": "orb",
            "worldBalance": 10,
            "todayAvailableVoteCount": 3,
            "votedAt": 1716216635130,
            "reliability": {
                "total": 51,
                "onChallenge": 51,
                "undefined": 0,
                "confirmed": 0,
                "bad": 0
            }
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
