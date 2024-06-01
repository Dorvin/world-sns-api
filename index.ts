import express, {Express, Request, Response} from "express";
import cors from 'cors';
import {PORT} from "./const.ts";
import {getErrorMessage} from "./utils/errors.ts";
import {Repository} from "./repository/repository.ts";
import {Service} from "./service/service.ts";
import {PostState, VerificationLevel} from "./model/models.ts";

// set up express app
const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set up service
const service = new Service(new Repository());


app.get("/", (req: Request, res: Response) => {
  res.send("World SNS API Server is running");
});

app.post("/login", async (req: Request, res: Response) => {
  const { code } = req.body;

  try {
    const data = await service.login(code);
    res.json(data);
  } catch (error) {
    res.status(400).json({
      'error': getErrorMessage(error),
    });
  }
});
app.get("/users/me",(req: Request, res: Response) => {
  const sessionToken = req.header('World-Sns-Session');
  try {
    const email = service.verifySession(sessionToken);
    const data = service.getUserByEmail(email);
    res.json(data);
  } catch (error) {
    res.status(400).json({
      'error': getErrorMessage(error),
    });
  }
});
app.get("/users/:email",(req: Request, res: Response) => {
  const email = req.params.email;
  try {
    const data = service.getUserByEmail(email);
    res.json(data);
  } catch (error) {
    res.status(400).json({
      'error': getErrorMessage(error),
    });
  }
});
app.post("/posts", (req: Request, res: Response) => {
  const sessionToken = req.header('World-Sns-Session');
  const { content } = req.body;
  try {
    const email = service.verifySession(sessionToken);
    const data = service.createPost(content, email);
    res.json(data);
  } catch (error) {
    res.status(400).json({
      'error': getErrorMessage(error),
    });
  }
});
app.get("/posts", (req: Request, res: Response) => {
  const state = req.query.state as PostState | undefined;
  const verificationLevel = req.query.verificationLevel as VerificationLevel | undefined;
  try {
    const data = service.findPosts(state, verificationLevel);
    res.json(data);
  } catch (error) {
    res.status(400).json({
      'error': getErrorMessage(error),
    });
  }
});
app.post("/posts/:id/votes", (req: Request, res: Response) => {
  const sessionToken = req.header('World-Sns-Session');
  const { vote } = req.body;
  const postId = parseInt(req.params.id, 10);
  if (vote !== 'good' && vote !== 'bad') {
    res.status(400).json({
      'error': 'Invalid vote',
    });
    return;
  }
  try {
    const email = service.verifySession(sessionToken);
    const data = service.votePost(postId, email, vote);
    res.json(data);
  } catch (error) {
    res.status(400).json({
      'error': getErrorMessage(error),
    });
  }
});
app.post("/posts/:id/claim", (req: Request, res: Response) => {
  const sessionToken = req.header('World-Sns-Session');
  const postId = parseInt(req.params.id, 10);
  try {
    const email = service.verifySession(sessionToken);
    const data = service.claimPost(postId, email);
    res.json(data);
  } catch (error) {
    res.status(400).json({
      'error': getErrorMessage(error),
    });
  }
});
app.post("/posts/:id/like", (req: Request, res: Response) => {
  const sessionToken = req.header('World-Sns-Session');
  const postId = parseInt(req.params.id, 10);
  try {
    const email = service.verifySession(sessionToken);
    const data = service.likePost(postId, email);
    res.json(data);
  } catch (error) {
    res.status(400).json({
      'error': getErrorMessage(error),
    });
  }
});
app.post("/posts/:id/unlike", (req: Request, res: Response) => {
  const sessionToken = req.header('World-Sns-Session');
  const postId = parseInt(req.params.id, 10);
  try {
    const email = service.verifySession(sessionToken);
    const data = service.unlikePost(postId, email);
    res.json(data);
  } catch (error) {
    res.status(400).json({
      'error': getErrorMessage(error),
    });
  }
});
app.post("/posts/:id/replies", (req: Request, res: Response) => {
  const sessionToken = req.header('World-Sns-Session');
  const { reply } = req.body;
  const postId = parseInt(req.params.id, 10);
  if (!reply) {
    res.status(400).json({
      'error': 'Reply is required',
    });
    return;
  }
  try {
    const email = service.verifySession(sessionToken);
    const data = service.createReply(postId, email, reply);
    res.json(data);
  } catch (error) {
    res.status(400).json({
      'error': getErrorMessage(error),
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`World SNS API Server is running at http://localhost:${PORT}`);
});
