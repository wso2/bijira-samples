// Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com/) All Rights Reserved.

// WSO2 LLC. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at

// http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied. See the License for the
// specific language governing permissions and limitations
// under the License.

class User {
  /**
   * Creates an instance of a User.
   * 
   * @param {Object} socket - The WebSocket connection for the user.
   * @param {string} username - The username of the user.
   * @param {Array} clientIDs - An array to keep track of existing user IDs.
   */
  constructor(socket, username, clientIDs) {
    this.socket = socket;
    this.username = username;
    this.currentRoom = null;

    this.id = 0;
    while (this.id == 0 || clientIDs.includes(this.id)) {
      this.id = Math.floor(Math.random() * 1000000000);
    }
    clientIDs.push(this.id);
  }
}

module.exports = User;
