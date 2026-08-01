const crisisDetection = require('../middleware/crisisDetection');

describe('Crisis Detection Safety Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  it('should trigger crisis response when message contains self-harm or suicide keywords', () => {
    req.body.message = 'I feel overwhelmed and I want to kill myself';

    crisisDetection(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          botMessage: expect.objectContaining({
            message: expect.stringContaining('iCall')
          })
        })
      })
    );
  });

  it('should call next() for standard non-crisis messages', () => {
    req.body.message = 'How can I manage exam anxiety?';

    crisisDetection(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
