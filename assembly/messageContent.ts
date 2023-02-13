// The entry file of your WebAssembly module.

import { SmartBuffer } from "./smartBuffer";

const V1 = 0x01;

export function MessageContentPack(
  subjectBytes: Uint8Array,
  signature: Uint8Array,
  attacheds: Uint8Array,
  previousMessageAddress: Uint8Array,
  bodyBytes: Uint8Array,
): Uint8Array {
  return PackV1(subjectBytes, signature, attacheds, previousMessageAddress, bodyBytes)
}

function PackV1(
  subjectBytes: Uint8Array,
  signature: Uint8Array,
  attacheds: Uint8Array,
  previousMessageAddress: Uint8Array,
  bodyBytes: Uint8Array,
) {
  const buf = SmartBuffer.ofSize(1 + 2 + subjectBytes.length + 2 + signature.length + 2 + attacheds.length + 2 + previousMessageAddress.length + bodyBytes.length);

  buf.writeUint8(V1);
  buf.writeBytes16Length(subjectBytes);
  buf.writeBytes16Length(signature);
  buf.writeBytes16Length(attacheds);
  buf.writeBytes16Length(previousMessageAddress);
  buf.writeBytes(bodyBytes);

  return buf.bytes
}

export function MessageContentUnpack(
  data: Uint8Array
): Uint8Array[] {
  const buf = new SmartBuffer(data);
  const version = buf.readUint8();

  if (version === V1) {
    return UnpackV1(buf, data, version)
  }
  return [new Uint8Array(0)]
}

function UnpackV1(
  buf: SmartBuffer,
  data: Uint8Array,
  version: i32
): Uint8Array[] {
  const subjectBytes = buf.readBytes16Length();
  const signature = buf.readBytes16Length();
  const attacheds = buf.readBytes16Length();
  const previousMessageAddress = buf.readBytes16Length();
  const bodyBytes = data.slice(version + 2 + subjectBytes.length + 2 + signature.length + 2 + attacheds.length + 2 + previousMessageAddress.length);

  return [subjectBytes, signature, attacheds, previousMessageAddress, bodyBytes]
}