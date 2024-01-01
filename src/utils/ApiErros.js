class ApiErros extends Error {
      constructor(
         statusCode,
         message,
         erros=[]
      )
      {
        super(message);
        this.statusCode=statusCode
        this.message=message;
        this.erros=erros;
      }
}


export {ApiErros}