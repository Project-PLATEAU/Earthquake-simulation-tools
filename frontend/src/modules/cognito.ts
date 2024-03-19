import {
  CognitoUserPool,
  CognitoUser,
  ICognitoUserPoolData,
  AuthenticationDetails,
  CognitoUserAttribute,
  CognitoUserSession,
  ISignUpResult
} from 'amazon-cognito-identity-js'

/** ログイン */
const login = (email:string, password:string):Promise<CognitoUserSession> => {
  const poolData: ICognitoUserPoolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID!,
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID!,
  };
  const userPool = new CognitoUserPool(poolData);
  //ログイン認証情報
  const authenticationDetails = new AuthenticationDetails({
    Username: email,
    Password: password,
  });
  //Cognitoユーザー
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result)
      },
      onFailure: (err) => {
        reject(err)
      }
    })
  })
}

/**サインアップ:ユーザー名とパスワード入力 */
const signUp = (email:string, password:string): Promise<ISignUpResult | undefined> => {

  const nameAttr = { Name: 'name', Value: email };
  const emailAttr = { Name: 'email', Value: email };
  const now = Math.floor(new Date().getTime() / 1000);
  const upatedAtAttr = { Name: 'updated_at', Value: String(now)};

  const attributeList:CognitoUserAttribute[] = [];
  attributeList.push(new CognitoUserAttribute(nameAttr));
  attributeList.push(new CognitoUserAttribute(emailAttr));
  attributeList.push(new CognitoUserAttribute(upatedAtAttr));

  const poolData: ICognitoUserPoolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID!,
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID!,
  };
  const userPool = new CognitoUserPool(poolData);

  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

/** サインアップ:認証コード入力 */
const signUpConfirmation = (email:string, confirmationCode:string) => {
  const poolData: ICognitoUserPoolData = {
    UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID!,
    ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID!,
  };
  const userPool = new CognitoUserPool(poolData);
  //Cognitoユーザー
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool,
  });
  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(confirmationCode, true, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })
}

export { login, signUp, signUpConfirmation }