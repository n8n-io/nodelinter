// MISMATCHED_NONOAUTH_CREDENTIALS_TEST_METHOD_REFERENCE
export class ElasticSecurity implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Elastic Security',
    name: 'elasticSecurity',
    icon: 'file:elasticSecurity.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Consume the Elastic Security API',
    defaults: {
      name: 'Elastic Security',
      color: '#f3d337',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'elasticSecurityApi',
        required: true,
        testedBy: 'elasticSecurityApiTest',
      },
    ],
  };

  methods = {
    credentialTest: {
      async XXXelasticSecurityApiTest(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<NodeCredentialTestResult> {
        // ...
      },
    },
  };
}
