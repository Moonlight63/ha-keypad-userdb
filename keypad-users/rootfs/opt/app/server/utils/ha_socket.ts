// JS extensions in imports allow tsc output to be consumed by browsers.
import { createSocket } from "./ha_socket_utils/socket.js";
import { Connection, ConnectionOptions } from "./ha_socket_utils/connection.js";

export * from "./ha_socket_utils/auth.js";
export * from "./ha_socket_utils/collection.js";
export * from "./ha_socket_utils/connection.js";
export * from "./ha_socket_utils/config.js";
export * from "./ha_socket_utils/services.js";
export * from "./ha_socket_utils/entities.js";
export * from "./ha_socket_utils/errors.js";
export * from "./ha_socket_utils/socket.js";
export * from "./ha_socket_utils/types.js";
export * from "./ha_socket_utils/commands.js";

export async function createConnection(options?: Partial<ConnectionOptions>) {
  const connOptions: ConnectionOptions = {
    setupRetry: 0,
    createSocket,
    ...options,
  };

  const socket = await connOptions.createSocket(connOptions);
  const conn = new Connection(socket, connOptions);
  return conn;
}
