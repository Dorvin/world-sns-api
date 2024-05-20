import {Post, Reply, User, VerificationLevel} from "../model/models.ts";

export type CreateUserDto = {
  email: string;
  name: string;
  givenName: string;
  familyName: string;
  verificationLevel: VerificationLevel;
}

export type LoginResponseDto = {
  user: User;
  sessionToken: string;
}

export type GetUserDto = {
  user: User | null;
}

export type ReplyDto = Omit<Reply, 'userEmail'> & {
  user: User;
}

export type PostDto = Omit<Post, 'replies' | 'userEmail'> & {
  replies: ReplyDto[];
  user: User;
}

export type GetPostDto = {
  post: PostDto;
}

export type GetPostsDto = {
  posts: PostDto[];
}
