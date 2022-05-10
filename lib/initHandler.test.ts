// TODO move to initHandler.test.ts
// describe(`MIDDLEWARE ${ENDPOINT}`, () => {
//   const mockReqRes = getReqResMocker("GET", ENDPOINT, token);

//   it("returns 401 if lacking token", async () => {
//     const { req, res } = mockReqRes();
//     req.headers.authorization = ""

//     await idHandler(req, res);
//     expect(res.statusCode).toBe(401);
//   });

// });

  // TODO move to initHandler.test.ts
  // it("returns 405 for invalid methods", async () => {
  //   const { req, res } = mockReqRes();

  //   req.method = "GET";
  //   await authHandler(req, res);
  //   expect(res.statusCode).toBe(405);
  //   res.statusCode = 69;

  //   req.method = "PUT";
  //   await authHandler(req, res);
  //   expect(res.statusCode).toBe(405);
  //   res.statusCode = 69;

  //   req.method = "DELETE";
  //   await authHandler(req, res);
  //   expect(res.statusCode).toBe(405);
  //   res.statusCode = 69;

  //   req.method = "randomsaea123";
  //   await authHandler(req, res);
  //   expect(res.statusCode).toBe(405);
  // });