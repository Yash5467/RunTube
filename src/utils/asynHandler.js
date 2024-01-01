const asynHandler = (fn) => {
 return  async (req, res, next) => {
    try {
    await fn(req, res, next);
    } catch (error) {
      res.status( 400).json({
        success: false,
        message: error.message,
      });
    }
  };
};


export default asynHandler