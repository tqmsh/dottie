import React from 'react';
import { EndpointTable } from '../../page-components';
import GetUserMe from './get-user-me/EndpointRow';
import GetUserId from './get-user-id/EndpointRow';
import PutUserId from './put-user-id/EndpointRow';
import DeleteUserId from './delete-user-id/EndpointRow';
import PostUserPwReset from './post-user-pw-reset/EndpointRow';
import PostUserPwUpdate from './post-user-pw-update/EndpointRow';

/**
 * Container component for user endpoints
 */
export default function UserEndpoints() {
  return (
    <EndpointTable title="User Endpoints">
      <GetUserMe />
      <GetUserId />
      <PutUserId />
      <DeleteUserId />
      <PostUserPwReset />
      <PostUserPwUpdate />
    </EndpointTable>
  );
} 