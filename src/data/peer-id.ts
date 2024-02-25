import os from "os";

import config from "../../config.json";

/**
 * The peer id of the current device.
 */
const my_peer_id = config.my_peer_id || os.hostname();

const setting = {...config, my_peer_id};

export default my_peer_id;
