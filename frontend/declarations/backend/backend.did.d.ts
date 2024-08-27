import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Post {
  'id' : bigint,
  'content' : string,
  'author' : [] | [Principal],
  'timestamp' : bigint,
  'category' : string,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export interface _SERVICE {
  'createPost' : ActorMethod<[string, string], Result_1>,
  'getPosts' : ActorMethod<[], Array<Post>>,
  'getPostsByCategory' : ActorMethod<[string], Array<Post>>,
  'isUserAuthenticated' : ActorMethod<[Principal], boolean>,
  'login' : ActorMethod<[], Result>,
  'logout' : ActorMethod<[], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
