export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpireationDate: Date
  ) {}

  get token() {
    if (
      !this._tokenExpireationDate ||
      new Date() > this._tokenExpireationDate
    ) {
      return null;
    }
    return this._token;
  }
}
