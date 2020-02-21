if (typeof Buffer === "undefined") {
  global.Buffer = require("buffer").Buffer;
}

import * as Random from "expo-random";

export const RNS_MAX = 1024;

const max = (a, b) => (a < b ? b : a);
let RNS = Buffer.allocUnsafe(0);

function noop() {}

function toBuffer(nativeStr) {
  return new Buffer(nativeStr, "base64");
}

export async function init() {
  await generate(RNS_MAX);
}

async function generate(byteCount) {
  if (byteCount == 0) {
    return;
  }

  const buff = await Random.getRandomBytesAsync(byteCount);
  RNS = Buffer.concat([RNS, Buffer.from(buff)]);
}

export function randomBytes(length, cb) {
  if (!cb) {
    if (length <= RNS.length) {
      const ret = Buffer.from(RNS.slice(0, length));
      RNS = RNS.slice(length, RNS.length - length);

      generate(max(0, RNS_MAX - RNS.length));

      return ret;
    } else {
      throw new Error("Should be prepare enough random numbers");
    }
  }

  Random.getRandomBytesAsync(length)
    .then(randomBytes => {
      cb(null, Buffer.from(randomBytes));
    })
    .catch(cb);
}

init();
