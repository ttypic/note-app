const jwtConstants = {
  secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};

export const getJwtSecret = () => {
  return process.env.JWT_SECRET ?? jwtConstants.secret
}
