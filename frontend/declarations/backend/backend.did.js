export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Post = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'author' : IDL.Opt(IDL.Principal),
    'timestamp' : IDL.Int,
    'category' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'createPost' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'getPosts' : IDL.Func([], [IDL.Vec(Post)], ['query']),
    'getPostsByCategory' : IDL.Func([IDL.Text], [IDL.Vec(Post)], ['query']),
    'isUserAuthenticated' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'login' : IDL.Func([], [Result], []),
    'logout' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
