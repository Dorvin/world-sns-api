import {Post, PostState, Session, User, VerificationLevel} from "../model/models.ts";
import {CreateUserDto} from "../dto/dtos.ts";
import {getRandomToken} from "../utils/random.ts";

export class Repository {
  private users: User[] = [];
  private posts: Post[] = [];
  private sessions: Session[] = [];

  constructor() {
    this.users = [];
    this.posts = [];
    this.sessions = [];
  }

  getUserByEmail(email: string): User | undefined {
    const user = this.users.find(user => user.email === email);
    if (!user) {
      return undefined;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const votedAt = new Date(user.votedAt);
    votedAt.setHours(0, 0, 0, 0);
    if (votedAt.getTime() < today.getTime()) {
      user.todayAvailableVoteCount = 5;
    }

    const posts = this.getPosts()
    for (const post of posts) {
      if (post.userEmail === email) {
        user.reliability.total += 1;
        if (post.state === 'onChallenge') {
          user.reliability.onChallenge += 1;
        } else if (post.state === 'undefined') {
          user.reliability.undefined += 1;
        } else if (post.state === 'confirmed') {
          user.reliability.confirmed += 1;
        } else if (post.state === 'bad') {
          user.reliability.bad += 1;
        }
        if (user.reliability.total > user.reliability.onChallenge) {
          user.reliability.score = (user.reliability.confirmed - user.reliability.bad) / (user.reliability.total - user.reliability.onChallenge);
        } else {
          user.reliability.score = undefined
        }
      }
    }
    return user;
  }

  createUserIfNotExists(user: CreateUserDto): void {
    if (!this.getUserByEmail(user.email)) {
      this.users.push({
        ...user,
        worldBalance: 10,
        todayAvailableVoteCount: 5,
        votedAt: 0,
        reliability: {
          total: 0,
          onChallenge: 0,
          undefined: 0,
          confirmed: 0,
          bad: 0,
          score: undefined,
        },
      });
    }
  }

  getUserEmailFromSessionToken(token: string): string | undefined {
    const session = this.sessions.find(session => session.token === token);
    if (session && session.expireAt > Date.now()) {
      return session.userEmail;
    }
    return undefined;
  }

  getOrCreateSession(userEmail: string): string {
    const existingSession = this.sessions.find(session => session.userEmail === userEmail);
    if (existingSession && existingSession.expireAt > Date.now()) {
      return existingSession.token;
    }

    const token = getRandomToken(7);
    const expireAt = Date.now() + 7 * 60 * 60 * 1000;
    this.sessions.push({userEmail, token, expireAt});
    return token;
  }

  createPost(content: string, userEmail: string): Post {
    const post: Post = {
      id: this.posts.length + 1,
      content,
      createdAt: Date.now(),
      state: 'onChallenge',
      vote: {
        good: 0,
        bad: 0,
        goodVoterEmails: [],
        badVoterEmails: [],
      },
      claimed: false,
      replies: [],
      userEmail,
    }
    this.posts.push(post);
    return post;
  }

  getPosts(): Post[] {
    // update post state
    for (const post of this.posts) {
      if (Date.now() - post.createdAt < 7 * 24 * 60 * 60 * 1000) {
        post.state = 'onChallenge';
      } else {
        const total = post.vote.good + post.vote.bad;
        if (total === 0) {
          post.state = 'undefined';
        } else if (post.vote.good / total > 0.7) {
          post.state = 'confirmed';
        } else if (post.vote.bad / total > 0.7) {
          post.state = 'bad';
        } else {
          post.state = 'undefined';
        }
      }
    }
    return this.posts;
  }

  findPosts(state?: PostState, verificationLevel?: VerificationLevel): Post[] {
    const posts = this.getPosts()
    return posts.filter(post => {
      if (state && post.state !== state) {
        return false;
      }
      if (verificationLevel && this.getUserByEmail(post.userEmail)!.verificationLevel !== verificationLevel) {
        return false;
      }
      return true;
    });
  }

  getPost(id: number): Post | undefined {
    const posts = this.getPosts();
    return posts.find(post => post.id === id);
  }
}