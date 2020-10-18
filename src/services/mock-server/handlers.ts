import { rest } from "msw";

function withAPIUrl(path: string): string {
  return `${process.env.API_URL}${path}`;
}

const users = [
  {
    id: "3c105d1a-d588-4c65-bfb5-06abe48cd325",
    email: "user@example.com",
    password: "P@ssw0rd!",
    token: "123",
  },
  {
    id: "3c105d1a-d588-4c65-bfb5-06abe48cd326",
    email: "test@example.com",
    password: "P@ssw0rd!",
    token: "456",
  },
];

export const handlers = [
  rest.get(withAPIUrl("/auth/me"), (req, res, ctx) => {
    const authHeader: string | null = req.headers.get("authorization");

    if (!authHeader) {
      return res(ctx.status(401));
    }

    const token = authHeader.split(" ")[1];
    const currentUser = users.find((user) => user.token === token);

    if (!currentUser) {
      return res(ctx.status(401));
    }

    return res(
      ctx.delay(300),
      ctx.status(200),
      ctx.json({
        user: currentUser,
      }),
    );
  }),
  rest.delete(withAPIUrl("/auth/me"), (_, res, ctx) => {
    return res(ctx.delay(300), ctx.status(200));
  }),
  rest.post<{ email: string; password: string }>(withAPIUrl("/auth/login"), (req, res, ctx) => {
    const user = users.find(({ password, email }) => {
      return password === req.body.password && email === req.body.email;
    });

    if (!user) {
      return res(
        ctx.delay(1000),
        ctx.status(401),
        ctx.json({
          errors: {
            general: "Invalid e-mail or password.",
          },
        }),
      );
    }

    return res(
      ctx.delay(1500),
      ctx.status(200),
      ctx.json({
        user: {
          id: user.id,
          email: user.email,
        },
        token: user.token,
      }),
    );
  }),
  rest.post(withAPIUrl("/auth/forgot-password"), (_, res, ctx) => {
    return res(ctx.delay(1000), ctx.status(200));
  }),
  rest.post<{ token: string }>(withAPIUrl("/auth/reset-password"), (req, res, ctx) => {
    if (!req.body.token) {
      return res(
        ctx.delay(500),
        ctx.status(401),
        ctx.json({
          errors: {
            general: "Reset token is missing.",
          },
        }),
      );
    }

    if (req.body.token !== "xyz") {
      return res(
        ctx.delay(500),
        ctx.status(400),
        ctx.json({
          errors: {
            general: "Invalid reset token.",
          },
        }),
      );
    }

    return res(ctx.delay(1000), ctx.status(200));
  }),
  rest.post<{ email: string; password: string }>(withAPIUrl("/auth/register"), (req, res, ctx) => {
    const user = users.find(({ email }) => {
      return email === req.body.email;
    });

    if (user) {
      return res(
        ctx.delay(1000),
        ctx.status(400),
        ctx.json({
          errors: {
            general: "This e-mail address is already used.",
          },
        }),
      );
    }

    return res(ctx.delay(1000), ctx.status(201));
  }),
  rest.post<{ token: string }>(withAPIUrl("/auth/register/activate"), (req, res, ctx) => {
    if (!req.body.token) {
      return res(
        ctx.delay(500),
        ctx.status(401),
        ctx.json({
          errors: {
            general: "Reset token is missing.",
          },
        }),
      );
    }

    return res(ctx.delay(1000), ctx.status(200));
  }),
];
