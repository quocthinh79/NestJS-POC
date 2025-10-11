export class DeleteUserCommand {
  constructor(
    public readonly userId: number,
    public readonly requester: any,
  ) {}
}
