export interface Environments {
  accountId: string;
  stage: string;
  region: string;
  userPoolId: string;
  clientId: string;
}

export const ENV_VARS: Environments = {
  accountId: process.env.ACCOUNT_ID,
  stage: process.env.STAGE,
  region: process.env.REGION,
  userPoolId: process.env.USER_POOL_ID,
  clientId: process.env.CLIENT_ID,
};
