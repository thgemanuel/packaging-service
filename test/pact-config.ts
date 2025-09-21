import { VerifierOptions } from '@pact-foundation/pact';

export interface PactVerifierConfig {
  port: number;
  consumerFilters: string[];
}

export const createPactVerifierOptions = (
  config: PactVerifierConfig,
): VerifierOptions => {
  return {
    provider: 'ProposalService',
    providerBaseUrl: `http://localhost:${config.port}`,
    pactBrokerUrl: 'https://pact-broker.prod.internal.guideline.cloud/',
    providerVersion: process.env.GIT_COMMIT ?? '1.0.' + process.env.HOSTNAME,
    consumerVersionTags: ['latest'],
    consumerFilters: config.consumerFilters,
    publishVerificationResult: true,
    timeout: 30000,
  };
};

export const createEventPublisherOptions = (consumerFilters: string[]) => {
  return {
    provider: 'ProposalService',
    pactBrokerUrl: 'https://pact-broker.prod.internal.guideline.cloud/',
    providerVersion: process.env.GIT_COMMIT ?? '1.0.' + process.env.HOSTNAME,
    consumerVersionTags: ['latest'],
    consumerFilters,
    publishVerificationResult: true,
    timeout: 30000,
  };
};
