export interface UseCase<TParam, TResponse> {
  execute(params: TParam): Promise<TResponse>;
}
