import {Repository} from "../repository/repository.ts";
import {REACT_APP_REDIRECT_URL, REACT_APP_WLD_CLIENT_ID, REACT_APP_WLD_CLIENT_SECRET} from "../const.ts";
import axios from "axios";
import {decode, JwtPayload} from "jsonwebtoken";
import {GetPostDto, GetPostsDto, GetUserDto, LoginResponseDto, PostDto} from "../dto/dtos.ts";
import {Post, PostState, VerificationLevel} from "../model/models.ts";

export class Service {
  private repository: Repository;
  constructor(repository: Repository) {
    this.repository = repository;
  }

  async login(code: string): Promise<LoginResponseDto> {
    // verify code
    const credentials = btoa(
      `${REACT_APP_WLD_CLIENT_ID}:${REACT_APP_WLD_CLIENT_SECRET}`
    );
    const axiosInstance = axios.create({
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const response = await axiosInstance.post("https://id.worldcoin.org/token", {
      code,
      grant_type: "authorization_code",
      redirect_uri: REACT_APP_REDIRECT_URL,
    });
    const { access_token } = response.data;
    const decoded: JwtPayload = decode(access_token) as JwtPayload;

    // create user if not exists
    this.repository.createUserIfNotExists({
      email: decoded.email,
      name: decoded.name,
      givenName: decoded.given_name,
      familyName: decoded.family_name,
      verificationLevel: decoded['https://id.worldcoin.org/v1'].verification_level,
    });

    // get user
    const user = this.repository.getUserByEmail(decoded.email)!;

    // create session
    const sessionToken = this.repository.getOrCreateSession(user.email);
    return {
      user,
      sessionToken,
    }
  }

  getUserByEmail(email: string): GetUserDto {
    const user = this.repository.getUserByEmail(email);
    return {
      user: user ?? null,
    }
  }

  verifySession(sessionToken: string | undefined): string {
    if (!sessionToken) {
      throw new Error('Session token is required');
    }
    const email = this.repository.getUserEmailFromSessionToken(sessionToken);
    if (!email) {
      throw new Error('Invalid session token');
    }
    return email;
  }

  votePost(postId: number, userEmail: string, vote: 'good' | 'bad'): GetPostDto {
    const user = this.repository.getUserByEmail(userEmail);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.todayAvailableVoteCount <= 0) {
      throw new Error('No available vote count');
    }

    const post = this.repository.getPost(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.vote.goodVoterEmails.includes(user.email) || post.vote.badVoterEmails.includes(user.email)) {
      throw new Error('Already voted');
    }

    if (user.worldBalance < 0.1) {
      throw new Error('Not enough balance');
    }

    user.todayAvailableVoteCount -= 1;
    user.worldBalance -= 0.1;
    user.votedAt = Date.now();
    post.vote[vote] += 1;
    post.vote[`${vote}VoterEmails`].push(user.email);

    return {
      post: this.generatePostDto(post),
    }
  }

  likePost(postId: number, userEmail: string): GetPostDto {
    const user = this.repository.getUserByEmail(userEmail);
    if (!user) {
      throw new Error('User not found');
    }

    const post = this.repository.getPost(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.like.userEmails.includes(user.email)) {
      throw new Error('Already liked');
    }

    post.like.count += 1;
    post.like.userEmails.push(user.email);

    const postUser = this.repository.getUserByEmail(post.userEmail)!;
    postUser.likedCount += 1;

    return {
      post: this.generatePostDto(post),
    }
  }

  unlikePost(postId: number, userEmail: string): GetPostDto {
    const user = this.repository.getUserByEmail(userEmail);
    if (!user) {
      throw new Error('User not found');
    }

    const post = this.repository.getPost(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (!post.like.userEmails.includes(user.email)) {
      throw new Error('Not liked');
    }

    post.like.count -= 1;
    post.like.userEmails = post.like.userEmails.filter(email => email !== user.email);

    const postUser = this.repository.getUserByEmail(post.userEmail)!;
    postUser.likedCount -= 1;

    return {
      post: this.generatePostDto(post),
    }
  }

  claimPost(postId: number, userEmail: string): GetPostDto {
    const user = this.repository.getUserByEmail(userEmail);
    if (!user) {
      throw new Error('User not found');
    }

    const post = this.repository.getPost(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (post.claimed) {
      throw new Error('Already claimed');
    }

    if (post.state !== 'confirmed' && post.state !== 'bad') {
      throw new Error('Post is not claimable');
    }

    if (post.state === 'confirmed') {
      for (const voterEmail of post.vote.goodVoterEmails) {
        const voter = this.repository.getUserByEmail(voterEmail)!;
        voter.worldBalance += 1;
        voter.successVoteCount += 1;
      }
      for (const voterEmail of post.vote.badVoterEmails) {
        const voter = this.repository.getUserByEmail(voterEmail)!;
        voter.failVoteCount += 1;
      }
    } else {
      for (const voterEmail of post.vote.badVoterEmails) {
        const voter = this.repository.getUserByEmail(voterEmail)!;
        voter.worldBalance += 1;
        voter.successVoteCount += 1;
      }
      for (const voterEmail of post.vote.goodVoterEmails) {
        const voter = this.repository.getUserByEmail(voterEmail)!;
        voter.failVoteCount += 1;
      }
      const postUser = this.repository.getUserByEmail(post.userEmail)!;
      postUser.badPostCount += 1;
    }

    user.worldBalance += 1;
    post.claimed = true;

    return {
      post: this.generatePostDto(post),
    }
  }

  createReply(postId: number, userEmail: string, reply: string): GetPostDto {
    const user = this.repository.getUserByEmail(userEmail);
    if (!user) {
      throw new Error('User not found');
    }

    const post = this.repository.getPost(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    post.replies.push({
      content: reply,
      createdAt: Date.now(),
      userEmail: user.email,
    });

    return {
      post: this.generatePostDto(post),
    }
  }

  createPost(content: string, userEmail: string): GetPostDto {
    const post = this.repository.createPost(content, userEmail);
    return {
      post: this.generatePostDto(post),
    }
  }

  findPosts(state?: PostState, verificationLevel?: VerificationLevel): GetPostsDto {
    const posts = this.repository.findPosts(state, verificationLevel);
    return {
      posts: posts.map(post => this.generatePostDto(post)),
    }
  }

  generatePostDto(post: Post): PostDto {
    return {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      state: post.state,
      vote: post.vote,
      like: post.like,
      claimed: post.claimed,
      replies: post.replies.map(reply => ({
        content: reply.content,
        createdAt: reply.createdAt,
        user: this.repository.getUserByEmail(reply.userEmail)!,
      })),
      user: this.repository.getUserByEmail(post.userEmail)!,
    }
  }
}