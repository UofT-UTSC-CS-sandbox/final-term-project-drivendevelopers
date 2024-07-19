import React from 'react';

const FriendRequestsNotification = ({ friendRequests }) => {
  return (
    friendRequests.length > 0 && (
      <div style={{ marginBottom: '20px', color: 'red' }}>
        You have {friendRequests.length} friend request(s)! Please go to Notifications.
      </div>
    )
  );
};

export default FriendRequestsNotification;